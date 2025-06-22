import React, { useState, useEffect, useCallback } from 'react';
import { LogOut } from 'lucide-react';
import Auth from './components/Auth';
import Dashboard from './components/DashBoard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUsername && storedUserId) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setUserId(storedUserId);
    } else {
      setIsAuthenticated(false);
      setUsername('');
      setUserId('');
    }

    const checkAuth = () => {
      const updatedToken = localStorage.getItem('jwtToken');
      const updatedUsername = localStorage.getItem('username');
      const updatedUserId = localStorage.getItem('userId');
      if (updatedToken && updatedUsername && updatedUserId) {
        setIsAuthenticated(true);
        setUsername(updatedUsername);
        setUserId(updatedUserId);
      } else {
        setIsAuthenticated(false);
        setUsername('');
        setUserId('');
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogin = (token, user, id) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('username', user);
    localStorage.setItem('userId', id);
    setIsAuthenticated(true);
    setUsername(user);
    setUserId(id);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUsername('');
    setUserId('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      {isAuthenticated && (
        <header className="w-full max-w-7xl flex justify-between items-center py-4 px-4 bg-gray-800 rounded-lg shadow-md mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-teal-400">
            StockSim: {username}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm sm:text-base font-semibold transition duration-300 ease-in-out shadow-lg"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Logout
          </button>
        </header>
      )}

      <main className="w-full flex-grow flex flex-col items-center justify-center p-0">
        {!isAuthenticated ? (
          <Auth onLogin={handleLogin} />
        ) : (
          <Dashboard username={username} userId={userId} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;
