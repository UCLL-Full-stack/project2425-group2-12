// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Navbar = () => {
  const router = useRouter();
  const isLoggedIn = !!Cookies.get("authToken");

  const handleLogout = () => {
    Cookies.remove('authToken');
    alert('Logged out successfully.');
    router.push('/login');
  };

  

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
   <Link href="/">
  <span className="text-lg font-bold cursor-pointer">Cricket App</span>
</Link>

      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
              Login
            </a>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
