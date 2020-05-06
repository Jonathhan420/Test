import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UserController } from "./user.controller";
import { SteamModule } from "src/steam/steam.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), SteamModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
