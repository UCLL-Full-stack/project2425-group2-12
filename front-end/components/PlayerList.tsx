import React from 'react';
import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onRemove: (playerId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onRemove }) => {
  const handleRemove = (playerId: string) => {
    const confirmRemoval = window.confirm("Are you sure you want to remove this player?");
    if (confirmRemoval) {
      onRemove(playerId);
    }
  };

  return (
    <div>
      {players.length > 0 ? (
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.name} ({player.role})
              <button onClick={() => handleRemove(player.id)} style={{ marginLeft: '10px' }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No players in this team.</p>
      )}
    </div>
  );
};

export default PlayerList;
