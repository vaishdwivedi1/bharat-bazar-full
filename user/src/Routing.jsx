import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Layout Components
import SellerLayout from "./components/SellerLayout";
import UserLayout from "./components/UserLayout";

// Auth Components
import Login from "./pages/Login";
import Register from "./pages/Register";

// Public Pages (Everyone can see these)
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/user/Home";
import PublicProductDetail from "./pages/user/ProductDetail";
import PublicProducts from "./pages/user/Products";

// User Pages (Protected - after login)
import UserCart from "./pages/user/Cart";
import UserCheckout from "./pages/user/Checkout";
import UserOrderDetail from "./pages/user/OrderDetail";
import UserOrders from "./pages/user/Orders";
import UserProfile from "./pages/user/Profile";
import UserWishlist from "./pages/user/Wishlist";

// Seller Pages (Protected - after login)
import SellerAddProduct from "./pages/seller/AddProduct";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerEditProduct from "./pages/seller/EditProduct";
import SellerInventory from "./pages/seller/Inventory";
import SellerOrderDetail from "./pages/seller/OrderDetail";
import SellerOrders from "./pages/seller/Orders";
import SellerProductDetail from "./pages/seller/ProductDetail";
import SellerProducts from "./pages/seller/Products";
import SellerProfile from "./pages/seller/Profile";
import SellerSettings from "./pages/seller/Settings";

import { ROUTES, SELLER_BASE_PATH, USER_BASE_PATH } from "./utils/StaticRoutes";
import ForgotPassword from "./pages/ForgotPassword";

// ============ PROTECTED ROUTE COMPONENT ============
const ProtectedRoute = ({
  children,
  isAuthenticated,
  userRole,
  allowedRoles,
}) => {
  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
};

// ============ UNAUTHORIZED COMPONENT ============
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600">403</h1>
        <p className="text-2xl text-gray-600 mt-4">Unauthorized Access</p>
        <p className="text-gray-500 mt-2">
          You don't have permission to access this page.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-[hsl(24,100%,50%)] text-white rounded-lg hover:bg-[hsl(24,100%,40%)] transition"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

// ============ 404 COMPONENT ============
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-[hsl(24,100%,50%)] text-white rounded-lg hover:bg-[hsl(24,100%,40%)] transition"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

// ============ MAIN ROUTING COMPONENT ============
const Routing = () => {
  // Auth state - Replace with your actual auth logic (Redux/Context)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUserRole(user.role);
          setUserData(user);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(24,100%,50%)]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ============ PUBLIC ROUTES - FIRST IMPRESSION ============ */}
        {/* These are the first pages visitors see - NO LOGIN REQUIRED */}
        <Route path="/">
          {/* HOME PAGE - This is what everyone sees first */}
          <Route index element={<Home />} />

          {/* Product browsing - Available to everyone */}
          <Route path="products">
            <Route index element={<PublicProducts />} />
            <Route
              path=":id"
              element={
                <UserLayout>
                  {" "}
                  <PublicProductDetail />{" "}
                </UserLayout>
              }
            />
            <Route path="category/:categoryId" element={<PublicProducts />} />
            <Route path="search" element={<PublicProducts />} />
          </Route>

          {/* Information pages - Available to everyone */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* ============ AUTH ROUTES ============ */}
        {/* Only for authentication - separate layout */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* Unauthorized Page */}
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

        {/* ============ PROTECTED USER ROUTES ============ */}
        {/* Only accessible after login as buyer/user */}
        <Route
          path={USER_BASE_PATH}
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              allowedRoles={["user", "buyer"]}
            >
              <UserLayout userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="cart" element={<UserCart />} />
          <Route path="checkout" element={<UserCheckout />} />
          <Route path="orders">
            <Route index element={<UserOrders />} />
            <Route path=":id" element={<UserOrderDetail />} />
          </Route>
          <Route path="wishlist" element={<UserWishlist />} />
          <Route path="profile" element={<UserProfile userData={userData} />} />
        </Route>

        {/* ============ PROTECTED SELLER ROUTES ============ */}
        {/* Only accessible after login with seller role */}
        <Route
          path={SELLER_BASE_PATH}
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              allowedRoles={["seller"]}
            >
              <SellerLayout sellerData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={<SellerDashboard sellerData={userData} />}
          />
          <Route path="products">
            <Route index element={<SellerProducts />} />
            <Route path="add" element={<SellerAddProduct />} />
            <Route path=":id" element={<SellerProductDetail />} />
            <Route path="edit/:id" element={<SellerEditProduct />} />
          </Route>
          <Route path="inventory" element={<SellerInventory />} />
          <Route path="orders">
            <Route index element={<SellerOrders />} />
            <Route path=":id" element={<SellerOrderDetail />} />
          </Route>
          <Route
            path="profile"
            element={<SellerProfile sellerData={userData} />}
          />
          <Route
            path="settings"
            element={<SellerSettings sellerData={userData} />}
          />
        </Route>

        {/* 404 Not Found - Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
