import { Controller, Get, Param, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":steamid")
  async getProfile(
    @Param("steamid") steamid: string,
    @Query("refresh") refresh: string
  ) {
    return this.userService.getUserBySteamId(steamid, refresh === "true");
  }
}
