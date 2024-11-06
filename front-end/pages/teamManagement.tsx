// pages/teamManagement.tsx
import React, { useState } from 'react';
import TeamList from '../components/TeamList';
import TeamForm from '../components/TeamForm';
import AddPlayerForm from '../components/AddPlayerForm';

export default function TeamManagement() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const refreshTeams = () => {
    // Trigger TeamList to re-fetch teams (implementation can depend on your state setup)
  };

  return (
    <div>
      <h1>Team Management</h1>
      <TeamForm onTeamCreated={refreshTeams} />
      <TeamList onSelectTeam={(id: string) => setSelectedTeamId(id)} />
      {selectedTeamId && (
        <div>
          <h2>Manage Team</h2>
          <AddPlayerForm teamId={selectedTeamId} onPlayerAdded={refreshTeams} />
        </div>
      )}
    </div>
  );
}
