// pages/teamManagement/[teamId].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  addPlayerToTeam,
  getTeams,
  updatePlayerRole,
  removePlayerFromTeam,
  handleJoinRequest,
  getJoinRequests,
  requestJoinTeam,
  getTeamPlayers,
} from "@/service/teamService";
import Cookies from "js-cookie";
import { getUserRole } from "@/service/gameService";
import { PLAYER_ROLES } from "@/constants";
import { jwtDecode } from "jwt-decode";


const userRole = getUserRole();

const TeamDetail = () => {
  const router = useRouter();
  const { teamId } = router.query as { teamId: string };
  const [team, setTeam] = useState<any>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerRole, setNewPlayerRole] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editedRole, setEditedRole] = useState("");
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [joinRequestStatus, setJoinRequestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const role = getUserRole();
    if (!role) {
      router.push("/login");
    } else if (role !== "captain" && role !== "player" && role !== "admin") {
      alert("You are not authorized to view this page.");
      router.push("/login");
    }
  }, [router]);
  
  


  const fetchTeam = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const response = await getTeams();
      const selectedTeam = response?.find((t: any) => t.id === teamId);
      if (selectedTeam) {
        const players = await getTeamPlayers(teamId);
        setTeam({ ...selectedTeam, players });
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchRequests = async (teamId: string) => {
    try {
      const requests = await getJoinRequests(teamId);
      setJoinRequests(requests); // Update join requests
    } catch (error) {
      console.error("Error fetching join requests:", error);
      // You can use a temporary error state if `setError` is not defined
      alert("Failed to fetch join requests.");
    }
  };

  useEffect(() => {
    if (!teamId) return;
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTeam(), fetchRequests(teamId)]);
      setLoading(false);
    };
    fetchData();
  }, [teamId]);

  useEffect(() => {
    const token = Cookies.get("authToken"); // Check Cookies for token
    if (!token) {
      console.warn("No token found. Redirecting to login.");
      router.push("/login"); // Redirect if no token
    }
  }, [router]);
  
  
  const handleAddPlayer = async () => {
    if (!newPlayerName || !newPlayerRole) {
      alert("Player name and role are required.");
      return;
    }
    setLoading(true);
    try {
      await addPlayerToTeam(teamId, newPlayerName, newPlayerRole);
      fetchTeam();
      setNewPlayerName("");
      setNewPlayerRole("");
    } catch (error) {
      console.error("Error adding player:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async (playerId: string) => {
    if (!editedRole) return;
    setLoading(true);
    try {
      await updatePlayerRole(teamId, playerId, editedRole);
      fetchTeam();
      setEditingPlayerId(null);
    } catch (error) {
      console.error("Error updating player role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    setLoading(true);
    try {
      await removePlayerFromTeam(teamId, playerId); // Calls the service function
      fetchTeam(); // Refreshes the team list
    } catch (error) {
      console.error("Error removing player:", error);
      alert("Failed to delete the player.");
    } finally {
      setLoading(false);
    }
  };
  


  
  const sendJoinRequest = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }
  
      // Decode the token to extract `playerId` and `playerName`
      const decodedToken: { playerId: string; playerName: string } = jwtDecode(token);
      const { playerId, playerName } = decodedToken;
  
      if (!playerId || !playerName) {
        throw new Error("Player information is missing in the token.");
      }
  
      // Call the backend service
      await requestJoinTeam(teamId as string, playerId, playerName);
  
      // Update UI state
      setJoinRequestStatus("pending");
      alert("Join request sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
      alert("Failed to send join request.");
    }
  };
  

  const handleRequestAction = async (
    requestId: string,
    status: "approved" | "denied"
  ) => {
    try {
      await handleJoinRequest(teamId as string, requestId, status); // Service function
      fetchRequests(teamId); // Refresh the request list
    } catch (error) {
      console.error("Error handling join request:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {team ? `${team.name} (ID: ${team.id})` : "Loading..."}
      </h1>

      {/* Join Team Button */}
{!team?.isCaptain && joinRequestStatus !== "pending" && (
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
    onClick={sendJoinRequest}
  >
    Join Team
  </button>
)}

{joinRequestStatus === "pending" && (
  <p className="text-gray-500 mt-2">Your join request is pending approval.</p>
)}


      {/* Players List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Players</h2>
        {team?.players.map((player: any) => (
  <div key={player.id} className="flex items-center space-x-4 py-2">
    {editingPlayerId === player.id ? (
      <>
        <select
          className="border rounded px-2 py-1"
          value={editedRole}
          onChange={(e) => setEditedRole(e.target.value)}
        >
          <option value="">Select Role</option>
          {PLAYER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
          onClick={() => handleEditRole(player.id)}
        >
          Save
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
          onClick={() => setEditingPlayerId(null)}
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <span className="font-medium">
          {player.name} (ID: {player.id}) - {player.role}
        </span>
        {(userRole === "captain" || userRole === "admin") && (
          <>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setEditingPlayerId(player.id)}
            >
              Edit Role
            </button>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDeletePlayer(player.id)}
            >
              Delete
            </button>
          </>
        )}
      </>
    )}
  </div>
))}
      </div>

      {/* Join Requests (Visible to Captains Only) */}
      {userRole === "captain" || userRole === "admin" ? (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-3">Pending Join Requests</h2>
    {joinRequests.length > 0 ? (
      joinRequests.map((request: any) => (
        <div key={request.id}>
          <span>{request.playerName}</span>
          <button
            onClick={() => handleRequestAction(request.id, "approved")}
          >
            Approve
          </button>
          <button
            onClick={() => handleRequestAction(request.id, "denied")}
          >
            Deny
          </button>
        </div>
      ))
    ) : (
      <p>No pending join requests.</p>
    )}
  </div>
) : null}


      {/* Add New Player */}
      {userRole !== "player" || userRole === "admin" ? (
  <div>
    <h2 className="text-xl font-semibold mb-3">Add New Player</h2>
    <div className="space-y-4">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
        placeholder="Player Name"
      />
      <select
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={newPlayerRole}
        onChange={(e) => setNewPlayerRole(e.target.value)}
      >
        <option value="">Select Role</option>
        {PLAYER_ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <button
        disabled={loading}
        className={`w-full bg-blue-500 text-white py-2 rounded ${
          loading ? "opacity-50" : ""
        }`}
        onClick={handleAddPlayer}
      >
        {loading ? "Adding..." : "Add Player"}
      </button>
    </div>
  </div>
) : null};
    </div>
  );
};

export default TeamDetail;


