import React, { useState, useRef, useEffect } from "react";
import {
  HiOutlineMenu,
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineChevronDown,
  HiOutlineStar,
  HiOutlineTruck,
  HiOutlineTag,
  HiOutlineChat,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/StaticRoutes";

const SellerLayout = ({ sellerData = {}, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Refs for dropdown containers and buttons
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const userButtonRef = useRef(null);
  const notificationsButtonRef = useRef(null);

  // Handle click outside for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu if click is outside both the menu and the button
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }

      // Close notifications if click is outside both the menu and the button
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        notificationsButtonRef.current &&
        !notificationsButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    // Add event listener when any dropdown is open
    if (showUserMenu || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu, showNotifications]); // Re-run effect when dropdown states change

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Sample seller data (replace with actual props)
  const sellerInfo = {
    storeName: sellerData?.storeName || "My Awesome Store",
    sellerName: sellerData?.sellerName || "John Doe",
    email: sellerData?.email || "seller@example.com",
    profileImage: sellerData?.profileImage || "https://via.placeholder.com/40",
    rating: sellerData?.rating || 4.5,
    totalOrders: sellerData?.totalOrders || 156,
    totalProducts: sellerData?.totalProducts || 89,
    storeSince: sellerData?.storeSince || "2024",
    balance: sellerData?.balance || 1250.75,
  };

  // Now your navigationItems with all routes as variables
  const navigationItems = [
    {
      section: "Dashboard",
      items: [
        {
          name: "Overview",
          path: ROUTES.SELLER_DASHBOARD,
          icon: HiOutlineChartBar,
        },
        {
          name: "Analytics",
          path: ROUTES.SELLER_ANALYTICS,
          icon: HiOutlineChartBar,
        },
      ],
    },
    {
      section: "Products",
      items: [
        {
          name: "All Products",
          path: ROUTES.SELLER_PRODUCTS,
          icon: HiOutlineCube,
        },
        {
          name: "Add Product",
          path: ROUTES.SELLER_PRODUCT_ADD,
          icon: HiOutlineShoppingBag,
        },
        {
          name: "Categories",
          path: ROUTES.SELLER_CATEGORIES,
          icon: HiOutlineTag,
        },
        {
          name: "Add Category",
          path: ROUTES.SELLER_CATEGORY_ADD,
          icon: HiOutlineTag,
        },
        {
          name: "Brands",
          path: ROUTES.SELLER_BRANDS,
          icon: HiOutlineStar,
        },
        {
          name: "Add Brand",
          path: ROUTES.SELLER_BRAND_ADD,
          icon: HiOutlineStar,
        },
        {
          name: "Inventory",
          path: ROUTES.SELLER_INVENTORY,
          icon: HiOutlineClipboardList,
        },
        {
          name: "Low Stock Alerts",
          path: ROUTES.SELLER_LOW_STOCK,
          icon: HiOutlineClipboardList,
        },
      ],
    },
    {
      section: "Orders",
      items: [
        {
          name: "All Orders",
          path: ROUTES.SELLER_ORDERS,
          icon: HiOutlineClipboardList,
        },
        {
          name: "Pending",
          path: ROUTES.SELLER_ORDER_PENDING,
          icon: HiOutlineTruck,
        },
        {
          name: "Processing",
          path: ROUTES.SELLER_ORDER_PROCESSING,
          icon: HiOutlineTruck,
        },
        {
          name: "Shipped",
          path: ROUTES.SELLER_ORDER_SHIPPED,
          icon: HiOutlineTruck,
        },
        {
          name: "Delivered",
          path: ROUTES.SELLER_ORDER_DELIVERED,
          icon: HiOutlineTruck,
        },
        {
          name: "Cancelled",
          path: ROUTES.SELLER_ORDER_CANCELLED,
          icon: HiOutlineClipboardList,
        },
        {
          name: "Returns",
          path: ROUTES.SELLER_RETURNS,
          icon: HiOutlineTruck,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          name: "Dashboard",
          path: ROUTES.SELLER_FINANCE_DASHBOARD,
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Transactions",
          path: ROUTES.SELLER_TRANSACTIONS,
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Payouts",
          path: ROUTES.SELLER_PAYOUTS,
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Withdraw",
          path: ROUTES.SELLER_WITHDRAW,
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Tax Documents",
          path: ROUTES.SELLER_TAX_DOCUMENTS,
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Invoices",
          path: ROUTES.SELLER_INVOICES,
          icon: HiOutlineCurrencyDollar,
        },
      ],
    },
    {
      section: "Marketing",
      items: [
        {
          name: "Promotions",
          path: ROUTES.SELLER_PROMOTIONS,
          icon: HiOutlineTag,
        },
        {
          name: "Coupons",
          path: ROUTES.SELLER_COUPONS,
          icon: HiOutlineTag,
        },
        {
          name: "Advertising",
          path: ROUTES.SELLER_ADVERTISING,
          icon: HiOutlineChartBar,
        },
        {
          name: "Discounts",
          path: ROUTES.SELLER_DISCOUNTS,
          icon: HiOutlineTag,
        },
      ],
    },
    {
      section: "Customers",
      items: [
        {
          name: "All Customers",
          path: ROUTES.SELLER_CUSTOMERS,
          icon: HiOutlineUsers,
        },
        {
          name: "Reviews",
          path: ROUTES.SELLER_REVIEWS,
          icon: HiOutlineStar,
        },
        {
          name: "Messages",
          path: ROUTES.SELLER_MESSAGES,
          icon: HiOutlineChat,
        },
        {
          name: "Support Tickets",
          path: ROUTES.SELLER_SUPPORT_TICKETS,
          icon: HiOutlineQuestionMarkCircle,
        },
      ],
    },
    {
      section: "Reports",
      items: [
        {
          name: "Sales Report",
          path: ROUTES.SELLER_SALES_REPORT,
          icon: HiOutlineChartBar,
        },
        {
          name: "Product Report",
          path: ROUTES.SELLER_PRODUCT_REPORT,
          icon: HiOutlineCube,
        },
        {
          name: "Customer Report",
          path: ROUTES.SELLER_CUSTOMER_REPORT,
          icon: HiOutlineUsers,
        },
        {
          name: "Finance Report",
          path: ROUTES.SELLER_FINANCE_REPORT,
          icon: HiOutlineCurrencyDollar,
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          name: "Profile",
          path: ROUTES.SELLER_PROFILE,
          icon: HiOutlineUserCircle,
        },
        {
          name: "Store Settings",
          path: ROUTES.SELLER_STORE_SETTINGS,
          icon: HiOutlineCog,
        },
        {
          name: "Shipping Settings",
          path: ROUTES.SELLER_SHIPPING_SETTINGS,
          icon: HiOutlineTruck,
        },
        {
          name: "Payment Settings",
          path: ROUTES.SELLER_PAYMENT_SETTINGS,
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Tax Settings",
          path: ROUTES.SELLER_TAX_SETTINGS,
          icon: HiOutlineCurrencyDollar,
        },
        {
          name: "Notification Settings",
          path: ROUTES.SELLER_NOTIFICATION_SETTINGS,
          icon: HiOutlineBell,
        },
        {
          name: "Team Members",
          path: ROUTES.SELLER_TEAM,
          icon: HiOutlineUsers,
        },
        {
          name: "Help Center",
          path: ROUTES.SELLER_HELP_CENTER,
          icon: HiOutlineQuestionMarkCircle,
        },
        {
          name: "FAQ",
          path: ROUTES.SELLER_FAQ,
          icon: HiOutlineQuestionMarkCircle,
        },
      ],
    },
  ];
  const notifications = [
    { id: 1, message: "New order received", time: "5 min ago", type: "order" },
    {
      id: 2,
      message: "Product out of stock",
      time: "1 hour ago",
      type: "inventory",
    },
    {
      id: 3,
      message: "New review on your product",
      time: "3 hours ago",
      type: "review",
    },
    {
      id: 4,
      message: "Payment processed successfully",
      time: "5 hours ago",
      type: "payment",
    },
    {
      id: 5,
      message: "Shipping label ready",
      time: "1 day ago",
      type: "shipping",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <HiOutlineMenu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
              <div className="bg-[hsl(24,100%,50%)] w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-gray-800 hidden sm:block">
                Seller Central
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <HiOutlineSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notificationsButtonRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors"
                aria-label="Notifications"
              >
                <HiOutlineBell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div
                  ref={notificationsRef}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                    <span className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                      Mark all as read
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          // Handle notification click
                          setShowNotifications(false);
                        }}
                      >
                        <p className="text-sm text-gray-800">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userButtonRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="User menu"
              >
                <img
                  src={sellerInfo.profileImage}
                  alt={sellerInfo.sellerName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {sellerInfo.sellerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sellerInfo.storeName}
                  </p>
                </div>
                <HiOutlineChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div
                  ref={userMenuRef}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-medium text-gray-800">
                      {sellerInfo.sellerName}
                    </p>
                    <p className="text-sm text-gray-500">{sellerInfo.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <HiOutlineStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {sellerInfo.rating} · {sellerInfo.totalOrders} orders
                      </span>
                    </div>
                  </div>
                  <div className="py-2">
                    <NavLink
                      to="profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineUserCircle className="w-4 h-4" />
                      Profile
                    </NavLink>
                    <NavLink
                      to="settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineCog className="w-4 h-4" />
                      Settings
                    </NavLink>
                    <NavLink
                      to="help"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors md:hidden"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineQuestionMarkCircle className="w-4 h-4" />
                      Help Center
                    </NavLink>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-red-600 w-full text-left transition-colors"
                    >
                      <HiOutlineLogout className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20 overflow-y-auto ${
          isSidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Store Info Card */}
        {isSidebarOpen ? (
          <div className="p-4 border-b border-gray-200">
            <div className="bg-[hsl(24,100%,50%)] rounded-lg p-4 text-white">
              <h3 className="font-semibold text-lg truncate">
                {sellerInfo.storeName}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <HiOutlineStar className="w-4 h-4 fill-current" />
                <span className="text-sm">{sellerInfo.rating}</span>
              </div>
              <p className="text-xs opacity-90 mt-2">
                Store since {sellerInfo.storeSince}
              </p>
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <div>
                <p className="text-gray-500">Products</p>
                <p className="font-semibold">{sellerInfo.totalProducts}</p>
              </div>
              <div>
                <p className="text-gray-500">Orders</p>
                <p className="font-semibold">{sellerInfo.totalOrders}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200 text-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mx-auto flex items-center justify-center text-white font-bold">
              {sellerInfo.storeName.charAt(0)}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4">
          {navigationItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {isSidebarOpen && (
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {section.section}
                </h4>
              )}
              <ul className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      title={!isSidebarOpen ? item.name : undefined}
                    >
                      <item.icon
                        className={`w-5 h-5 ${!isSidebarOpen ? "mx-auto" : ""}`}
                      />
                      {isSidebarOpen && (
                        <span className="text-sm">{item.name}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 min-h-screen ${
          isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        {/* Quick Stats Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-16 z-10">
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Today's Sales:</span>
              <span className="font-semibold text-green-600">
                ${sellerInfo.balance}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Pending Orders:</span>
              <span className="font-semibold text-orange-600">12</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Low Stock:</span>
              <span className="font-semibold text-red-600">5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total Revenue:</span>
              <span className="font-semibold text-blue-600">$12,450</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
