  export const roleRedirectPaths: Record<string, string> = {
    admin: "/dashboard",
    captain: "/teamManagement",
    player: "/playerLanding",
    spectator: "/reservation",
  };
  export const PLAYER_ROLES = [
    "Batsman",
    "Bowler",
    "All-rounder",
    "Wicket Keeper",
    "Captain",
  ];
  

  export interface CustomJwtPayload {
    id: string;
    role: string;
    playerId?: string;
    playerName?: string;
  }
  