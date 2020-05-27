import { HttpModule, Module } from "@nestjs/common";

import { SteamService } from "./steam.service";

@Module({
  imports: [
    HttpModule.register({
      baseURL: "http://api.steampowered.com/"
    })
  ],
  exports: [SteamService],
  providers: [SteamService]
})
export class SteamModule {}
