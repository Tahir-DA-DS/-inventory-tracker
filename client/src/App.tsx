import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage'; // Import the new SignupPage
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app (or at least the routes) with AuthProvider */}
      <Routes>
        {/* The login page is not protected */}
        <Route path="/login" element={<LoginPage />} />

        {/* The signup page is also not protected */}
        <Route path="/signup" element={<SignupPage />} />

        {/* The dashboard page is protected. If not logged in, it redirects to /login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for 404 (optional, but good practice) */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;