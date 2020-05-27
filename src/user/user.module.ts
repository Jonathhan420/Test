import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UserController } from "./user.controller";
import { SteamModule } from "src/steam/steam.module";
import { StatsModule } from "src/stats/stats.module";
import { JwtStrategy } from "src/auth/jwt.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User]), SteamModule, StatsModule],
  exports: [UserService],
  providers: [UserService, JwtStrategy],
  controllers: [UserController]
})
export class UserModule {}
