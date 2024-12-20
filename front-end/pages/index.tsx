import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface DecodedToken {
  role: string;
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Clear any lingering tokens
    Cookies.remove('authToken');
    router.push('/login'); // Always redirect to login
  }, [router]);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (!token) {
      router.push('/login'); // Redirect to login if no token
      return;
    }

    // Decode the token to determine the role
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const redirectPaths: Record<string, string> = {
        admin: '/dashboard', // Admin redirect
        captain: '/teamManagement', // Captain redirect
        player: '/playerLanding', // Player now explicitly redirected to Team Management
        spectator: '/reservation',
      };

      const path = redirectPaths[decoded.role] || '/login';
      router.push(path); // Redirect to respective page
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("authToken");
      router.push('/login');
    }
  }, [router]);

  return <div>Redirecting...</div>;
}
