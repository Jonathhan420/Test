import { Injectable, HttpService } from "@nestjs/common";
import { AxiosResponse } from "axios";

import { PlayerSummaries } from "src/interfaces/steam/GetPlayerSummaries";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SteamService {
  constructor(private axios: HttpService, private config: ConfigService) {}

  private readonly STEAM_KEY = this.config.get<string>("STEAM_KEY");

  async getPlayer(steamid: string) {
    const response: AxiosResponse<PlayerSummaries> = await this.axios
      .get("/ISteamUser/GetPlayerSummaries/v0002/", {
        params: { steamids: steamid, key: this.STEAM_KEY }
      })
      .toPromise();

    return response.data.response.players[0];
  }
}
