import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "src/interfaces/jwt/Payload";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>("JWT_SECRET")
    });
  }

  async validate(payload: Payload, done: Function) {
    try {
      done(null, payload);
    } catch (err) {
      throw new UnauthorizedException("Invalid token", err.message);
    }
  }
}
