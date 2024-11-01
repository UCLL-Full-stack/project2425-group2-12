// back-end/types/index.ts

export interface CreateTeamDTO {
  name: string;
  captain: {
    user_id: string;
    name: string;
    email: string;
    password: string;
    role: 'captain' | 'player';
  };
}

export interface AddPlayerDTO {
  teamId: string;
  player: {
    user_id: string;
    name: string;
    email: string;
    password: string;
    role: 'player'
  };
}
