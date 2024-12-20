import React, { useState, useEffect } from "react";
import TeamList from "@/components/TeamList";
import TeamForm from "@/components/TeamForm";
import AddPlayerForm from "@/components/AddPlayerForm";
import { getTeams } from "@/service/teamService";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { getUserRole } from "@/service/gameService";

export default function TeamManagement() {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check authentication and fetch user role
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.warn("No token found. Redirecting to login.");
      router.push("/login");
      return;
    }

    const role = getUserRole();
    setUserRole(role); // Set user role
    refreshTeams();
  }, [router]);

  // Fetches and refreshes the teams list
  const refreshTeams = async () => {
    try {
      const teams = await getTeams();
      if (Array.isArray(teams)) {
        setTeams(teams);
      } else {
        throw new Error("Invalid response structure.");
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      alert("Unable to load teams. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Team Management
        </h1>

        {/* Create Team Form */}
        {userRole !== "player" && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Create a New Team
            </h2>
            <TeamForm onTeamCreated={refreshTeams} />
          </div>
        )}

        {/* Existing Teams */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Existing Teams
          </h2>
          <TeamList
            teams={teams}
            onSelectTeam={(id: string) => setSelectedTeamId(id)}
          />
        </div>

        {/* Manage Selected Team */}
        {selectedTeamId && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Manage Team
            </h2>
            <AddPlayerForm
              teamId={selectedTeamId}
              onPlayerAdded={refreshTeams}
            />
          </div>
        )}
      </div>
    </div>
  );
}
