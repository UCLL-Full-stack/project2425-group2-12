import React, { useState, useEffect } from 'react';
import TeamForm from '../components/TeamForm';
import PlayerList from '../components/PlayerList';
import { createTeam, getAllTeams, getTeamDetails, removePlayerFromTeam } from '../services/teamService';
import { Team } from '../types';

const ManageTeam: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const allTeams = await getAllTeams();
        setTeams(allTeams);
      } catch (error) {
        setMessage('Error fetching teams');
        console.error(error);
      }
    };
    fetchTeams();
  }, []);

  const handleCreateTeam = async (teamName: string) => {
    setMessage(''); // Reset message before action
    try {
      const newTeam = await createTeam({ name: teamName, captainId: '1' });
      setTeams((prev) => [...prev, newTeam]);
      setMessage('Team created successfully!');
    } catch (error) {
      setMessage('Error creating team');
      console.error(error);
    }
  };

  const handleSelectTeam = async (teamId: string) => {
    if (selectedTeam?.id === teamId) return; // Prevent redundant fetch
    try {
      const teamDetails = await getTeamDetails(teamId);
      setSelectedTeam(teamDetails);
      setMessage(''); // Clear message on successful team selection
    } catch (error) {
      setMessage('Error fetching team details');
      console.error(error);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (selectedTeam) {
      try {
        await removePlayerFromTeam(selectedTeam.id, playerId);
        const updatedTeam = await getTeamDetails(selectedTeam.id);
        setSelectedTeam(updatedTeam);
        setMessage('Player removed successfully!');
      } catch (error) {
        setMessage('Error removing player');
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Manage Teams</h1>
      <TeamForm onSubmit={handleCreateTeam} />
      {message && <p>{message}</p>}

      <h2>Existing Teams</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {teams.map((team) => (
          <li key={team.id} onClick={() => handleSelectTeam(team.id)} style={{ cursor: 'pointer', margin: '8px 0' }}>
            <a href="#">{team.name}</a>
          </li>
        ))}
      </ul>

      {selectedTeam && (
        <div>
          <h2>Team: {selectedTeam.name}</h2>
          <PlayerList players={selectedTeam.players} onRemove={handleRemovePlayer} />
        </div>
      )}
    </div>
  );
};

export default ManageTeam;
