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
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Assign Role to User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">User</label>
          <select
            value={userId ?? ''}
            onChange={(e) => setUserId(Number(e.target.value))}
            required
            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select a user
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={roleId ?? ''}
            onChange={(e) => setRoleId(Number(e.target.value))}
            required
            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select a role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition"
          >
            Assign Role
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {responseData && (
        <div className="bg-gray-50 p-4 rounded-md shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">User Details:</h2>
          <p>
            <strong>User ID:</strong> {responseData.id}
          </p>
          <p>
            <strong>Name:</strong> {responseData.name}
          </p>
          <p>
            <strong>Structure ID:</strong> {responseData.structureId}
          </p>
          <h3 className="text-md font-semibold text-gray-700">Assigned Roles:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {responseData.roles.map((role) => (
              <li key={role.id} className="text-gray-600">
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
