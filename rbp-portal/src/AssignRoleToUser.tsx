import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AssignRoleRequest {
  userId: number;
  roleId: number;
}

interface Role {
  id: number;
  name: string;
  structureId: number;
}

interface User {
  id: number;
  name: string;
}

interface UserResponse {
  id: number;
  name: string;
  password: string;
  structureId: number;
  roles: Role[];
}

const AssignRole: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [userId, setUserId] = useState<number>();
  const [roleId, setRoleId] = useState<number>();

  const [responseData, setResponseData] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      console.error('Error: No token found.');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [usersRes, rolesRes] = await Promise.all([
          axios.get<User[]>('http://localhost:3000/users', headers),
          axios.get<Role[]>('http://localhost:3000/roles', headers),
        ]);

        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        setError('Failed to load users or roles: ' + (err as any)?.message);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userId || !roleId) {
      setError('User and role must be selected.');
      return;
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const payload: AssignRoleRequest = { userId, roleId };

    try {
      const response = await axios.post<UserResponse>(
        'http://localhost:3000/users/assign-role',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to assign role. Please try again.');
      setResponseData(null);
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Assign Role to User</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>User:</label>
          <select value={userId ?? ''} onChange={(e) => setUserId(Number(e.target.value))} required>
            <option value="" disabled>Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Role:</label>
          <select value={roleId ?? ''} onChange={(e) => setRoleId(Number(e.target.value))} required>
            <option value="" disabled>Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Assign Role</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {responseData && (
        <div>
          <h2>User Details:</h2>
          <p><strong>User ID:</strong> {responseData.id}</p>
          <p><strong>Name:</strong> {responseData.name}</p>
          <p><strong>Structure ID:</strong> {responseData.structureId}</p>
          <h3>Assigned Roles:</h3>
          <ul>
            {responseData.roles.map((role) => (
              <li key={role.id}>
                <strong>Role Name:</strong> {role.name} | <strong>Structure ID:</strong> {role.structureId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssignRole;
