import { Injectable, ForbiddenException } from "@nestjs/common";

import {
  Inventory,
  InventoryDescription
} from "src/interfaces/steam/Inventory";
import { Stats } from "src/entities/stats.entity";
import { TourCode, Missions, Tour } from "./Tours";
import { User } from "src/entities/user.entity";
import { SteamService } from "src/steam/steam.service";

@Injectable()
export class StatsService {
  constructor(private steamService: SteamService) {}
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

  async getStatsForUser(user: User) {
    try {
      const inventory = await this.steamService.getInventory(user.steamid);
      const stats = this.getStatsFromInventory(inventory);

      user.stats = [stats];
    } catch (error) {
      if (error instanceof ForbiddenException) {
        user.private = true;
      } else {
        user.error = true;
      }
      user.stats = [new Stats({})];
    }

    return user;
  }
}
