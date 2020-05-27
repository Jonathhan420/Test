import { Strategy } from "passport-steam";
import { Player } from "src/interfaces/steam/GetPlayerSummaries";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "./auth.service";

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, "steam") {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      returnURL: config.get<string>("API_URL") + "/auth/login",
      realm: config.get<string>("API_URL"),
      apiKey: config.get<string>("STEAM_KEY")
    });
  }

  async validate(
    _identifier: string,
    profile: any,
    done: Function
  ): Promise<void> {
    try {
      const player: Player = profile._json;
      const token = await this.authService.validateLogin(player);

      return done(null, token);
    } catch (error) {
      return done(error, null);
    }
  }
}
