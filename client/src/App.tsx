// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProductsPage from './pages/ProductsPage';
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
      <QueryClientProvider client={queryClient}>
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
          <Route // THIS IS THE UPDATED ROUTE
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductsPage /> {/* Use the ProductsPage here */}
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* ... (other placeholder routes) ... */}
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster /> {/* Add Toaster here */}
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;