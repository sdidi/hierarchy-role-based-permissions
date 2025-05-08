import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CreateRoleRequest {
  name: string;
  structureId: number;
  parentRoleId: number;
}

interface ParentRole {
  id: number;
  name: string;
  structureId: number;
  permissions: string[];
}

interface RoleResponse {
  id: number;
  name: string;
  structureId: number;
  parentRole: ParentRole;
  permissions: string[];
}

const CreateRole: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [structureId, setStructureId] = useState<number>(3);
  const [parentRoleId, setParentRoleId] = useState<number>(0);
  const [parentRoles, setParentRoles] = useState<ParentRole[]>([]);
  const [responseData, setResponseData] = useState<RoleResponse | null>(null);
  const [error, setError] = useState<string>('');

  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get<ParentRole[]>('http://localhost:3000/roles');
        setParentRoles(response.data);
      } catch (err) {
        setError('Failed to load roles.');
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
     console.log('Role to be created'+parentRoleId);
    const payload: CreateRoleRequest = {
      name,
      structureId,
      parentRoleId,
    };

    try {
      const response = await axios.post<RoleResponse>('http://localhost:3000/roles', payload);
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to create role. Parent must have a lower structure ID and be higher in the hierarchy.');
      setResponseData(null);
    }
  };

  return (
    <div>
      <h1>Create a New Role</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Structure ID</label>
          <select
            value={structureId}
            onChange={(e) => setStructureId(Number(e.target.value))}
            required
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        <div>
          <label>Parent Role</label>
          <select
            value={parentRoleId}
            onChange={(e) => setParentRoleId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Select a parent role</option>
            {parentRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create Role</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {responseData && (
        <div>
          <h2>Role Created Successfully:</h2>
          <p><strong>Role ID:</strong> {responseData.id}</p>
          <p><strong>Role Name:</strong> {responseData.name}</p>
          <p><strong>Structure ID:</strong> {responseData.structureId}</p>
          {responseData.parentRole ? (
      <>
        <p><strong>Parent Role Name:</strong> {responseData.parentRole.name}</p>
        <p><strong>Parent Role Structure ID:</strong> {responseData.parentRole.structureId}</p>
      </>
    ) : (
      <p>No parent role information available.</p>
    )}
        </div>
      )}
    </div>
  );
};

export default CreateRole;
