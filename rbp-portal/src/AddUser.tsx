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
    <div className="create-user">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Structure ID:</label>
          <input
            type="number"
            value={structureId}
            onChange={(e) => setStructureId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Select Role:</label>
          <select value={selectedRoleId ?? ''} onChange={(e) => setSelectedRoleId(Number(e.target.value))} required>
            <option value="" disabled>Select a role</option>
            {availableRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>

      {user && (
        <div>
          <h3>Created User:</h3>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Password: {user.password}</p>
          <p>Structure ID: {user.structureId}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateUser;
