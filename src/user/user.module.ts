import { JwtStrategy } from "src/auth/jwt.strategy";
import { User } from "src/entities/user.entity";
import { StatsModule } from "src/stats/stats.module";
import { SteamModule } from "src/steam/steam.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), SteamModule, StatsModule],
  exports: [UserService],
  providers: [UserService, JwtStrategy],
  controllers: [UserController]
})
export class UserModule {}
