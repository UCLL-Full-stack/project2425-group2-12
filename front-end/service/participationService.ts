import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const getAuthToken = () => {
  const token = Cookies.get("authToken");
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
// Fetch all upcoming games
export const getUpcomingGames = async () => {
 try { const token = getAuthToken();
  const response = await axios.get(`${API_URL}/games/upcoming`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
  catch (error) {
    handleAuthError(error);
  }
};

// Fetch player participation status
export const getPlayerParticipation = async (playerId: string) => {
  try {const token = getAuthToken();
  const response = await axios.get(`${API_URL}/games/participation/${playerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
  catch (error) {
    handleAuthError(error);
  }
};

// Confirm participation in a game
export const confirmParticipation = async (playerId: string, gameId: string) => {
  try {const token = getAuthToken();
  const response = await axios.post(`${API_URL}/games/participation`, {
    playerId,
    gameId,
  } ,
     { headers: { Authorization: `Bearer ${token}` } } // Attach token
);
  return response.data;
}
  catch (error) {
    handleAuthError(error);
  }
};

// Update participation status (e.g., cancel participation)
export const updateParticipation = async (
  playerId: string,
  gameId: string,
  status: "confirmed" | "not confirmed"
) => {
  try {
  const token = getAuthToken();
  const response = await axios.patch(
    `${API_URL}/games/participation/${gameId}/${playerId}`,
    { status },
    {headers: { Authorization: `Bearer ${token}` } // Attach token
});
  return response.data;
}
  catch (error) {
    handleAuthError(error);
  }
};
// Fetch team roster for a specific game
export const getTeamRoster = async (gameId: string) => {
  try {const token = getAuthToken();
  const response = await axios.get(`${API_URL}/games/${gameId}/roster`, {
    headers: { Authorization: `Bearer ${token}` }, // Attach token
  });
  return response.data;
}
  catch (error) {
    handleAuthError(error);
  }
};
