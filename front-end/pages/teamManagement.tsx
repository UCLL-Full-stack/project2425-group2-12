// pages/teamManagement.tsx
import React, { useState, useEffect } from 'react';
import TeamList from '../components/TeamList';
import TeamForm from '../components/TeamForm';
import AddPlayerForm from '../components/AddPlayerForm';
import { getTeams } from '@/service/teamService';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function TeamManagement() {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);

  // Check for authentication and redirect if needed
  useEffect(() => {
    const token = Cookies.get("authToken"); // Use Cookies for token consistency
    if (!token) {
      console.warn("No token found. Redirecting to login.");
      router.push("/login");
      return;
    }

    // Fetch teams if token exists
    refreshTeams();
  }, []);

  // Fetches and refreshes the teams list
  const refreshTeams = async () => {
    try {
      const teams = await getTeams();
      if (Array.isArray(teams)) {
        setTeams(teams); // Set teams only if response is valid
      } else {
        throw new Error("Invalid response structure.");
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      alert("Unable to load teams. Please try again later.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800">Team Management</h1>
      
      {/* Create Team Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create a New Team</h2>
        <TeamForm onTeamCreated={refreshTeams} />
      </div>
      
      {/* Existing Teams */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Existing Teams</h2>
        <TeamList teams={teams} onSelectTeam={(id: string) => setSelectedTeamId(id)} />
      </div>
      
      {/* Manage Selected Team */}
      {selectedTeamId && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Team</h2>
          <AddPlayerForm teamId={selectedTeamId} onPlayerAdded={refreshTeams} />
        </div>
      )}
    </div>
  );
}
