import { Controller, Get, UseGuards, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

import { AuthService } from "./auth.service";
import { User } from "src/decorators/user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("login")
  @UseGuards(AuthGuard("steam"))
  async login(@User() token: string, @Res() res: Response): Promise<void> {
    return this.authService.redriectLogin(token, res);
  }
}
