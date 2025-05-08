import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  password: string;
  structureId: number;
}

const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [structureId, setStructureId] = useState(3);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get<Role[]>('http://localhost:3000/roles');
        setAvailableRoles(response.data);
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        setError('Failed to load roles.');
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoleId) {
      setError('Please select a role.');
      return;
    }

    const payload = {
      name,
      password,
      structureId,
      roles: [selectedRoleId],
    };

    try {
      const response = await axios.post('http://localhost:3000/users', payload);
      setUser(response.data);
      setError('');
    } catch (err) {
      setError('Failed to create user.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create User</h2>
      
      <form onSubmit={handleSubmit}>
       
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

      
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

      
        <div className="mb-4">
          <label htmlFor="structureId" className="block text-sm font-medium text-gray-600">Structure ID:</label>
          <select
            id="structureId"
            value={structureId}
            onChange={(e) => setStructureId(Number(e.target.value))}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

      
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-600">Select Role:</label>
          <select
            id="role"
            value={selectedRoleId ?? ''}
            onChange={(e) => setSelectedRoleId(Number(e.target.value))}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select a role</option>
            {availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

      
        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create User
          </button>
        </div>
      </form>

   
      {user && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-700">Created User:</h3>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Password:</strong> {user.password}</p>
          <p><strong>Structure ID:</strong> {user.structureId}</p>
        </div>
      )}

    
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default CreateUser;
