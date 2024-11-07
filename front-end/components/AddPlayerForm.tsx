// components/AddPlayerForm.tsx
import { addPlayerToTeam } from '@/service/teamService';
import React, { useState } from 'react';

const AddPlayerForm = ({ teamId, onPlayerAdded }: { teamId: string; onPlayerAdded: () => void }) => {
  const [playerName, setPlayerName] = useState('');
  const [role, setRole] = useState('');

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName && role && teamId) {
      await addPlayerToTeam(teamId, playerName, role);
      setPlayerName('');
      setRole('');
      onPlayerAdded(); // Notify parent to refresh the team list
    } else {
      alert("Please select a team first.");
    }
  };

  return (
    <form onSubmit={handleAddPlayer} className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-semibold mb-1">Player Name:</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-1">Role:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All-rounder">All-rounder</option>
          <option value="Wicket Keeper">Wicket Keeper</option>
          <option value="Captain">Captain</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
      >
        Add Player
      </button>
    </form>
  );
};

export default AddPlayerForm;
