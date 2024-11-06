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
    <form onSubmit={handleAddPlayer}>
      <label>Player Name:</label>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        required
      />
      <label>Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All-rounder">All-rounder</option>
        <option value="Wicket Keeper">Wicket Keeper</option>
      </select>
      <button type="submit">Add Player</button>
    </form>
  );
};

export default AddPlayerForm;
