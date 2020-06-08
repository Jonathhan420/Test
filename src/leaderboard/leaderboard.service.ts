import { Stats } from "src/entities/stats.entity";
import { Tour } from "src/stats/Tours";
import { Repository } from "typeorm";

import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LeaderboardService {
  constructor(@InjectRepository(Stats) private statsRepo: Repository<Stats>) {}

  async getLeaderboards(orderBy: string) {
    let qb = this.statsRepo
      .createQueryBuilder("s")
      .leftJoin("s.user", "u")
      .select(["name", "avatar", "steamid"])
      .addSelect([
        "tours_ST",
        "tours_OS",
        "tours_GG",
        "tours_ME",
        "tours_TC",
        "robots"
      ])
      .addSelect(
        "(tours_ST + tours_OS + tours_GG + tours_ME + tours_TC)",
        "total"
      )
      .where(sq => {
        const query = sq
          .subQuery()
          .select("MAX(s.id)", "id")
          .from(Stats, "s")
          .groupBy("s.user")
          .getQuery();

        return "s.id IN " + query;
      })
      .limit(500);
    if (orderBy == "total") {
      qb = qb.orderBy("total", "DESC");
    } else if (orderBy.startsWith("tours_")) {
      let matches: string[];
      if ((matches = orderBy.match(/^tours_([A-Z]{2})$/))) {
        if (!Tour[matches[1]])
          throw new NotFoundException("Tour provided doesn't exist.");

        qb = qb.orderBy(orderBy, "DESC");
      } else {
        throw new BadRequestException("Invalid tour provided.");
      }
    } else {
      throw new BadRequestException("Invalid orderBy paramter.");
    }

    return qb.getRawMany();
  }
}
