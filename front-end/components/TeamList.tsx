// components/TeamList.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTeams } from '@/service/teamService';

interface TeamListProps {
  onSelectTeam: (id: string) => void;
}

const TeamList: React.FC<TeamListProps> = ({ onSelectTeam }) => {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    }
  };

  return (
    <div>
      <h2>Teams</h2>
      {teams.length > 0 ? (
        teams.map((team) => (
          <div key={team.id}>
            <Link href={`/teamManagement/${team.id}`}>
              <h1 onClick={() => onSelectTeam(team.id)}>
                <h3>{team.name}</h3>
              </h1>
            </Link>
          </div>
        ))
      ) : (
        <p>No teams available.</p>
      )}
    </div>
  );
};

export default TeamList;
