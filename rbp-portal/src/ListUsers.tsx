import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
  structureId: number;
}

interface User {
  id: number;
  name: string;
  password: string;
  structureId: number;
  roles: Role[];
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('No token found. Please log in.');
      console.log('Error: No token found.');
      return;
    }

    axios.get('http://localhost:3000/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError('Failed to fetch users.');
      });
  }, []);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-6 py-3 font-medium text-gray-700 border-b">ID</th>
              <th className="px-6 py-3 font-medium text-gray-700 border-b">Name</th>
              <th className="px-6 py-3 font-medium text-gray-700 border-b">Structure ID</th>
              <th className="px-6 py-3 font-medium text-gray-700 border-b">Roles</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-center border-b">{user.id}</td>
                <td className="px-6 py-3 border-b">{user.name}</td>
                <td className="px-6 py-3 text-center border-b">{user.structureId}</td>
                <td className="px-6 py-3 border-b">
                  <ul className="list-disc pl-6 space-y-1">
                    {user.roles.map((role) => (
                      <li key={role.id} className="text-gray-700">
                        {role.name} (Structure ID: {role.structureId})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUsers;
