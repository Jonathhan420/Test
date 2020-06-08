// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Query } from "@nestjs/common";

import { LeaderboardService } from "./leaderboard.service";

@Controller("leaderboard")
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboards(@Query("by") orderBy = "total") {
    return this.leaderboardService.getLeaderboards(orderBy);
  }
}
