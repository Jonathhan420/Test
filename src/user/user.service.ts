import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { subHours } from "date-fns";

import { User } from "src/entities/user.entity";
import { Player } from "src/interfaces/steam/GetPlayerSummaries";
import { SteamService } from "src/steam/steam.service";
import { StatsService } from "src/stats/stats.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
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

  async upsertUserFromPlayer(player: Player) {
    const id = await this.getInternalId(player.steamid);

    let user = new User({
      id,
      steamid: player.steamid,
      name: player.personaname,
      avatar: player.avatar.match(this.AVATAR_ID)[0],
      private: player.communityvisibilitystate !== 3
    });

    user = await this.statsService.getStatsForUser(user);

    return this.userRepo.save(user);
  }

  private async createUserBySteamid(steamid: string) {
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
          updated: MoreThan(subHours(new Date(), 22))
        }
      });
    } catch {
      user = await this.createUserBySteamid(steamid);
    }

    return user;
  }
}
