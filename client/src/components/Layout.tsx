import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HomeIcon,
  ArchiveBoxIcon,
  ReceiptPercentIcon,
  TagIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Products', path: '/products', icon: ArchiveBoxIcon },
    { name: 'Sales', path: '/sales', icon: ReceiptPercentIcon },
    { name: 'Categories', path: '/categories', icon: TagIcon },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white flex flex-col min-h-screen p-4 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center mb-8 px-2 py-3 rounded-md bg-gray-100 dark:bg-gray-900">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-lg font-bold mr-3 text-white">
          S
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">StockTrack</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Small Business Suite</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md transition-colors duration-200
                  text-gray-600 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  hover:text-gray-900 dark:hover:text-white
                  ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium' : ''}`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <hr className="border-gray-200 dark:border-gray-700 my-4" />
        <ul>
          {/* Theme toggle */}
          <li className="mb-2">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              {isDark ? (
                <>
                  <SunIcon className="h-5 w-5 mr-3" />
                  <span>Light mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5 mr-3" />
                  <span>Dark mode</span>
                </>
              )}
            </button>
          </li>

          {/* Settings */}
          <li className="mb-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md transition-colors duration-200
                text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                hover:text-gray-900 dark:hover:text-white
                ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : ''}`
              }
            >
              <Cog6ToothIcon className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </NavLink>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 rounded-md text-red-400 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto bg-gray-100 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default Layout;