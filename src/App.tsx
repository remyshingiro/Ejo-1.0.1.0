import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Savings from './pages/Savings';
import Loans from './pages/Loans';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard'; 
import ProtectedRoute from './components/ProtectedRoute';

// 🔥 1. Import the Admin Vault Wrapper
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/savings",
    element: (
      <ProtectedRoute>
        <Savings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/loans",
    element: (
      <ProtectedRoute>
        <Loans />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  
  // 🔥 2. Swap ProtectedRoute for AdminRoute here!
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;