// components/TeamList.tsx
import React from 'react';
import Link from 'next/link';

interface TeamListProps {
  teams: any[];
  onSelectTeam: (id: string) => void;
}

const TeamList: React.FC<TeamListProps> = ({ teams, onSelectTeam }) => {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      {teams.length === 0 ?  (
        <p>No teams found. Create a team to get started!</p>
      ) :  (
        teams.map((team) => (
          <div key={team?.id || Math.random()} className="bg-gray-100 p-3 rounded mb-2 shadow-sm">
            <Link href={`/teamManagement/${team?.id || ""}`}>
              <h4 className="text-lg font-semibold hover:underline">
                {team?.name || "Unnamed Team"}
              </h4>
            </Link>
          </div>
        ))
      ) }
    </div>
  );
};

export default TeamList;
