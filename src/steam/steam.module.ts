import { Module, CacheModule } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import { ConfigService } from "@nestjs/config";

import { SteamService } from "./steam.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get<string>("REDIS_HOST"),
        port: config.get<number>("REDIS_PORT")
      })
    })
  ],
  providers: [SteamService]
})
export class SteamModule {}
