// components/TeamForm.tsx
import { createTeam } from '@/service/teamService';
import React, { useState } from 'react';

interface TeamFormProps {
  onTeamCreated: () => void; // Callback to refresh team list
}

const TeamForm: React.FC<TeamFormProps> = ({ onTeamCreated }) => {
  const [teamName, setTeamName] = useState('');

  const handleCreateTeam = async () => {
    if (teamName) {
      await createTeam(teamName); // Create the team
      setTeamName(''); // Clear input after team is created
      onTeamCreated(); // Refresh the team list
    }
  };

  return (
    <div>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
      />
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"  onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
};

export default TeamForm;
