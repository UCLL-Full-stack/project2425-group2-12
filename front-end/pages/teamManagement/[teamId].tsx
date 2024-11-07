// pages/teamManagement/[teamId].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { addPlayerToTeam, getTeams, updatePlayerRole, removePlayerFromTeam } from '@/service/teamService';

const TeamDetail = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const [team, setTeam] = useState<any>(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editedRole, setEditedRole] = useState('');

  useEffect(() => {
    if (teamId) {
      fetchTeam();
    }
  }, [teamId]);

  const fetchTeam = async () => {
    try {
      const response = await getTeams();
      const selectedTeam = response.data.find((t: any) => t.id === teamId);
      setTeam(selectedTeam);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const handleAddPlayer = async () => {
    if (newPlayerName && newPlayerRole) {
      await addPlayerToTeam(teamId as string, newPlayerName, newPlayerRole);
      fetchTeam(); // Refresh the list
      setNewPlayerName('');
      setNewPlayerRole('');
    }
  };

  const handleEditRole = async (playerId: string) => {
    if (editedRole) {
      await updatePlayerRole(teamId as string, playerId, editedRole);
      fetchTeam();
      setEditingPlayerId(null);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    await removePlayerFromTeam(teamId as string, playerId);
    fetchTeam(); // Refresh the list
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{team ? `${team.name} (ID: ${team.id})` : 'Loading...'}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Players</h2>
        {team?.players.map((player: any) => (
          <div key={player.id} className="flex items-center space-x-4 py-2">
            {editingPlayerId === player.id ? (
              <>
                <select
                  className="border rounded px-2 py-1"
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-rounder">All-rounder</option>
                  <option value="Wicket Keeper">Wicket Keeper</option>
                  <option value="Captain">Captain</option>
                </select>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={() => handleEditRole(player.id)}>Save</button>
                <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded" onClick={() => setEditingPlayerId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span className="font-medium">
                  {player.name} (ID: {player.id}) - {player.role}
                </span>
                <button className="text-blue-500 hover:underline" onClick={() => setEditingPlayerId(player.id)}>Edit Role</button>
                <button className="text-red-500 hover:underline" onClick={() => handleDeletePlayer(player.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Add New Player</h2>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player Name"
          />
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={newPlayerRole}
            onChange={(e) => setNewPlayerRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket Keeper">Wicket Keeper</option>
            <option value="Captain">Captain</option>
          </select>
          <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded-lg" onClick={handleAddPlayer}>Add Player</button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
