// services/reservationService.ts
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;


const getAuthToken = () => {
  const token = Cookies.get("authToken"); // Retrieve token from cookies
  if (!token) throw new Error("Auth token not found.");
  return token;
};


const handleAuthError = (error: any) => {
  if (error.response?.status === 403) {
    console.error("You do not have permission to access this resource.");
    alert("You are not authorized to perform this action.");
    return;
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



export const createReservation = async (gameId: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_URL}/reservations`,
      { gameId }, // Only pass gameId
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};
export const cancelReservation = async (reservationId: string) => {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/reservations/${reservationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleAuthError(error);
  }
};

export const getReservations = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/reservations`, 
  { headers: { Authorization: `Bearer ${token}` } }
  ); // Add auth header  )
  return response.data.data; // Adjust based on your API response structure
};
