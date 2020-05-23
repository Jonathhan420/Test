import { Module } from "@nestjs/common";

import { StatsService } from "./stats.service";
import { SteamModule } from "src/steam/steam.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stats } from "src/entities/stats.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Stats]), SteamModule],
  exports: [StatsService],
  providers: [StatsService]
})
export class StatsModule {}
