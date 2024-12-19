import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const getAuthToken = () => {
  const token = Cookies.get("authToken"); // Retrieve token from cookies
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



export const getProfile = async (token: string) => {
   try { const token = getAuthToken();
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
}catch (error) {
  handleAuthError(error);
}};
  