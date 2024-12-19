import React from "react";
import { Game } from "../pages/gameManagement";

interface GameListProps {
  games: Game[];
  onEdit?: (gameId: string) => void; // Optional
  onDelete?: (gameId: string) => void; // Optional
}

const GameList: React.FC<GameListProps> = ({ games, onEdit, onDelete }) => {
  if (!Array.isArray(games)) {
    return <p>No games available.</p>;
  }

  return (
    <div>
      {games.map((game) => (
        <div key={game.id}>
          <h3>
            {game.team1} vs {game.team2}
          </h3>
          <p>Date: {game.date}</p>
          <p>Time: {game.time}</p>
          <p>Venue: {game.venue}</p>
          {onEdit && <button onClick={() => onEdit(game.id)}>Edit</button>}
        {onDelete && <button onClick={() => onDelete(game.id)}>Delete</button>}
        </div>
      ))}
    </div>
  );
};


export default GameList;
