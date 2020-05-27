import { User } from "src/decorators/user.decorator";

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
    @User() requester: string
  ) {
    return this.userService.getUserBySteamId(
      steamid,
      requester,
      refresh === "true"
    );
  }
}
