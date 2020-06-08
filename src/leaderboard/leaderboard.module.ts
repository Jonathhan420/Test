import { Stats } from "src/entities/stats.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LeaderboardController } from "./leaderboard.controller";
import { LeaderboardService } from "./leaderboard.service";

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  providers: [LeaderboardService],
  controllers: [LeaderboardController]
})
export class LeaderboardModule {}
