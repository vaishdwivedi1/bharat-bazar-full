// components/Navbar.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  User,
  LogIn,
  Package,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/StaticRoutes";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Check auth status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setIsAuthenticated(true);
          setUserData(parsedUser);

          // Get cart count from localStorage or API
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCartCount(cart.length);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        setCartCount(0);
      }
    };

    checkAuth();

    // Listen for storage events (in case of logout in another tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const categories = [
    "All Categories",
    "Electronics & Electrical",
    "Textiles & Apparel",
    "Industrial Supplies",
    "Food & Agriculture",
    "Building Materials",
    "Furniture & Decor",
    "Machinery & Equipment",
    "Health & Medical",
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserData(null);
    setCartCount(0);
    navigate("/");
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleCart = () => {
    if (isAuthenticated) {
      navigate("/user/cart");
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const handleOrders = () => {
    if (isAuthenticated) {
      navigate("/user/orders");
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const handleProfile = () => {
    if (isAuthenticated) {
      if (userData?.role === "seller") {
        navigate("/seller/profile");
      } else {
        navigate("/user/profile");
      }
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex-shrink-0 cursor-pointer"
          >
            <h1 className="text-2xl font-bold text-[hsl(24,100%,50%)]">
              bharatBazar
            </h1>
          </div>

          {/* Desktop Categories Dropdown */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-1 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <span>{activeCategory}</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="block w-full text-left px-4 py-2 hover:bg-[hsl(24,100%,90%)] hover:text-[hsl(24,100%,50%)] first:rounded-t-lg last:rounded-b-lg"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search products or suppliers.."
                className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none transition-all"
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>

            {/* Post Requirement Button */}
            <button className="bg-[hsl(24,100%,50%)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg">
              Post Requirement
            </button>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                <button
                  onClick={handleCart}
                  className="relative p-2 text-gray-600 hover:text-[hsl(24,100%,50%)] transition-colors"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[hsl(24,100%,50%)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Orders */}
                <button
                  onClick={handleOrders}
                  className="p-2 text-gray-600 hover:text-[hsl(24,100%,50%)] transition-colors"
                >
                  <Package size={22} />
                </button>

                {/* Profile */}
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-2 bg-[hsl(24,100%,90%)] text-[hsl(24,100%,50%)] px-4 py-2 rounded-lg hover:bg-[hsl(24,100%,80%)] transition-colors"
                >
                  <User size={18} />
                  <span className="font-medium">
                    {userData?.name?.split(" ")[0] || "Profile"}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 bg-[hsl(24,100%,50%)] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="flex items-center gap-2 border-2 border-[hsl(24,100%,50%)] text-[hsl(24,100%,50%)] px-5 py-2 rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-colors"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Cart icon for mobile */}
            {isAuthenticated && (
              <button
                onClick={handleCart}
                className="relative p-2 text-gray-600"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[hsl(24,100%,50%)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[hsl(24,100%,50%)]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="space-y-4">
              {/* Category Select */}
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products or suppliers.."
                  className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-[hsl(24,100%,50%)] focus:ring-2 focus:ring-[hsl(24,100%,90%)] focus:outline-none"
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>

              {/* Mobile Menu Options */}
              <div className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        handleProfile();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[hsl(24,100%,90%)] hover:text-[hsl(24,100%,50%)] rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        handleOrders();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[hsl(24,100%,90%)] hover:text-[hsl(24,100%,50%)] rounded-lg transition-colors"
                    >
                      <Package size={20} />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/user/wishlist");
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[hsl(24,100%,90%)] hover:text-[hsl(24,100%,50%)] rounded-lg transition-colors"
                    >
                      <Heart size={20} />
                      <span>Wishlist</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogIn size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate(ROUTES.REGISTER);
                        setIsMenuOpen(false);
                      }}
                      className="w-full border-2 border-[hsl(24,100%,50%)] text-[hsl(24,100%,50%)] py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,90%)] transition-colors"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>

              {/* Post Requirement Button */}
              <button className="w-full bg-[hsl(24,100%,50%)] text-white py-3 rounded-lg font-semibold hover:bg-[hsl(24,100%,40%)] transition-colors">
                Post Requirement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Strip */}
      <div className="hidden lg:block bg-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto">
            {categories.slice(1).map((cat) => (
              <a
                key={cat}
                href="#"
                className="text-sm text-gray-600 hover:text-[hsl(24,100%,50%)] whitespace-nowrap transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
