// src/types/index.ts

export interface CreateTeamDTO {
    name: string;
  }
  
  export interface AddPlayerDTO {
    name: string;
    role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper';
  }
  