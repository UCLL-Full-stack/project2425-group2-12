// components/withAuth.tsx
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

interface DecodedToken {
  role: string;


}

export const withAuth = (
  WrappedComponent: React.ComponentType,
  allowedRoles: string[]
) => {
  const AuthenticatedRoute = () => {
    const router = useRouter();

    

    useEffect(() => {
        const token = Cookies.get("authToken"); // Fetch token from Cookies
        if (!token) {
          router.push("/login");
          return;
        }
  
        try {
          const decoded: DecodedToken = jwtDecode(token);
          if (!allowedRoles.includes(decoded.role)) {
            router.push("/"); // Redirect unauthorized roles
          }
        } catch (error) {
          console.error("Invalid token:", error);
          router.push("/login");
        }
      }, []);
  
      return <WrappedComponent />;
    };

    
  return AuthenticatedRoute;
  
};
export const getUserRole = (): string | null => {
  const token = Cookies.get("authToken");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};