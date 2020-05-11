export interface GameStats {
  playerstats: Playerstats;
}

export interface Playerstats {
  steamID: string;
  gameName: string;
  stats: { [key: string]: Stat };
  achievements: { [key: string]: Achievement };
}

export interface Achievement {
  achieved: number;
}

export interface Stat {
  value: number;
}
