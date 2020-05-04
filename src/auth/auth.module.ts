import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SteamStrategy } from "./steam.strategy";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [UserModule],
  providers: [AuthService, SteamStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
