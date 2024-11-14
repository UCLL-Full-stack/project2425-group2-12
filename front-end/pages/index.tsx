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
      <Link href="/gameManagement">
          <h1 className="text-lg font-medium bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
            Go to Game Management
          </h1>
        </Link>
    </div>
  );
}
