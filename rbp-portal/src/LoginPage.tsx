import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });

      const token = response.data?.access_token;

      if (token) {
        sessionStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        setErrorMsg('Login failed. Invalid credentials');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMsg('Incorrect username or password.');
      } else {
        setErrorMsg('Login failed. Please try again later.');
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border-2 border-blue-500">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>

          {errorMsg && (
            <p className="text-red-500 text-center text-sm mt-2">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
