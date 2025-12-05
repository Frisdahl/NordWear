import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import AuthProvider and useAuth

const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AllProducts = lazy(() => import("./pages/Admin/all_products"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const Home = lazy(() => import("./pages/Customer/Home"));
const Product = lazy(() => import("./pages/Customer/Product"));
const Login = lazy(() => import("./pages/Auth/Login"));

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: ('ADMIN' | 'USER')[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth(); // Assuming useAuth provides a loading state

  if (loading) {
    // Optionally render a loading spinner or placeholder while auth state is being determined
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have the required role, redirect to home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => (
  <Router>
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Suspense fallback={<div>Loading…</div>}>
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Login route is not protected */}

          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            {/* Add more customer routes here */}
          </Route>

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="all-products" element={<AllProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="add-product/:id" element={<AddProduct />} />
            {/* more admin routes */}
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  </Router>
);

export default App;
