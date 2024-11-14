import React, { useState, useEffect } from "react";
import GameForm from "../components/GameForm";
import GameList from "../components/GameList";
import { createGame, getGames, updateGame, deleteGame } from "../service/gameService";

export interface Game {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

const GameManagement: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await getGames();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleCreateOrEditGame = async (game: Partial<Game>) => {
    try {
      if (game.id) {
        const updatedGame = await updateGame(game.id, game);
        setGames((prevGames) =>
          prevGames.map((g) => (g.id === game.id ? updatedGame : g))
        );
      } else {
        const newGame = await createGame(
          game.team1!,
          game.team2!,
          game.date!,
          game.time!,
          game.venue!
        );
        setGames((prevGames) => [...prevGames, newGame]);
      }
      setEditingGame(null);
    } catch (error) {
      console.error("Error creating or updating game:", error);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      await deleteGame(gameId);
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  const handleEdit = (gameId: string) => {
    const gameToEdit = games.find((game) => game.id === gameId);
    if (gameToEdit) setEditingGame(gameToEdit);
  };

  const handleCancelEdit = () => setEditingGame(null);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      <h1 className="text-3xl font-bold text-center">Game Management</h1>
      <GameForm
        onSubmit={handleCreateOrEditGame}
        initialData={editingGame || undefined}
        onCancel={editingGame ? handleCancelEdit : undefined}
      />
      <GameList games={games} onEdit={handleEdit} onDelete={handleDeleteGame} />
    </div>
  );
};

export default GameManagement;
