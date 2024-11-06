// pages/index.tsx
import React from 'react';
import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Cricket App</h1>
      <Link href="/teamManagement">
        <h1>Go to Team Management</h1>
      </Link>
    </div>
  );
}
