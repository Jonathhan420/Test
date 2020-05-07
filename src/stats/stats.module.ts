import { Module } from "@nestjs/common";

import { StatsService } from "./stats.service";
import { SteamModule } from "src/steam/steam.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [SteamModule, UserModule],
  providers: [StatsService]
})
export class StatsModule {}
