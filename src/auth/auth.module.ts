import { UserModule } from "src/user/user.module";

import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SteamStrategy } from "./steam.strategy";

@Module({
  imports: [UserModule],
  providers: [AuthService, SteamStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
