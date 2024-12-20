import { useRouter } from "next/router";
import { useEffect } from "react";

import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import App from "next/app";

interface DecodedToken {
  role: string;
}



export default function Home() {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove("authToken"); // Clear lingering tokens
    router.push("/login"); // Always redirect to login
  }, [router]);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (!token) {
      router.push("/login"); // Redirect to login if no token
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const redirectPaths: Record<string, string> = {
        admin: "/dashboard",
        captain: "/teamManagement",
        player: "/playerLanding", // Player redirected to Team Management
        spectator: "/reservation",
      };

      const path = redirectPaths[decoded.role] || "/login";
      router.push(path); // Redirect based on role
    } catch (error) {
      console.error("Invalid token:", error);
      Cookies.remove("authToken"); // Clear invalid token
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-blue-600">Redirecting...</h1>
    </div>
  );
}
