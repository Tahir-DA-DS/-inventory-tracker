import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // For redirection after logout

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear authentication state
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Dashboard</h1>
        {user ? (
          <div className="text-lg text-gray-700">
            <p className="mb-2">Welcome back, <span className="font-semibold">{user.email}</span>!</p>
            <p className="mb-4">Your role: <span className="font-semibold text-blue-600">{user.role}</span></p>
            <button
              onClick={handleLogout}
              className="mt-6 px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-lg text-gray-700">Loading user data...</p> // Should ideally not happen due to ProtectedRoute
        )}
      </div>
    </div>
  );
};

export default DashboardPage;