import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AllProducts = lazy(() => import("./pages/Admin/all_products"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const Home = lazy(() => import("./pages/Customer/Home"));
const Product = lazy(() => import("./pages/Customer/Product"));

const App: React.FC = () => (
  <Router>
    <Suspense fallback={<div>Loading…</div>}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/all-products" element={<AllProducts />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/add-product/:id" element={<AddProduct />} />
          {/* more admin routes */}
        </Route>

        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
        </Route>
      </Routes>
    </Suspense>
  </Router>
);

export default App;
