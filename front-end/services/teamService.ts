import axios from 'axios';
import { CreateTeamDTO, AddPlayerDTO, Team } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createTeam = async (teamData: CreateTeamDTO): Promise<Team> => {
  try {
    const response = await axios.post(`${API_URL}/teams`, teamData);
    return response.data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const response = await axios.get(`${API_URL}/teams`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

export const getTeamDetails = async (teamId: string): Promise<Team> => {
  try {
    const response = await axios.get(`${API_URL}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for team ${teamId}:`, error);
    throw error;
  }
};

export const addPlayerToTeam = async (teamId: string, playerId: string): Promise<Team> => {
  try {
    const response = await axios.post(`${API_URL}/teams/${teamId}/players`, { playerId });
    return response.data;
  } catch (error) {
    console.error(`Error adding player ${playerId} to team ${teamId}:`, error);
    throw error;
  }
};

export const removePlayerFromTeam = async (teamId: string, playerId: string): Promise<Team> => {
  try {
    const response = await axios.delete(`${API_URL}/teams/${teamId}/players/${playerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing player ${playerId} from team ${teamId}:`, error);
    throw error;
  }
};
