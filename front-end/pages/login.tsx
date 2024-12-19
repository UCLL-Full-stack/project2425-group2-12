import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser, decodeToken, redirectUserBasedOnRole } from '../service/authenticationService';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginUser(email, password);
      redirectUserBasedOnRole(router); // Ensures role-based redirection
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LoginPage;
