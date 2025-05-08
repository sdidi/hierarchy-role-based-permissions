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

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Structure ID</th>
            <th className="px-4 py-2 border">Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2 text-center">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2 text-center">{user.structureId}</td>
              <td className="px-4 py-2">
                <ul className="list-disc pl-5">
                  {user.roles.map((role) => (
                    <li key={role.id}>
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
  );
};

export default ListUsers;
