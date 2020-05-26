import { Module, Logger } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SteamModule } from "src/steam/steam.module";
import { StatsService } from "./stats.service";
import { Stats } from "src/entities/stats.entity";
import { User } from "src/entities/user.entity";

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
