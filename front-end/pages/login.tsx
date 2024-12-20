import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loginUser, redirectUserBasedOnRole } from "../service/authenticationService";
import { useTranslation } from "react-i18next";
import { i18n } from "next-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      redirectUserBasedOnRole(router); // Role-based redirection
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };
  const changeLanguage = (lang: string) => {
    if (i18n) {
      i18n.changeLanguage(lang);
    } else {
      console.error("i18n is not initialized");
    }
  };
  

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">{t("Login")}</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t("password")}

            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            {t("Login")}
            </button>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
