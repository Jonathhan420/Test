import { Module, HttpModule } from "@nestjs/common";

import { SteamService } from "./steam.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: "http://api.steampowered.com/",
        params: {
          key: config.get<string>("STEAM_KEY")
        }
      })
    })
  ],
  exports: [SteamService],
  providers: [SteamService]
})
export class SteamModule {}
