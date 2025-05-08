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
    <div>
      <h1>Roles</h1>
      {error && <p className="text-red-500">{error}</p>} {}
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            <h3>{role.name}</h3>
            <p>Structure ID: {role.structureId}</p>
            <p>Permissions: {role.permissions.length > 0 ? role.permissions.join(', ') : 'None'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RolesList;
