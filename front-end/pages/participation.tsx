import React, { useEffect, useState } from "react";
import { getUpcomingGames, confirmParticipation, updateParticipation, getTeamRoster } from "../service/participationService";
import { withAuth } from "@/components/withAuth";
import { getUserRole } from "@/service/gameService";

const ParticipationPage: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [participationStatus, setParticipationStatus] = useState<Record<string, string>>({});
  const [roster, setRoster] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userRole = getUserRole();

  useEffect(() => {
    fetchGames();
  }, []);
  


  
  const fetchGames = async () => {
    try {
      setLoading(true);
      const games = await getUpcomingGames();
      const formattedGames = games.map((game: any) => ({
        id: game.id,
        team1: game.team1.name,
        team2: game.team2.name,
        date: game.date,
        time: game.time,
        venue: game.venue,
      }));
      setGames(formattedGames);
      setError(null);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmParticipation = async (gameId: string) => {
    try {
      setLoading(true);
      const participation = await confirmParticipation(gameId);
      setParticipationStatus((prev) => ({ ...prev, [gameId]: participation.status }));
      alert("Participation confirmed!");
      setError(null);
    } catch (err) {
      console.error("Error confirming participation:", err);
      setError("Failed to confirm participation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelParticipation = async (gameId: string) => {
    try {
      const playerId = "replace-with-actual-logic"; // Replace this placeholder with actual user context logic
      setLoading(true);
      const participation = await updateParticipation(playerId, gameId, "not confirmed");
      setParticipationStatus((prev) => ({ ...prev, [gameId]: participation.status }));
      alert("Participation canceled!");
    } catch (err) {
      console.error("Error canceling participation:", err);
      alert("Failed to cancel participation. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  


  const handleViewRoster = async (gameId: string) => {
    try {
      setLoading(true);
      const rosterData = await getTeamRoster(gameId);
      setRoster(rosterData);
      setError(null);
    } catch (err) {
      console.error("Error fetching roster:", err);
      setError("Failed to fetch roster. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Participation Page(Player Access Only)</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {games.length === 0 && !loading && !error && <p>No upcoming games available.</p>}
      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-lg font-semibold">
              {game.team1} vs {game.team2}
            </h2>
            <p>Date: {new Date(game.date).toLocaleDateString()}</p>
            <p>Time: {game.time}</p>
            <p>Venue: {game.venue}</p>
            {userRole === "player" && (
  <>
            {participationStatus[game.id] === "confirmed" ? (
              <button
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded"
                onClick={() => handleCancelParticipation(game.id)}
              >
                Cancel Participation
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
                onClick={() => handleConfirmParticipation(game.id)}
              >
                Confirm Participation
              </button>
            )}
              </>
)}
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-4 rounded ml-4"
              onClick={() => handleViewRoster(game.id)}
            >
              View Roster
            </button>
          </div>
        ))}
      </div>
      {roster && (
        <div className="mt-6 p-4 border rounded shadow-sm bg-gray-100">
          <h2 className="text-lg font-bold">Team Roster</h2>
          <h3 className="text-md font-semibold">Team 1:</h3>
          {roster.team1.map((player: any) => (
            <p key={player.player.id}>
              {player.player.name} - {player.player.role}
            </p>
          ))}
          <h3 className="text-md font-semibold">Team 2:</h3>
          {roster.team2.map((player: any) => (
            <p key={player.player.id}>
              {player.player.name} - {player.player.role}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default withAuth(ParticipationPage, ['player']);
