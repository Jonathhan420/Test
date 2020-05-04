import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SteamStrategy } from "./steam.strategy";

@Module({
  providers: [AuthService, SteamStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
