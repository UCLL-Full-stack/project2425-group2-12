import React, { useCallback, useEffect, useState } from "react";
import { getGames } from "@/service/gameService";
import { createReservation, cancelReservation, getReservations } from "@/service/reservationService";
import { withAuth } from "@/components/withAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getUpcomingGames } from "@/service/participationService";

interface Game {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

const ReservationPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [reservations, setReservations] = useState<any[]>([]); // Declare the state
  const [loading, setLoading] = useState<string | null>(null);
  const [reservedGames, setReservedGames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loadingGames, setLoadingGames] = useState(false);

  const token = () => {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("Auth token not found.");
    return token;
  };

  useEffect(() => {
    console.log("Reservations:", reservations);
    console.log("Games:", games);
  }, [reservations, games]);

  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      const response = await getUpcomingGames();

      console.log("Fetched games response:", response); // Log response for debugging

      if (!response || !Array.isArray(response.data)) {
        throw new Error("Invalid response structure");
      }

      const formattedGames = response.data.map((game: any) => ({
        id: game.id,
        team1: game.team1?.name || "Unknown Team 1",
        team2: game.team2?.name || "Unknown Team 2",
        date: game.date,
        time: game.time,
        venue: game.venue,
      }));
      setGames(formattedGames);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching games:", err.message || err);
      setError("Failed to fetch games. Please try again later.");
    } finally {
      setLoadingGames(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await getReservations();

      // Validate and map the response
      if (!response || !Array.isArray(response.data)) {
        console.error("Invalid response structure:", response);
        setError("Failed to fetch reservations.");
        return;
      }

      const formattedReservations = response.data.map((reservation: any) => ({
        id: reservation.id,
        spectatorId: reservation.spectatorId,
        gameId: reservation.gameId,
        status: reservation.status,
        game: {
          id: reservation.game.id,
          team1: reservation.game.team1 || "Unknown Team 1",
          team2: reservation.game.team2 || "Unknown Team 2",
          date: reservation.game.date,
          time: reservation.game.time,
          venue: reservation.game.venue,
        },
        spectator: {
          id: reservation.spectator.id,
          name: reservation.spectator.name,
        },
      }));

      setReservations(formattedReservations); // Set state with formatted reservations
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to fetch reservations.");
    }
  };

  useEffect(() => {
    if (!token) {
      setError(null);
      router.push("/login");
      return;
    }
    fetchGames();
    fetchReservations();
  }, [token]);

  const handleReserve = async (gameId: string) => {
    try {
      setLoading(gameId);
      const reservation = await createReservation(gameId); // Expecting backend to return the reservation object
      setReservations((prev) => [...prev, reservation]);
      setReservedGames((prev) => [...prev, gameId]); // Optional, but for quick checks
      toast.success("Reservation successful!");
      setError(null);
    } catch (err) {
      console.error("Error making reservation:", err);
      setError("Failed to reserve the game. Please try again later.");
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      setLoading(reservationId);
      await cancelReservation(reservationId);
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== reservationId)
      );
      toast.success("Reservation cancelled!");
      setError(null);
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      setError("Failed to cancel reservation.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Reserve a Spot (Spectator Access)</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-6">
        <section>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your Reservations</h2>
          {reservations.length === 0 ? (
            <p className="text-gray-600 text-center">No reservations available at the moment.</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="p-6 border bg-white rounded shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">
                  {reservation.game?.team1 || "Unknown Team 1"} vs {reservation.game?.team2 || "Unknown Team 2"}
                </h3>
                <p>Date: {new Date(reservation.game?.date).toLocaleDateString()}</p>
                <p>Time: {reservation.game?.time}</p>
                <p>Venue: {reservation.game?.venue}</p>
                <p>Status: {reservation.status}</p>
                <p>Reserved by: {reservation.spectator?.name || "Unknown Spectator"}</p>
                <button
                  disabled={loading === reservation.id}
                  className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                  onClick={() => handleCancel(reservation.id)}
                >
                  {loading === reservation.id ? "Cancelling..." : "Cancel Reservation"}
                </button>
              </div>
            ))
          )}
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Available Games</h2>
          {games.length === 0 ? (
            <p className="text-gray-600 text-center">No games available for reservation at the moment.</p>
          ) : (
            games.map((game) => (
              <div key={game.id} className="p-6 border bg-white rounded shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">
                  {game.team1} vs {game.team2}
                </h3>
                <p>Date: {new Date(game.date).toLocaleDateString()}</p>
                <p>Time: {game.time}</p>
                <p>Venue: {game.venue}</p>
                <button
                  disabled={loading === game.id}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  onClick={() => handleReserve(game.id)}
                >
                  {loading === game.id ? "Reserving..." : "Reserve"}
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default withAuth(ReservationPage, ["spectator"]);
