import { Injectable, HttpService } from "@nestjs/common";
import { AxiosResponse } from "axios";

import { PlayerSummaries } from "src/interfaces/steam/GetPlayerSummaries";

@Injectable()
export class SteamService {
  constructor(private axios: HttpService) {}

  async getPlayer(steamid: string) {
    const response: AxiosResponse<PlayerSummaries> = await this.axios
      .get("/ISteamUser/GetPlayerSummaries/v0002/", {
        params: { steamids: steamid }
      })
      .toPromise();

    return response.data.response.players[0];
  }
}
