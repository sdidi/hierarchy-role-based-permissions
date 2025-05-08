import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListUsers from './ListUsers';
import AddUser from './AddUser';
import CreateRole from './CreateRole';
import ListRoles from './ListRoles';
import AssignRoleToUser from './AssignRoleToUser';

const Dashboard: React.FC = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showListRoles, setShowListRoles] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          Back to Login
        </button>
      </div>
   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => setShowUsers((prev) => !prev)}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
        >
          {showUsers ? 'Hide User List' : 'User List'}
        </button>

        <button
          onClick={() => setShowAddUser((prev) => !prev)}
          className="w-full py-3 px-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105"
        >
          {showAddUser ? 'Hide Add User' : 'Add User'}
        </button>

        <button
          onClick={() => setShowCreateRole((prev) => !prev)}
          className="w-full py-3 px-4 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition transform hover:scale-105"
        >
          {showCreateRole ? 'Hide Create Role' : 'Create Role'}
        </button>

        <button
          onClick={() => setShowListRoles((prev) => !prev)}
          className="w-full py-3 px-4 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
        >
          {showListRoles ? 'Hide Role List' : 'Role List'}
        </button>

        <button
          onClick={() => setShowAssignRole((prev) => !prev)}
          className="w-full py-3 px-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition transform hover:scale-105"
        >
          {showAssignRole ? 'Hide Assign Role' : 'Assign Role'}
        </button>
      </div>

      <div className="space-y-6">
        {showUsers && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <ListUsers />
          </div>
        )}
        {showAddUser && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AddUser />
          </div>
        )}
        {showCreateRole && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <CreateRole />
          </div>
        )}
        {showListRoles && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <ListRoles />
          </div>
        )}
        {showAssignRole && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AssignRoleToUser />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
