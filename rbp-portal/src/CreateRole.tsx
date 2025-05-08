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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Create a New Role</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Role Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Structure ID Select */}
        <div>
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

        {/* Parent Role Select */}
        <div>
          <label htmlFor="parentRoleId" className="block text-sm font-medium text-gray-600">Parent Role:</label>
          <select
            id="parentRoleId"
            value={parentRoleId}
            onChange={(e) => setParentRoleId(Number(e.target.value))}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select a parent role</option>
            {parentRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create Role
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Response Data */}
      {responseData && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-700">Role Created Successfully:</h3>
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
