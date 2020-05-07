import {
  Injectable,
  HttpService,
  NotFoundException,
  ServiceUnavailableException
} from "@nestjs/common";
import { AxiosResponse } from "axios";

import { PlayerSummaries } from "src/interfaces/steam/GetPlayerSummaries";
import { ConfigService } from "@nestjs/config";
import { Inventory } from "src/interfaces/steam/Inventory";

@Injectable()
export class SteamService {
  constructor(private axios: HttpService, private config: ConfigService) {}

  private readonly STEAM_KEY = this.config.get<string>("STEAM_KEY");

  async getPlayer(steamid: string) {
    let response: AxiosResponse<PlayerSummaries>;
    try {
      response = await this.axios
        .get("/ISteamUser/GetPlayerSummaries/v0002/", {
          params: { steamids: steamid, key: this.STEAM_KEY }
        })
        .toPromise();
    } catch {
      throw new ServiceUnavailableException(
        "Steam API is currently unavailable."
      );
    }

    if (response.data.response.players.length < 1)
      throw new NotFoundException("Player doesn't exist.");

    return response.data.response.players[0];
  }

  async getInventory(steamid: string) {
    let response: AxiosResponse<Inventory>;
    try {
      response = await this.axios
        .get("http://steamcommunity.com/inventory/" + steamid + "/440/2", {
          params: {
            l: "english",
            count: 3000
          }
        })
        .toPromise();
    } catch {
      throw new ServiceUnavailableException(
        "Steam API is currently unavailable."
      );
    }

    return response.data;
  }
}
