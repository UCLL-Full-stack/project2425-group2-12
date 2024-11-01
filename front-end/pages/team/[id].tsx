import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PlayerList from '../../components/PlayerList';
import { getTeamDetails, removePlayerFromTeam } from '../../services/teamService';
import { Team } from '../../types';

const TeamDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (id) {
        try {
          const teamData = await getTeamDetails(id as string);
          setTeam(teamData);
        } catch (error) {
          setMessage('Error fetching team details');
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTeamDetails();
  }, [id]);

  const handleRemovePlayer = async (playerId: string) => {
    if (team) {
      try {
        await removePlayerFromTeam(team.id, playerId);
        const updatedTeam = await getTeamDetails(team.id);
        setTeam(updatedTeam);
        setMessage('Player removed successfully!');
      } catch (error) {
        setMessage('Error removing player');
        console.error(error);
      }
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : team ? (
        <>
          <h1>Team: {team.name}</h1>
          {message && <p>{message}</p>}
          <PlayerList players={team.players} onRemove={handleRemovePlayer} />
        </>
      ) : (
        <p>Team not found.</p>
      )}
    </div>
  );
};

export default TeamDetails;
