import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import ListRoles from './ListRoles'; 
import CreateRole from './CreateRole'; 
import AssignRoleToUser from './AssignRoleToUser'; 
import AddUser from './AddUser'; 
import ListUsers from './ListUsers'; 

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/list-roles" element={<ListRoles />} />
        <Route path="/create-role" element={<CreateRole />} />
        <Route path="/assign-role-to-user" element={<AssignRoleToUser />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/list-users" element={<ListUsers />} />
      </Routes>
    </Router>
  );
};

export default App;
