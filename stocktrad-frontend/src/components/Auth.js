import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { UserPlus, LogIn } from 'lucide-react';

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      if (isRegister) {
        await registerUser(username, password);
        setMessage('Registration successful! Please log in.');
        setIsRegister(false);
      } else {
        const response = await loginUser(username, password);
        onLogin(response.jwtToken, response.username, response.userId);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mt-10 border border-gray-700">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-400 mb-6">
        {isRegister ? 'Register' : 'Login'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center">{message}</p>}

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-lg font-semibold transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
        >
          {isRegister ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-6 text-sm">
        {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage('');
            setError('');
          }}
          className="text-teal-400 hover:text-teal-300 font-medium ml-1 transition duration-200"
        >
          {isRegister ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}

export default Auth;