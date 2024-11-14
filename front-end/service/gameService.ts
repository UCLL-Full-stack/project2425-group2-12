import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getGames = async () => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data;
};

export const createGame = async (team1: string, team2: string, date: string, time: string, venue: string) => {
  const response = await axios.post(`${API_URL}/games`, { team1, team2, date, time, venue });
  return response.data;
};

export const updateGame = async (gameId: string, updatedData: Partial<{ team1: string; team2: string; date: string; time: string; venue: string }>) => {
  const response = await axios.patch(`${API_URL}/games/${gameId}`, updatedData);
  return response.data;
};

export const deleteGame = async (gameId: string) => {
  await axios.delete(`${API_URL}/games/${gameId}`);
};
