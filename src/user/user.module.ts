import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UserController } from "./user.controller";
import { SteamModule } from "src/steam/steam.module";
import { StatsModule } from "src/stats/stats.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), SteamModule, StatsModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
