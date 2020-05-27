import { Response } from "express";
import { User } from "src/decorators/user.decorator";

import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("login")
  @UseGuards(AuthGuard("steam"))
  async login(@User() token: string, @Res() res: Response): Promise<void> {
    return this.authService.redriectLogin(token, res);
  }
}
