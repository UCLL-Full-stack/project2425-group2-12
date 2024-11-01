import React, { useState } from 'react';

interface TeamFormProps {
  onSubmit: (teamName: string) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ onSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim() === '') {
      setError('Team name cannot be empty');
      return;
    }
    onSubmit(teamName);
    setTeamName('');  // Clear input after submission
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
        style={{ padding: '8px', marginRight: '8px' }}
      />
      <button type="submit" style={{ padding: '8px 12px' }}>Create Team</button>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
    </form>
  );
};

export default TeamForm;
