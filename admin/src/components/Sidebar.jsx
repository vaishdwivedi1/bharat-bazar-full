import {
  FiFolder,
  FiHome,
  FiLogOut,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../utils/StaticRoutes";

const Sidebar = () => {
  const navItems = [
    { path: ROUTES.DASHBOARD, name: "Dashboard", icon: FiHome },
    { path: ROUTES.PRODUCTS, name: "Products", icon: FiShoppingBag },
    { path: ROUTES.CATEGORIES, name: "Categories", icon: FiFolder },
    { path: ROUTES.USERS, name: "Users", icon: FiUsers },
    { path: ROUTES.ORDERS, name: "Orders", icon: FiShoppingCart },
    { path: ROUTES.PROFILE, name: "Profile", icon: FiUser },
  ];

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
    // You might want to redirect to login page after logout
    // navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="w-64 bg-white  h-screen fixed left-0 top-0">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-xs text-gray-500 mt-1">E-commerce Admin</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-100"
                }`
              }
              end={item.path === ROUTES.DASHBOARD}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 ${isActive ? "text-white" : "text-gray-500"}`}
                    size={20}
                  />
                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-200 group"
          >
            <FiLogOut
              className="mr-3 text-gray-500 group-hover:text-red-600"
              size={20}
            />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
