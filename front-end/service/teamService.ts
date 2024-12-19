// services/teamService.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;


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
  throw { error: error.message || "An unexpected error occurred." };
};





const getAuthToken = () => {
  const token = Cookies.get("authToken"); // Retrieve token from cookies
  if (!token) throw new Error("Auth token not found.");
  return token;
};

export const createTeam = async (name: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_URL}/teams`, 
      { name },
      { headers: { Authorization: `Bearer ${token}` } } // Add auth header
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const getTeams = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};



export const getTeamPlayers = async (teamId: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/teams/${teamId}/players`,
      { headers: { Authorization: `Bearer ${token}` } } // Add auth header

    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
  }


export const addPlayerToTeam = async (teamId: string, name: string, role: string) => {
  try { 
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/teams/${teamId}/players`, { name, role }, // Request body
      { headers: { Authorization: `Bearer ${token}` } } // Headers
  );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};




export const removePlayerFromTeam = async (teamId: string, playerId: string) => {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/teams/${teamId}/players/${playerId}`, 
      { headers: { Authorization: `Bearer ${token}` } } // Add auth header

    );
  } catch (error) {
    handleAuthError(error);
  }
};

// services/teamService.ts
export const updatePlayerRole = async (teamId: string, playerId: string, role: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${API_URL}/teams/${teamId}/players/${playerId}`,
      { role }, // Body
      { headers: { Authorization: `Bearer ${token}` } } // Headers
    );
    
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// services/teamService.ts
export const requestJoinTeam = async (teamId: string, playerId: string, playerName: string) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Auth token not found.");

    console.log('Sending request to join team:', { teamId, playerId, playerName });
    const response = await axios.post(
      `${API_URL}/teams/${teamId}/join`,
      { playerId, playerName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const handleJoinRequest = async(
  teamId: string,
  requestId: string,
  status: "approved" | "denied"
) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${API_URL}/teams/${teamId}/requests/${requestId}`,
      { status }, // Body
      { headers: { Authorization: `Bearer ${token}` } } // Headers
    );
    
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};


export const getJoinRequests = async (teamId: string) => {
  try {
    if (!teamId) throw new Error("Team ID is required.");
    const token = getAuthToken(); // Retrieves the token

    console.log("Fetching join requests for teamId:", teamId);

    const response = await axios.get(`${API_URL}/teams/${teamId}/requests`, {
      headers: { Authorization: `Bearer ${token}` }, // Add token to Authorization header
    });

    console.log("Join requests fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};



