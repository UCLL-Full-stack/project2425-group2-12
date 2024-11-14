export interface Game {
    id: string;
    team1: string;
    team2: string;
    date: string; // Format: YYYY-MM-DD
    time: string; // Format: HH:mm
    venue: string;
  }
  
  export class GameEntity implements Game {
    id: string;
    team1: string;
    team2: string;
    date: string;
    time: string;
    venue: string;
  
    constructor(id: string, team1: string, team2: string, date: string, time: string, venue: string) {
      this.id = id;
      this.team1 = team1;
      this.team2 = team2;
      this.date = date;
      this.time = time;
      this.venue = venue;
  
      this.validate();
    }
  
    private validate() {
      if (!this.team1 || !this.team2) {
        throw new Error("Both teams must be specified.");
      }
      if (!this.date || !this.time || !this.venue) {
        throw new Error("Date, time, and venue must be provided.");
      }
      if (this.team1 === this.team2) {
        throw new Error("A game cannot be scheduled between the same team.");
      }
    }
  }
  