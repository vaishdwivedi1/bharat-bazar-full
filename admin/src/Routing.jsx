import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Layout Components
import AdminLayout from "./components/AdminLayout";

// Auth Components
import Login from "./pages/Login";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Product Management
import AddProduct from "./components/product/AddProduct";
import ProductDetail from "./components/product/ProductDetail";
import ProductList from "./pages/ProductList";

// Category Management
import AddCategory from "./components/categories/AddCategory";
import CategoryDetail from "./components/categories/CategoryDetail";
import CategoryList from "./pages/CategoryList";

// User Management
import AddUser from "./components/user/AddUser";
import UserDetail from "./components/user/UserDetail";
import UserList from "./pages/UserList";

// Order Management
import OrderDetail from "./components/orders/OrderDetail";
import OrderList from "./pages/OrderList";

import Profile from "./pages/Profile";
import { ROUTES, BASE_PATH } from "./utils/StaticRoutes";

// ============ PROTECTED ROUTE COMPONENT ============
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

// ============ 404 COMPONENT ============
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
        <a
          href={ROUTES.DASHBOARD}
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back to Dashboard
        </a>
      </div>
    </div>
  );
};

// ============ MAIN ROUTING COMPONENT ============
const Routing = () => {
  // You can implement your own auth logic here
  const isAuthenticated = true; // Replace with actual auth state

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path={BASE_PATH}
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - Default Route */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Product Routes */}
          <Route path="products">
            <Route index element={<ProductList />} />
            <Route path="add" element={<AddProduct />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path="edit/:id" element={<AddProduct />} />
          </Route>

          {/* Category Routes */}
          <Route path="categories">
            <Route index element={<CategoryList />} />
            <Route path="add" element={<AddCategory />} />
            <Route path=":id" element={<CategoryDetail />} />
            <Route path="edit/:id" element={<AddCategory />} />
          </Route>

          {/* User Routes */}
          <Route path="users">
            <Route index element={<UserList />} />
            <Route path="add" element={<AddUser />} />
            <Route path=":id" element={<UserDetail />} />
            <Route path="edit/:id" element={<AddUser />} />
          </Route>

          {/* Order Routes */}
          <Route path="orders">
            <Route index element={<OrderList />} />
            <Route path=":id" element={<OrderDetail />} />
          </Route>

          {/* Profile */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to={BASE_PATH} replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
