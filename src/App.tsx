import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

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