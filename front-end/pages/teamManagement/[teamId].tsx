// pages/teamManagement/[teamId].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { addPlayerToTeam, getTeams , updatePlayerRole} from '@/service/teamService';

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
      fetchTeam();
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

  return (
    <div>
      <h1>{team ? team.name : 'Loading...'}</h1>
      <div>
        <h2>Players</h2>
        {team?.players.map((player: any) => (
          <div key={player.id}>
            {editingPlayerId === player.id ? (
              <>
                <input
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  placeholder="Edit Role"
                />
                <button onClick={() => handleEditRole(player.id)}>Save</button>
                <button onClick={() => setEditingPlayerId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{player.name} - {player.role}</span>
                <button onClick={() => setEditingPlayerId(player.id)}>Edit Role</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2>Add New Player</h2>
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Player Name"
        />
        <input
          type="text"
          value={newPlayerRole}
          onChange={(e) => setNewPlayerRole(e.target.value)}
          placeholder="Role"
        />
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>
    </div>
  );
};

export default TeamDetail;
