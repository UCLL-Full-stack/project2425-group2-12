import React, { useEffect, useState } from "react";
import { Game } from "../pages/gameManagement";

interface GameFormProps {
  onSubmit: (game: Partial<Game>) => void; // Allow both creation and editing
  initialData?: Game; // Optional initial data for editing
  onCancel?: () => void; // Optional cancel action
}

const GameForm: React.FC<GameFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [team1, setTeam1] = useState(initialData?.team1 || "");
  const [team2, setTeam2] = useState(initialData?.team2 || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [venue, setVenue] = useState(initialData?.venue || "");


  

  
    // Sync state with new initialData when switching games
    useEffect(() => {
        if (initialData) {
          setTeam1(initialData.team1);
          setTeam2(initialData.team2);
          setDate(initialData.date);
          setTime(initialData.time);
          setVenue(initialData.venue);
        }
      }, [initialData]);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentDate = new Date();
        const selectedDate = new Date(date);
      
        if (selectedDate < currentDate) {
          alert("Game date cannot be in the past.");
          return;
        }
      
        try {
          const newGame = await onSubmit({
            id: initialData?.id,
            team1Id: team1,
            team2Id: team2,
            date,
            time,
            venue,
          });
      
          console.log("New game created:", newGame);
      
          // Reset only if the game was successfully created
          if (!initialData) {
            setTeam1("");
            setTeam2("");
            setDate("");
            setTime("");
            setVenue("");
          }
        } catch (error) {
          console.error("Error submitting game:", error);
          alert("Failed to create the game. Please try again.");
        }
      };
      
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-semibold mb-1">Team 1:</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
          placeholder="Enter Team 1 name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Team 2:</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
          placeholder="Enter Team 2 name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Date:</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Time:</label>
        <input
          type="time"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Venue:</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Enter venue"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
      >
        {initialData ? "Update Schedule" : "Schedule Game"}
      </button>
      {onCancel && (
        <button
          type="button"
          className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default GameForm;
