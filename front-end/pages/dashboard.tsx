import React from 'react';
import Link from 'next/link';
import { withAuth } from '@/components/withAuth';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Administrator Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Here you have access to all sections:</p>

      <div className="space-y-4 mt-4">
        <Link href="/gameManagement" className="block p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Manage Games
        </Link>
        <Link href="/teamManagement" className="block p-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Manage Teams
        </Link>
        <Link href="/reservation" className="block p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          Manage Reservations
        </Link>
        <Link href="/profile" className="block p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          User Profiles
        </Link>
      </div>
    </div>
  );
};

export default withAuth(AdminDashboard, ['admin']);
