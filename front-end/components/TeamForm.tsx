// components/TeamForm.tsx
import { createTeam } from '@/service/teamService';
import React, { useState } from 'react';

const TeamForm = ({ onTeamCreated }: { onTeamCreated: () => void }) => {
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName) {
      await createTeam(teamName);
      setTeamName('');
      onTeamCreated(); // Notify parent to refresh the team list
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Team Name:</label>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
        required
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default TeamForm;
