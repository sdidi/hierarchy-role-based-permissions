import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
  structureId: number;
  permissions: string[];
}

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get<Role[]>('http://localhost:3000/roles');
        setRoles(response.data); 
      } catch (err) {
        setError('Failed to fetch roles. Please try again later.'); 
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Roles List</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-2">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-800">Role ID</th>
              <th className="px-4 py-2 text-left font-medium text-gray-800">Role Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-800">Structure ID</th>
              <th className="px-4 py-2 text-left font-medium text-gray-800">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.name} className="bg-gray-50 border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-gray-800">{role.id}</td>
                <td className="px-4 py-2 text-gray-800">{role.name}</td>
                <td className="px-4 py-2 text-gray-600">{role.structureId}</td>
                <td className="px-4 py-2 text-gray-600">
                  {role.permissions.length > 0 ? role.permissions.join(', ') : 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesList;
