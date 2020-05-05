import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":steamid")
  async getProfile(@Param("steamid") steamid: string) {
    return this.userService.getUserBySteamId(steamid);
  }
}
