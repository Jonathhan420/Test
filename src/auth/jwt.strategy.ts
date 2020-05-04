import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Payload } from "src/interfaces/jwt/Payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>("JWT_SECRET")
    });
  }

  async validate({ steamid }: Payload, done: Function) {
    try {
      done(null, steamid);
    } catch (err) {
      throw new UnauthorizedException("Invalid token", err.message);
    }
  }
}
