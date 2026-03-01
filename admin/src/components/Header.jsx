import { FiMenu, FiUser } from "react-icons/fi";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-600 hover:text-gray-900">
          <FiMenu size={24} />
        </button>

        {/* Right Side Icons */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-700">John Doe</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center transition duration-200 shadow-md">
              <FiUser className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
