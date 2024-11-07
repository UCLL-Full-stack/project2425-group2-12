// pages/teamManagement.tsx
import React, { useState, useEffect } from 'react';
import TeamList from '../components/TeamList';
import TeamForm from '../components/TeamForm';
import AddPlayerForm from '../components/AddPlayerForm';
import { getTeams } from '@/service/teamService';

export default function TeamManagement() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);

  // Fetches and refreshes the teams list
  const refreshTeams = async () => {
    const response = await getTeams();
    setTeams(response.data || []);
  };

  useEffect(() => {
    refreshTeams(); // Fetch teams on initial load
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800">Team Management</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create a New Team</h2>
        <TeamForm onTeamCreated={refreshTeams} />
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Existing Teams</h2>
        <TeamList teams={teams} onSelectTeam={(id: string) => setSelectedTeamId(id)} />
      </div>
      
      {selectedTeamId && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Team</h2>
          <AddPlayerForm teamId={selectedTeamId} onPlayerAdded={refreshTeams} />
        </div>
      )}
    </div>
  );
}
