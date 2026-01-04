import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import AuthProvider and useAuth
import CustomerPanelLayout from "./layouts/CustomerPanelLayout";
import CustomerOrders from "./pages/Customer/CustomerOrders";
import CustomerFavorites from "./pages/Customer/CustomerFavorites";
import ScrollToTop from "./components/ScrollToTop";

const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Analytics = lazy(() => import("./pages/Admin/Analytics"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const Orders = lazy(() => import("./pages/Admin/Orders"));
const OrderDetails = lazy(() => import("./pages/Admin/OrderDetails"));
const GiftCards = lazy(() => import("./pages/Admin/GiftCards"));
const CreateGiftCard = lazy(() => import("./pages/Admin/CreateGiftCard"));
const Home = lazy(() => import("./pages/Customer/Home"));
const Product = lazy(() => import("./pages/Customer/Product"));
const Category = lazy(() => import("./pages/Customer/Category"));
const Login = lazy(() => import("./pages/Auth/Login"));
const CreateUser = lazy(() => import("./pages/Auth/CreateUser"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const CheckoutLayout = lazy(() => import("./layouts/CheckoutLayout"));
const Checkout = lazy(() => import("./pages/Customer/Checkout"));
const Success = lazy(() => import("./pages/Customer/Success"));
const Cancel = lazy(() => import("./pages/Customer/Cancel"));
const About = lazy(() => import("./pages/Customer/About"));

// ProtectedRoute Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "USER")[];
}> = ({ children, allowedRoles }) => {
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
    <ScrollToTop />
    <AuthProvider>
      {" "}
      {/* Wrap the entire app with AuthProvider */}
      <Suspense fallback={<div>Loading…</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />{" "}
          {/* Login route is not protected */}
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/category/:categoryName?" element={<Category />} />
            <Route path="/about" element={<About />} />
            {/* Add more customer routes here */}
          </Route>
          <Route
            path="/checkout"
            element={
              <CheckoutLayout />
            }
          >
            <Route index element={<Checkout />} />
          </Route>
          <Route
            path="/customer"
            element={
              <ProtectedRoute>
                <CustomerPanelLayout />
              </ProtectedRoute>
            }
          >
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="favorites" element={<CustomerFavorites />} />
          </Route>
          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="all-products" element={<AllProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="add-product/:id" element={<AddProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="giftcards" element={<GiftCards />} />
            <Route path="giftcards/new" element={<CreateGiftCard />} />
            <Route path="giftcards/:id" element={<CreateGiftCard />} />
            {/* more admin routes */}
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  </Router>
);

export default App;
