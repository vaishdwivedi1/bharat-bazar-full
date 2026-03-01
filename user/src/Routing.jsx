// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// // Layout Components
// import MainLayout from "./components/MainLayout";
// import UserLayout from "./components/UserLayout";
// import SellerLayout from "./components/SellerLayout";

// // Auth Components
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// // Public Pages
// import Home from "./pages/Home";
// import PublicProducts from "./pages/Products";
// import PublicProductDetail from "./pages/ProductDetail";
// import About from "./pages/About";
// import Contact from "./pages/Contact";

// // User Pages (Protected - after login)
// import UserCart from "./pages/user/Cart";
// import UserCheckout from "./pages/user/Checkout";
// import UserOrders from "./pages/user/Orders";
// import UserOrderDetail from "./pages/user/OrderDetail";
// import UserProfile from "./pages/user/Profile";
// import UserWishlist from "./pages/user/Wishlist";

// // Seller Pages (Protected - after login)
// import SellerDashboard from "./pages/seller/Dashboard";
// import SellerProducts from "./pages/seller/Products";
// import SellerAddProduct from "./pages/seller/AddProduct";
// import SellerEditProduct from "./pages/seller/EditProduct";
// import SellerProductDetail from "./pages/seller/ProductDetail";
// import SellerOrders from "./pages/seller/Orders";
// import SellerOrderDetail from "./pages/seller/OrderDetail";
// import SellerInventory from "./pages/seller/Inventory";
// import SellerProfile from "./pages/seller/Profile";
// import SellerSettings from "./pages/seller/Settings";

// import { ROUTES, USER_BASE_PATH, SELLER_BASE_PATH } from "./utils/StaticRoutes";

// // ============ PROTECTED ROUTE COMPONENT ============
// const ProtectedRoute = ({
//   children,
//   isAuthenticated,
//   userRole,
//   allowedRoles,
// }) => {
//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
//   }

//   return children;
// };

// // ============ UNAUTHORIZED COMPONENT ============
// const Unauthorized = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="text-center">
//         <h1 className="text-9xl font-bold text-red-600">403</h1>
//         <p className="text-2xl text-gray-600 mt-4">Unauthorized Access</p>
//         <p className="text-gray-500 mt-2">
//           You don't have permission to access this page.
//         </p>
//         <a
//           href="/"
//           className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Go to Homepage
//         </a>
//       </div>
//     </div>
//   );
// };

// // ============ 404 COMPONENT ============
// const NotFound = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="text-center">
//         <h1 className="text-9xl font-bold text-gray-800">404</h1>
//         <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
//         <a
//           href="/"
//           className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Go to Homepage
//         </a>
//       </div>
//     </div>
//   );
// };

// // ============ MAIN ROUTING COMPONENT ============
// const Routing = () => {
//   // You can implement your own auth logic here
//   const isAuthenticated = false; // Replace with actual auth state
//   const userRole = null; // Replace with actual user role (e.g., "user" or "seller")
//   const userData = {
//     id: 1,
//     name: "John Doe",
//     email: "john@example.com",
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ============ PUBLIC ROUTES (Visible to everyone) ============ */}
//         <Route path="/" element={<MainLayout />}>
//           {/* Home/Dashboard Page */}
//           <Route index element={<Home />} />

//           {/* Public Product Routes */}
//           <Route path="products">
//             <Route index element={<PublicProducts />} />
//             <Route path=":id" element={<PublicProductDetail />} />
//             <Route path="category/:categoryId" element={<PublicProducts />} />
//             <Route path="search" element={<PublicProducts />} />
//           </Route>

//           {/* Other Public Pages */}
//           <Route path="about" element={<About />} />
//           <Route path="contact" element={<Contact />} />
//         </Route>

//         {/* Auth Routes (separate layout - no header/footer) */}
//         <Route path="/auth">
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />
//         </Route>

//         {/* Unauthorized Page */}
//         <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

//         {/* ============ USER ROUTES (Protected - After Login) ============ */}
//         <Route
//           path={USER_BASE_PATH}
//           element={
//             <ProtectedRoute
//               isAuthenticated={isAuthenticated}
//               userRole={userRole}
//               allowedRoles={["user"]}
//             >
//               <UserLayout userData={userData} />
//             </ProtectedRoute>
//           }
//         >
//           {/* User Cart & Checkout */}
//           <Route path="cart" element={<UserCart />} />
//           <Route path="checkout" element={<UserCheckout />} />

//           {/* User Orders */}
//           <Route path="orders">
//             <Route index element={<UserOrders />} />
//             <Route path=":id" element={<UserOrderDetail />} />
//           </Route>

//           {/* User Wishlist */}
//           <Route path="wishlist" element={<UserWishlist />} />

//           {/* User Profile */}
//           <Route path="profile" element={<UserProfile />} />
//         </Route>

//         {/* ============ SELLER ROUTES (Protected - After Login) ============ */}
//         <Route
//           path={SELLER_BASE_PATH}
//           element={
//             <ProtectedRoute
//               isAuthenticated={isAuthenticated}
//               userRole={userRole}
//               allowedRoles={["seller"]}
//             >
//               <SellerLayout sellerData={userData} />
//             </ProtectedRoute>
//           }
//         >
//           {/* Seller Dashboard */}
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<SellerDashboard />} />

//           {/* Seller Product Management */}
//           <Route path="products">
//             <Route index element={<SellerProducts />} />
//             <Route path="add" element={<SellerAddProduct />} />
//             <Route path=":id" element={<SellerProductDetail />} />
//             <Route path="edit/:id" element={<SellerEditProduct />} />
//           </Route>

//           {/* Seller Inventory */}
//           <Route path="inventory" element={<SellerInventory />} />

//           {/* Seller Order Management */}
//           <Route path="orders">
//             <Route index element={<SellerOrders />} />
//             <Route path=":id" element={<SellerOrderDetail />} />
//           </Route>

//           {/* Seller Profile & Settings */}
//           <Route path="profile" element={<SellerProfile />} />
//           <Route path="settings" element={<SellerSettings />} />
//         </Route>

//         {/* 404 Not Found */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default Routing;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Layout Components
import MainLayout from "./components/MainLayout";
import UserLayout from "./components/UserLayout";
import SellerLayout from "./components/SellerLayout";

// Auth Components
import Login from "./pages/Login";
import Register from "./pages/Register";

// Public Pages (Everyone can see these)
import Home from "./pages/Home";
import PublicProducts from "./pages/Products";
import PublicProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";

// User Pages (Protected - after login)
import UserCart from "./pages/user/Cart";
import UserCheckout from "./pages/user/Checkout";
import UserOrders from "./pages/user/Orders";
import UserOrderDetail from "./pages/user/OrderDetail";
import UserProfile from "./pages/user/Profile";
import UserWishlist from "./pages/user/Wishlist";

// Seller Pages (Protected - after login)
import SellerDashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/Products";
import SellerAddProduct from "./pages/seller/AddProduct";
import SellerEditProduct from "./pages/seller/EditProduct";
import SellerProductDetail from "./pages/seller/ProductDetail";
import SellerOrders from "./pages/seller/Orders";
import SellerOrderDetail from "./pages/seller/OrderDetail";
import SellerInventory from "./pages/seller/Inventory";
import SellerProfile from "./pages/seller/Profile";
import SellerSettings from "./pages/seller/Settings";

import { ROUTES, USER_BASE_PATH, SELLER_BASE_PATH } from "./utils/StaticRoutes";

// ============ PROTECTED ROUTE COMPONENT ============
const ProtectedRoute = ({
  children,
  isAuthenticated,
  userRole,
  allowedRoles,
}) => {
  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    return <Navigate to={ROUTES.LOGIN} replace />;
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
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

// ============ MAIN ROUTING COMPONENT ============
const Routing = () => {
  // You can implement your own auth logic here
  const isAuthenticated = false; // Replace with actual auth state
  const userRole = null; // Replace with actual user role (e.g., "user" or "seller")
  const userData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ============ PUBLIC ROUTES - FIRST IMPRESSION ============ */}
        {/* These are the first pages visitors see - NO LOGIN REQUIRED */}
        <Route path="/" element={<MainLayout />}>
          {/* HOME PAGE - This is what everyone sees first */}
          <Route index element={<Home />} />

          {/* Product browsing - Available to everyone */}
          <Route path="products">
            <Route index element={<PublicProducts />} />
            <Route path=":id" element={<PublicProductDetail />} />
            <Route path="category/:categoryId" element={<PublicProducts />} />
            <Route path="search" element={<PublicProducts />} />
          </Route>

          {/* Information pages - Available to everyone */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* ============ AUTH ROUTES ============ */}
        {/* Only for authentication - separate layout */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Unauthorized Page */}
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

        {/* ============ PROTECTED USER ROUTES ============ */}
        {/* Only accessible after login */}
        <Route
          path={USER_BASE_PATH}
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              allowedRoles={["user"]}
            >
              <UserLayout userData={userData} />
            </ProtectedRoute>
          }
        >
          <Route path="cart" element={<UserCart />} />
          <Route path="checkout" element={<UserCheckout />} />
          <Route path="orders">
            <Route index element={<UserOrders />} />
            <Route path=":id" element={<UserOrderDetail />} />
          </Route>
          <Route path="wishlist" element={<UserWishlist />} />
          <Route path="profile" element={<UserProfile />} />
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
              <SellerLayout sellerData={userData} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard />} />
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
          <Route path="profile" element={<SellerProfile />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

        {/* 404 Not Found - Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
