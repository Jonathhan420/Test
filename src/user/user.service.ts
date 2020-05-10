import { Injectable } from "@nestjs/common";
import { InjectRepository, InjectConnection } from "@nestjs/typeorm";
import { Repository, Connection, MoreThan } from "typeorm";
import { subHours } from "date-fns";

import { User } from "src/entities/user.entity";
import { Player } from "src/interfaces/steam/GetPlayerSummaries";
import { SteamService } from "src/steam/steam.service";
import { StatsService } from "src/stats/stats.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectConnection() private database: Connection,
    private steamService: SteamService,
    private statsService: StatsService
  ) {}

  private readonly AVATAR_ID = /[0-9a-f]{40}/;

  private async getInternalId(steamid: string) {
    try {
      const user = await this.userRepo.findOneOrFail({
        select: ["id"],
        where: {
          steamid
        }
      });

      return user.id;
    } catch {
      return;
    }
  }

  private async getBySteamId(steamid: string) {
    return this.userRepo.findOneOrFail({ steamid });
  }

  private async createNewUser(player: Player) {
    const id = await this.getInternalId(player.steamid);

    let user = new User({
      id,
      steamid: player.steamid,
      name: player.personaname,
      avatar: player.avatar.match(this.AVATAR_ID)[0],
      private: player.communityvisibilitystate !== 3
    });

    user = await this.statsService.getStatsForUser(user);

    return user;
  }

  async upsertUserFromPlayer(player: Player) {
    let user: User;
    try {
      user = await this.getBySteamId(player.steamid);
    } catch {
      user = await this.createNewUser(player);
      await this.database.manager.save(user);
    }

    return user;
  }

  private async upsertUserBySteamId(steamid: string) {
    const player = await this.steamService.getPlayer(steamid);

    return this.upsertUserFromPlayer(player);
  }

  async getUserBySteamId(steamid: string) {
    let user: User;
    try {
      user = await this.userRepo.findOneOrFail({
        relations: ["comments", "stats"],
        where: {
          steamid,
          updated: MoreThan(subHours(Date.now(), 6))
        }
      });
    } catch {
      user = await this.upsertUserBySteamId(steamid);
    }

    return user;
  }
}
