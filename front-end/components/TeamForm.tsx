// components/TeamForm.tsx
import { createTeam } from '@/service/teamService';
import React, { useState } from 'react';

interface TeamFormProps {
  onTeamCreated: () => void; // Callback to refresh team list
}

const TeamForm: React.FC<TeamFormProps> = ({ onTeamCreated }) => {
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleCreateTeam = async () => {
    if (teamName.trim().length < 3) {
      alert("Team name must be at least 3 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTeam(teamName); 
      setTeamName('');
      onTeamCreated();
      alert("Team created successfully!");
    } catch (error) {
      console.error("Failed to create team:", error);
      alert("Failed to create team. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
        Team Name
      </label>
      <input
        id="teamName"
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
        className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
        onClick={handleCreateTeam}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Team"}
      </button>
    </div>
  );
};

export default TeamForm;
