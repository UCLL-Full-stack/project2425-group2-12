import React, { useState, useEffect } from "react";
import GameForm from "../components/GameForm";
import GameList from "../components/GameList";
import {
  createGame,
  getGames,
  updateGame,
  deleteGame,
  getUserRole,
} from "../service/gameService";
import router from "next/router";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { withAuth } from "@/components/withAuth";

export interface Game {
  id: string;
  team1: string; // Team name
  team2: string; // Team name
  date: string; // Date in string format
  time: string; // Time in string format
  venue: string; // Venue name
}

const GameManagement: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const userRole = getUserRole();

  // Ensure valid token
  const getAuthToken = () => {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("Auth token not found.");
    return token;
  };

  // Fetch Games from API
  const fetchGames = async () => {
    try {
      const token = getAuthToken();
      const fetchedGames = await getGames();

      // Transform data to match the Game interface
      const transformedGames = fetchedGames.map((game: any) => ({
        id: game.id,
        team1: game.team1.name, // Extract team1 name
        team2: game.team2.name, // Extract team2 name
        date: game.date,
        time: game.time,
        venue: game.venue,
      }));

      console.log("Fetched and Transformed Games:", transformedGames);
      setGames(transformedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to fetch games. Please try again.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Handle Game Creation or Editing
  const handleCreateOrEditGame = async (game: Partial<Game>) => {
    if (!game.team1 || !game.team2 || !game.date || !game.time || !game.venue) {
      toast.error("All fields are required!");
      return;
    }

    if (game.team1 === game.team2) {
      toast.error("Team 1 and Team 2 cannot be the same.");
      return;
    }

    console.log("Submitting game:", game); // Log game data before API call

    try {
      if (game.id) {
        const updatedGame = await updateGame(game.id, {
          team1Id: game.team1,
          team2Id: game.team2,
          date: game.date,
          time: game.time,
          venue: game.venue,
        });
        setGames((prevGames) =>
          prevGames.map((g) => (g.id === game.id ? updatedGame : g))
        );
        toast.success("Game updated successfully!");
      } else {
        const newGame = await createGame(
          game.team1,
          game.team2,
          game.date,
          game.time,
          game.venue
        );
        console.log("New game created:", newGame); // Debugging
        setGames((prevGames) => [...prevGames, newGame]); // Add the new game to the state
        toast.success("Game created successfully!");
      }
      setEditingGame(null);
    } catch (error) {
      console.error("Error creating or updating game:", error);
      toast.error("Failed to create or update the game. Please try again.");
    }
  };

  // Handle Game Deletion
  const handleDeleteGame = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    try {
      await deleteGame(gameId);
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
      toast.success("Game deleted successfully!");
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete game. Please try again.");
    }
  };

  // Handle Editing
  const handleEdit = (gameId: string) => {
    const gameToEdit = games.find((game) => game.id === gameId);
    if (gameToEdit) setEditingGame(gameToEdit);
  };

  // Cancel Editing
  const handleCancelEdit = () => setEditingGame(null);

  // Check Role and Loading
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.warn("No token found. Redirecting to login.");
      router.push("/login");
    } else {
      fetchGames();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!["admin", "player"].includes(userRole)) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      <h1 className="text-xl font-bold">Manage Games (Admin and Player Access)</h1>
      <GameForm
        onSubmit={handleCreateOrEditGame}
        initialData={editingGame || undefined}
        onCancel={editingGame ? handleCancelEdit : undefined}
      />
      {games.length === 0 ? (
        <p>No games available. Schedule one to get started!</p>
      ) : (
        <GameList
          games={games}
          onEdit={userRole === "admin" ? handleEdit : undefined}
          onDelete={userRole === "admin" ? handleDeleteGame : undefined}
        />
      )}
    </div>
  );
};

export default withAuth(GameManagement, ["admin", "player"]);
