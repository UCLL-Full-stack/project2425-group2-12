// front-end/types/index.ts

export interface Player {
  id: string;
  name: string;
  role: string;
}

export interface Team {
  id: string;
  name: string;
  captainId: string;
  players: Player[];
}

export interface CreateTeamDTO {
  name: string;
  captainId: string;
}

export interface AddPlayerDTO {
  teamId: string;
  player: Player;
}
