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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Back to Login
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={() => setShowUsers((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showUsers ? 'Hide User List' : 'User List'}
        </button>

        <button
          onClick={() => setShowAddUser((prev) => !prev)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showAddUser ? 'Hide Add User' : 'Add User'}
        </button>

        <button
          onClick={() => setShowCreateRole((prev) => !prev)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          {showCreateRole ? 'Hide Create Role' : 'Create Role'}
        </button>

        <button
          onClick={() => setShowListRoles((prev) => !prev)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          {showListRoles ? 'Hide Role List' : 'Role List'}
        </button>

        <button
          onClick={() => setShowAssignRole((prev) => !prev)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {showAssignRole ? 'Hide Assign Role' : 'Assign Role'}
        </button>
      </div>

      <div className="space-y-4">
        {showUsers && <ListUsers />}
        {showAddUser && <AddUser />}
        {showCreateRole && <CreateRole />}
        {showListRoles && <ListRoles />}
        {showAssignRole && <AssignRoleToUser />}
      </div>
    </div>
  );
};

export default Dashboard;
