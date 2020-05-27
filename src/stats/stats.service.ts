import { subDays } from "date-fns";
import { Stats } from "src/entities/stats.entity";
import { User } from "src/entities/user.entity";
import { GameStats } from "src/interfaces/steam/GetUserStatsForGame";
import {
  Inventory,
  InventoryDescription
} from "src/interfaces/steam/Inventory";
import { SteamService } from "src/steam/steam.service";
import { LessThan, Repository } from "typeorm";

import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";

import { Missions, Tour, TourCode } from "./Tours";

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats) private statsRepo: Repository<Stats>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private steamService: SteamService,
    private logger: Logger
  ) {
    this.logger.setContext("StatsModule");
  }

  private isBadge({ name }: InventoryDescription) {
    return name.startsWith("Operation ");
  }

  private getStatsFromInventory(inventory: Inventory) {
    const stats = new Stats({});

    stats.tickets = inventory.assets.filter(({ classid }) => {
      return ["101785317", "73625018"].includes(classid);
    }).length;

    const badges = inventory.descriptions.filter(this.isBadge);
    for (const badge of badges) {
      const name = badge.name.match(/^Operation ([a-zA-Z ]+) Badge$/)[1];
      const tours = parseInt(badge.type.match(/^Level (\d+) Badge$/)[1]);
      const tourCode = TourCode[name];

      stats["tours_" + tourCode] = tours;

      const missions: string[] = Missions[Tour[tourCode]];
      const progress = missions
        .map(mission => {
          return badge.descriptions.find(({ value }) => value.endsWith(mission))
            ? 1
            : 0;
        })
        .join("");

      stats["progress_" + tourCode] = parseInt(progress, 2);
    }

    return stats;
  }

  private assignRobotsToStats(gameStats: GameStats, stats: Stats) {
    stats.robots =
      gameStats.playerstats.stats["TF_MVM_KILL_ROBOT_MEGA_GRIND_STAT"].value;

    return stats;
  }

  async getStatsForUser(user: User) {
    let statsFinal = new Stats({});
    let problem = 0;

    try {
      const inventory = await this.steamService.getInventory(user.steamid);
      statsFinal = this.getStatsFromInventory(inventory);
    } catch (error) {
      problem += 1;
      if (error instanceof ForbiddenException) {
        user.private = true;
      } else {
        user.error = true;
      }
    }

    try {
      const gameStats = await this.steamService.getGameStats(user.steamid);
      statsFinal = this.assignRobotsToStats(gameStats, statsFinal);
    } catch {
      problem += 1;
      user.private = true;
    }

    statsFinal.user = user;

    if (problem <= 1) {
      await this.statsRepo.save(statsFinal);
    }
    return user;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async purge() {
    this.logger.log("Purging old & duplicate stats");

    const removeDupeDay =
      "DELETE FROM stats WHERE id NOT IN (SELECT to_save FROM (SELECT MAX(id) AS to_save FROM stats GROUP BY userId, DATE(time)) tmp)";

    return Promise.all([
      this.statsRepo.query(removeDupeDay),
      this.statsRepo.delete({
        time: LessThan(subDays(new Date(), 31))
      })
    ]);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async autoQuery() {
    this.logger.log("Updating users with more than 25 tours");

    const raw = await this.statsRepo
      .createQueryBuilder()
      .select("userId")
      .groupBy("userId")
      .having("MAX(time) < (NOW() - INTERVAL 24 HOUR)")
      .andHaving(
        "MAX(tours_ST + tours_OS + tours_GG + tours_ME + tours_TC) >= 25"
      )
      .getRawMany();

    const users = await this.userRepo.findByIds(
      raw.map(({ userId }) => userId)
    );

    const promises: Promise<any>[] = [];
    for (const user of users) {
      const promise = this.getStatsForUser(user);
      promise.catch(e => e);

      promises.push(promise);
    }

    return Promise.all(promises);
  }
}
