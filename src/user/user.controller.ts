import { User } from "src/decorators/user.decorator";
import { Payload } from "src/interfaces/jwt/Payload";

import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":steamid")
  async getProfile(
    @Param("steamid") steamid: string,
    @Query("refresh") refresh: string
  ) {
    return this.userService.getUserBySteamId(steamid, null, refresh === "true");
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":steamid/authenticated")
  async getAuthenticatedProfile(
    @Param("steamid") steamid: string,
    @Query("refresh") refresh: string,
    @User() requester: Payload
  ) {
    return this.userService.getUserBySteamId(
      steamid,
      requester.steamid,
      refresh === "true"
    );
  }
}
