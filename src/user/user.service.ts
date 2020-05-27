import { User } from "src/entities/user.entity";
import { Player } from "src/interfaces/steam/GetPlayerSummaries";
import { StatsService } from "src/stats/stats.service";
import { SteamService } from "src/steam/steam.service";
import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private steamService: SteamService,
    private statsService: StatsService
  ) {}

  private readonly AVATAR_ID = /[0-9a-f]{40}/;

  private async getIdOnly(steamid: string) {
    let user: User;
    try {
      user = await this.userRepo.findOneOrFail({
        select: ["id"],
        where: {
          steamid
        }
      });
    } catch {
      user = new User({
        steamid
      });
    }

    return user;
  }

  async upsertUserFromPlayer(player: Player) {
    let user = await this.getIdOnly(player.steamid);

    user.name = player.personaname;
    user.steamid = player.steamid;
    user.avatar = player.avatar.match(this.AVATAR_ID)[0];
    user.private = player.communityvisibilitystate !== 3;
    user.randomMagic();

    await this.userRepo.save(user);
    user = await this.statsService.getStatsForUser(user);
    return user;
  }

  private async createUserBySteamid(steamid: string) {
    const player = await this.steamService.getPlayer(steamid);

    return this.upsertUserFromPlayer(player);
  }

  private async find(
    steamid: string,
    requester: string = null,
    recent = false
  ) {
    const builder = this.userRepo.createQueryBuilder("user");

    let query = builder
      .where("user.steamid = :steamid", { steamid })
      .leftJoinAndSelect("user.stats", "stats")
      .leftJoinAndSelect("user.comments", "comments")
      .leftJoinAndSelect("comments.author", "commentsAuthor");

    if (steamid === requester) {
      query = query
        .leftJoinAndSelect("user.authoredComments", "authoredComments")
        .leftJoinAndSelect(
          "authoredComments.location",
          "authoredCommentsLocation"
        );
    }

    if (recent) {
      query = query.andWhere("user.updated >= NOW() - INTERVAl 6 HOUR");
    }

    const user = await query.getOne();

    if (!user)
      throw new NotFoundException(
        "User couldn't be found with specified options."
      );
    return user;
  }

  async getUserBySteamId(
    steamid: string,
    requester: string = null,
    refresh = false
  ) {
    if (refresh) {
      await this.createUserBySteamid(steamid);
      return this.find(steamid, requester);
    }

    let user: User;
    try {
      user = await this.find(steamid, requester, true);
    } catch {
      const { error } = await this.createUserBySteamid(steamid);
      user = await this.find(steamid, requester);

      user.error = error;
    }

    return user;
  }
}
