import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;


const getAuthToken = () => {
  const token = Cookies.get("authToken"); // Fetch token from cookies
  if (!token) throw new Error("Auth token not found.");
  return token;
};

const handleAuthError = (error: any) => {
  if (error.response?.status === 403) {
    return { error: "You are not authorized to perform this action." };
  } 
  if (error.response?.status === 401) {
    console.error("Token expired. Redirecting to login...");
    Cookies.remove("authToken");
    window.location.href = "/login";
  } else if (error.response) {
    console.error("Server Error:", error.response.data);
  } else {
    console.error("Network Error:", error.message);
  }
  throw error;
};

export const getUserRole = () => {
  const token = Cookies.get("authToken");
  if (!token) return null;

  const decodedToken: any = jwtDecode(token);
  return decodedToken.role;
};

export const getGames = async () => {
  try {const token = getAuthToken();
  const response = await axios.get(`${API_URL}/games`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}
  catch (error) {
    handleAuthError(error);
  }
};


export const createGame = async (
  team1Id: string,
  team2Id: string,
  date: string,
  time: string,
  venue: string
) => {
  const token = getAuthToken();
  console.log("Creating game with payload:", { team1Id, team2Id, date, time, venue }); // Debug log
  try {
    const response = await axios.post(
      `${API_URL}/games`,
      { team1Id, team2Id, date, time, venue },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data; // Ensure this matches the back-end response
  } catch (error: any) {
    console.error("Error in createGame service:", error.response?.data || error.message); // Add detailed error log
    throw error;
  }
};


export const updateGame = async (gameId: string, updatedData: Partial<{ team1Id: string; team2Id: string; date: string; time: string; venue: string }>) => {
 try { const token = getAuthToken();
  const response = await axios.patch(`${API_URL}/games/${gameId}`, updatedData, {
  headers: { Authorization: `Bearer ${token}` }});
  return response.data;
}
  catch (error) {
    handleAuthError(error);
  }
};

export const deleteGame = async (gameId: string) => {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/games/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` }});
}
  catch (error) {
    handleAuthError(error);
  }
};

export const getGameById = async (gameId: string) => {
  const token = getAuthToken();
  try {const response = await axios.get(`${API_URL}/games/${gameId}`, {
    headers: { Authorization: `Bearer ${token}` }});
  return response.data;
}
  catch (error) {
    handleAuthError(error);
  }
};

