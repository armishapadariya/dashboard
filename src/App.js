import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  console.log("user: ", user);
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  console.log("user: ", user);
  return !user ? children : <Navigate to="/dashboard" />;
}

export default App;
