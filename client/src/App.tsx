// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // Import the Layout component
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import TanStack Query
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Import Devtools (optional)

// Create a client for TanStack Query
const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}> {/* Wrap with QueryClientProvider */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes wrapped with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  {/* TODO: Create ProductsPage component */}
                  <div className="text-white">Products Page Coming Soon!</div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Layout>
                  {/* TODO: Create SalesPage component */}
                  <div className="text-white">Sales Page Coming Soon!</div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  {/* TODO: Create CategoriesPage component */}
                  <div className="text-white">Categories Page Coming Soon!</div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  {/* TODO: Create SettingsPage component */}
                  <div className="text-white">Settings Page Coming Soon!</div>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all for 404 */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} /> {/* Optional Devtools */}
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;