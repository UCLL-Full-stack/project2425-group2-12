import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { NextRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface DecodedToken {
  role: string;
  exp: number;
}

export const loginUser = async (email: string, password: string): Promise<void> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  const { token } = response.data;

  if (token) {
    Cookies.set('authToken', token, { expires: 1 }); // 1 day expiration
  } else {
    throw new Error('Token missing in API response');
  }
};

export const decodeToken = (): DecodedToken | null => {
  const token = Cookies.get('authToken');
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    Cookies.remove('authToken');
    return null;
  }
};

export const logoutUser = () => {
  Cookies.remove('authToken');
};

export const redirectUserBasedOnRole = (router: NextRouter) => {
  const decoded = decodeToken();
  if (!decoded?.role) {
    router.push('/login');
    return;
  }

  const redirectPaths: Record<string, string> = {
    admin: '/dashboard',
    captain: '/teamManagement',
    player: '/playerLanding', // Redirect player to Team Management
    spectator: '/reservation',
  };

  const path = redirectPaths[decoded.role] || '/login';
  router.push(path);
};


  export const registerUser = async (email: string, password: string, role: string) => {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      password,
      role,
    });
    return response.data;
  };

 