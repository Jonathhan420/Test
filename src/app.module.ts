import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";
import { Stats } from "./entities/stats.entity";
import { StatsModule } from "./stats/stats.module";
import { SteamModule } from "./steam/steam.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USER"),
        password: config.get<string>("DB_PASS"),
        autoLoadEntities: true,
        entities: [Stats],
        database: "development",
        synchronize: true,
        logging: true,

        ...(config.get<string>("ENV_NODE") == "production" && {
          synchronize: false,
          logging: false,
          database: "production"
        })
      })
    }),
    AuthModule,
    UserModule,
    CommentModule,
    SteamModule,
    StatsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
