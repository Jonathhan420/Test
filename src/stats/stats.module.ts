import { Stats } from "src/entities/stats.entity";
import { User } from "src/entities/user.entity";
import { SteamModule } from "src/steam/steam.module";

import { Logger, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StatsService } from "./stats.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Stats, User]),
    ScheduleModule.forRoot(),
    SteamModule
  ],
  exports: [StatsService],
  providers: [StatsService, Logger]
})
export class StatsModule {}
