import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Cricket Team Manager</h1>
      <p>Manage your team, add players, assign roles, and prepare for upcoming matches.</p>
      <Link href="/ManageTeam" passHref>
        <button aria-label="Go to Team Management" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Go to Team Management
        </button>
      </Link>
    </div>
  );
};

export default Home;
