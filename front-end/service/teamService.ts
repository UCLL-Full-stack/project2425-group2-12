// services/teamService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Adjust if needed

export const createTeam = async (name: string) => {
  return axios.post(`${API_URL}/teams`, { name });
};

export const getTeams = async () => {
  return axios.get(`${API_URL}/teams`);
};

export const addPlayerToTeam = async (teamId: string, playerName: string, role: string) => {
  return axios.post(`${API_URL}/teams/${teamId}/players`, { name: playerName, role });
};
export const removePlayerFromTeam = async (teamId: string, playerId: string) => {
  return axios.delete(`${API_URL}/teams/${teamId}/players/${playerId}`);
};

// services/teamService.ts
export const updatePlayerRole = async (teamId: string, playerId: string, role: string) => {
  return axios.patch(`${API_URL}/teams/${teamId}/players/${playerId}`, { role });
};

