import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/entities/user.entity";
import { Player } from "src/interfaces/steam/GetPlayerSummaries";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  private readonly AVATAR_ID = /[0-9a-f]{40}/;

  private async getBySteamId(steamid: string) {
    return this.userRepo.findOneOrFail({ steamid });
  }

  async upsertUserFromPlayer(player: Player) {
    let user: User;
    try {
      user = await this.getBySteamId(player.steamid);
    } catch {
      user = new User({
        steamid: player.steamid,
        name: player.personaname,
        avatar: player.avatar.match(this.AVATAR_ID)[0],
        private: player.communityvisibilitystate !== 3
      });
    }

    return this.userRepo.save(user);
  }

  async getUserBySteamId(steamid: string) {
    let user: User;
    try {
      user = await this.userRepo.findOneOrFail({
        relations: ["comment"],
        where: {
          steamid
        }
      });
    } catch {
      throw new NotFoundException("User doesn't exist");
    }

    return user;
  }
}
