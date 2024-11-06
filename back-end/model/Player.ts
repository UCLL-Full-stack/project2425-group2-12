// src/model/Player.ts
export interface Player {
    id: string;
    name: string;
    role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper';
    teamId: string;
  }
  
  export class PlayerEntity implements Player {
    id: string;
    name: string;
    role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper';
    teamId: string;
  
    constructor(id: string, name: string, role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper', teamId: string) {
      this.id = id;
      this.name = name;
      this.role = role;
      this.teamId = teamId;
  
      // Perform validation
      this.validate();
    }
  
    private validate() {
      if (!this.name) {
        throw new Error('Player name is required');
      }
      if (!['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper'].includes(this.role)) {
        throw new Error('Invalid role');
      }
    }
  }
  