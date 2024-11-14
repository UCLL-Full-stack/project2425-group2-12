import { games } from '../model/dataStore';
import { GameEntity } from '../model/Game';
import { sendNotification } from './notificationService';


function generateGameId(): string {
    return Math.random().toString(36).substr(2, 9); // Generate a random 9-character ID
  }
  

export function createGame(team1: string, team2: string, date: string, time: string, venue: string): GameEntity {
  const newGame = new GameEntity(generateGameId(), team1, team2, date, time, venue);
  games.push(newGame);


   // Notify both teams
   sendNotification({
    recipient: team1,
    message: `Your team is scheduled to play against ${team2} on ${date} at ${time} at ${venue}.`,
  });

  sendNotification({
    recipient: team2,
    message: `Your team is scheduled to play against ${team1} on ${date} at ${time} at ${venue}.`,
  });
  return newGame;

}


export function getAllGames(): GameEntity[] {
  return games;
}

export function updateGame(gameId: string, updatedData: Partial<GameEntity>): GameEntity | null {
    const gameIndex = games.findIndex((g) => g.id === gameId);
    if (gameIndex === -1) {
      return null; // Game not found
    }
  
    const existingGame = games[gameIndex];
  
    // Use the GameEntity constructor to create a new instance with updated data
    const updatedGame = new GameEntity(
      existingGame.id,
      updatedData.team1 || existingGame.team1,
      updatedData.team2 || existingGame.team2,
      updatedData.date || existingGame.date,
      updatedData.time || existingGame.time,
      updatedData.venue || existingGame.venue
    );
  
    games[gameIndex] = updatedGame; // Replace the existing game with the updated instance

    // Notify both teams about the update
  sendNotification({
    recipient: updatedGame.team1,
    message: `Your game against ${updatedGame.team2} has been updated. New schedule: ${updatedGame.date}, ${updatedGame.time}, at ${updatedGame.venue}.`,
  });

  sendNotification({
    recipient: updatedGame.team2,
    message: `Your game against ${updatedGame.team1} has been updated. New schedule: ${updatedGame.date}, ${updatedGame.time}, at ${updatedGame.venue}.`,
  });
    return updatedGame;
  }


export function deleteGame(gameId: string): boolean {
  const gameIndex = games.findIndex((g) => g.id === gameId);
  if (gameIndex === -1) {
    return false; // Game not found
  }

  games.splice(gameIndex, 1);
  return true;
}

  