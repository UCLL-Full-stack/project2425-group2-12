import React, { useEffect, useState } from "react";
import { getUpcomingGames, confirmParticipation, updateParticipation, getTeamRoster } from "../service/participationService";
import { withAuth } from "@/components/withAuth";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";


interface Game {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

interface Roster {
  games: Game[];
}

const ParticipationPage: React.FC = () => {
  const [games, setGames] = useState<any[]>([]);
  const [participationStatus, setParticipationStatus] = useState<Record<string, string>>({});
  const [roster, setRoster] = useState<any>(null);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  

  const fetchPlayerId = () => {
    const token = Cookies.get("authToken");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return null;
    }
    const decodedToken: { playerId: string } = jwtDecode(token);
    return decodedToken.playerId;
  };

  useEffect(() => {
    fetchGames();
    setUserRole("player"); // Replace with dynamic fetch if necessary
  }, []);

  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      setError(null);
      const response = await getUpcomingGames();
      console.log("Fetched games:", response); // Log the response for debugging
      const formattedGames = response.data.map((game: any) => ({
        id: game.id,
        team1: game.team1.name,
        team2: game.team2.name,
        date: game.date,
        time: game.time,
        venue: game.venue,
      }));
      setGames(formattedGames);
    } catch (err) {
      console.error("Error fetching games:", err); // Log the error
      setError("Failed to fetch games. Please try again later.");
    } finally {
      setLoadingGames(false);
    }
  };
  

  useEffect(() => {
  console.log("Games state updated:", games); // Debug state changes
}, [games]);

  
const handleConfirmParticipation = async (gameId: string) => {
  const playerId = fetchPlayerId();
  if (!playerId) return;

  try {
    setLoadingAction(true);

    // Confirm participation
    const participation = await confirmParticipation(playerId, gameId);

    // Find the confirmed game
    const confirmedGame = games.find((game) => game.id === gameId);

    // Ensure `confirmedGame` exists before proceeding
    if (!confirmedGame) {
      throw new Error("Game not found in the list of upcoming games.");
    }

    // Update games to remove the confirmed game
    setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));

    // Add the confirmed game to the roster
    setRoster((prevRoster: Roster | null) => ({
      games: [...(prevRoster?.games || []), confirmedGame],
    }));
    

    setParticipationStatus((prev) => ({ ...prev, [gameId]: participation.status }));
    alert("Participation confirmed!");
  } catch (err) {
    setError("Failed to confirm participation. Please try again.");
    console.error(err);
  } finally {
    setLoadingAction(false);
  }
};


const handleCancelParticipation = async (gameId: string) => {
  const playerId = fetchPlayerId();
  if (!playerId) return;

  try {
    setLoadingAction(true);

    // Cancel participation
    await updateParticipation(playerId, gameId, "not confirmed");

    // Find the canceled game in the roster
    const canceledGame = roster?.games?.find((game) => game.id === gameId);

    if (!canceledGame) {
      throw new Error("Game not found in the roster.");
    }

    // Remove the game from the roster
    setRoster((prevRoster: Roster) => ({
      ...prevRoster,
      games: prevRoster.games.filter((game) => game.id !== gameId),
    }));

    // Optionally, add the game back to the upcoming games
    setGames((prevGames) => [...prevGames, canceledGame]);

    alert("Participation canceled!");
  } catch (err) {
    alert("Failed to cancel participation. Please try again.");
    console.error(err);
  } finally {
    setLoadingAction(false);
  }
};


  const handleViewRoster = async (gameId: string) => {
    try {
      setLoadingAction(true);
      const rosterData = await getTeamRoster(gameId);
      setRoster(rosterData);
    } catch (err) {
      setError("Failed to fetch roster. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Participation Page (Player Access Only)</h1>
      {loadingGames && <p>Loading games...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {games.length === 0 && !loadingGames ? (
  <p>No upcoming games available.</p>
) : (
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
)}
{roster && (
  <div className="mt-6 p-4 border rounded shadow-sm bg-gray-100">
    <h2 className="text-lg font-bold">Team Roster</h2>
    <h3 className="text-md font-semibold">Confirmed Games:</h3>
    {roster?.games?.length > 0 ? (
      roster.games.map((game: any) => (
        <div key={game.id} className="p-4 border rounded shadow-sm">
          <h2 className="text-lg font-semibold">
            {game.team1} vs {game.team2}
          </h2>
          <p>Date: {new Date(game.date).toLocaleDateString()}</p>
          <p>Time: {game.time}</p>
          <p>Venue: {game.venue}</p>
          <button
            className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded"
            onClick={() => handleCancelParticipation(game.id)}
          >
            Cancel Participation
          </button>
        </div>
      ))
    ) : (
      <p>No confirmed games in the roster</p>
    )}
  </div>
)}

      
    </div>
  );
};

export default withAuth(ParticipationPage, ["player"]);
