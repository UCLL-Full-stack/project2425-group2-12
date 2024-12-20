import React from "react";
import Link from "next/link";
import { withAuth } from "@/components/withAuth";

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-8 max-w-4xl w-full bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Administrator Dashboard
        </h1>
        <p className="text-gray-700 text-center">
          Welcome to the Admin Dashboard. Here you have access to all sections:
        </p>

        <div className="space-y-6 mt-8">
          <Link href="/gameManagement">
           <p className="block p-4 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors">
              Manage Games
              </p>
          </Link>
          <Link href="/teamManagement">
           <p className="block p-4 bg-green-500 text-white text-center rounded-lg hover:bg-green-600 transition-colors">
              Manage Teams
              </p>
          </Link>
          <Link href="/reservation">
          <p className="block p-4 bg-yellow-500 text-white text-center rounded-lg hover:bg-yellow-600 transition-colors">
              Manage Reservations
              </p>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default withAuth(AdminDashboard, ["admin"]);
