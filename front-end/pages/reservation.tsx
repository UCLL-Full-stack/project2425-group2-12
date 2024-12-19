import React, { useCallback, useEffect, useState } from "react";
import { getGames } from "@/service/gameService";
import { createReservation, cancelReservation, getReservations } from "@/service/reservationService";
import { withAuth } from "@/components/withAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState<string | null>(null); // Tracks the game ID being processed
  const [reservedGames, setReservedGames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token = Cookies.get("authToken");


  const fetchGames = useCallback(async () => {
    try {
      const data = await getGames();
      setGames(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games.");
    }
  }, []);

  const fetchReservedGames = useCallback(async () => {
    try {
      const reservations = await getReservations();
      console.log("Reservations fetched:", reservations);
  
      if (Array.isArray(reservations)) {
        setReservedGames(reservations.map((res) => res.gameId));
      } else {
        console.error("Reservations is not an array:", reservations);
        setReservedGames([]); // Reset state if response is invalid
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to fetch reservations.");
    }
  }, []);
  

  const handleReserve = async (gameId: string) => {
    try {
      setLoading(gameId);
      await createReservation(gameId);
      setReservedGames((prev) => [...prev, gameId]);
      toast.success("Reservation successful!");
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error making reservation:", err);
      setError("Failed to reserve the game. Please try again later.");
    } finally {
      setLoading(null);
    }
  }

  const handleCancel = async (gameId: string) => {
    try {
      setLoading(gameId);
      const reservationId = reservedGames.find((id) => id === gameId);

      if (!reservationId) {
        setError("No reservation found to cancel!");
        return;
      }

      await cancelReservation(reservationId);
      setReservedGames((prev) => prev.filter((id) => id !== gameId));
      toast.success("Reservation cancelled!");
      setError(null);
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      setError("Failed to cancel reservation.");
    } finally {
      setLoading(null);
    }
  };
  
  useEffect(() => {
    if (!token) {
      setError(null); // Clear any error before redirect
      router.push("/login");
      return;
    }
    fetchGames();
    fetchReservedGames();
  }, [token, fetchGames, fetchReservedGames]);
  
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Reserve a Spot (Spectator Access)</h1>
      {error && <p className="text-red-500">{error}</p>}

        {/* No Reservations Message */}
        {games.length > 0 && reservedGames.length === 0 && (
  <p className="text-gray-500 text-center mb-4">
    You have no reservations yet. Reserve a spot now!
  </p>
)}

      

      <div className="space-y-4">
  {games.length === 0 ? (
    <p className="text-gray-500 text-center">
      No games available for reservation at the moment.
    </p>
  ) : (
    games.map((game) => (
      <div key={game.id} className="p-4 border rounded shadow-sm">
        <h2 className="text-lg font-semibold">
          {game.team1} vs {game.team2}
        </h2>
        <p>Date: {game.date}</p>
        <p>Time: {game.time}</p>
        <p>Venue: {game.venue}</p>
        {reservedGames.includes(game.id) ? (
          <button
            disabled={loading === game.id}
            className={`bg-red-500 text-white py-1 px-4 rounded ${
              loading === game.id ? "opacity-50" : ""
            }`}
            onClick={() => handleCancel(game.id)}
          >
            {loading === game.id ? "Cancelling..." : "Cancel Reservation"}
          </button>
        ) : (
          <button
            disabled={loading === game.id}
            className={`bg-blue-500 text-white py-1 px-4 rounded ${
              loading === game.id ? "opacity-50" : ""
            }`}
            onClick={() => handleReserve(game.id)}
          >
            {loading === game.id ? "Reserving..." : "Reserve"}
          </button>
        )}
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default withAuth(ReservationPage, ["spectator"]);
