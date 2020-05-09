import { Module } from "@nestjs/common";

import { StatsService } from "./stats.service";
import { SteamModule } from "src/steam/steam.module";

@Module({
  imports: [SteamModule],
  exports: [StatsService],
  providers: [StatsService]
})
export class StatsModule {}
