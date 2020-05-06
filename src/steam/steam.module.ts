import { Module } from "@nestjs/common";

import { SteamService } from "./steam.service";

@Module({
  imports: [],
  providers: [SteamService]
})
export class SteamModule {}
