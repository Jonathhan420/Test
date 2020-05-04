import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign } from "jsonwebtoken";

import { Player } from "src/interfaces/steam/GetPlayerSummaries";
import { Payload } from "src/interfaces/jwt/Payload";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  private readonly JWT_SECRET = this.config.get<string>("JWT_SECRET");
  private readonly FRONT_URL = this.config.get<string>("FRONT_URL");

  async validateLogin(player: Player): Promise<string> {
    try {
      const payload = { steamid: player.steamid } as Payload;
      const token = sign(payload, this.JWT_SECRET, { expiresIn: "7d" });

      return token;
    } catch (error) {
      throw new InternalServerErrorException(
        "An error has occured during the sign-in process.",
        error.message
      );
    }
  }

  redriectLogin(token: string, res: Response) {
    if (token) return res.redirect(this.FRONT_URL + "/login/success/" + token);
    else return res.redirect(this.FRONT_URL + "/login/fail/");
  }
}
