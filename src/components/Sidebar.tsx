import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, UserPlus, Search, Users, Database } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, onClose]);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/register', label: 'Register Patient', icon: <UserPlus size={20} /> },
    { to: '/query', label: 'Query Patients', icon: <Search size={20} /> },
    { to: '/patients', label: 'Patient List', icon: <Users size={20} /> },
  ];

  const activeClass = 'bg-primary-50 text-primary-600 border-l-4 border-primary-600';
  const inactiveClass = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-bold text-primary-800">Patients Management</span>
          <button
            type="button"
            className="rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-secondary-600" />
            <span className="ml-2 text-sm font-medium text-secondary-700">
              Using Pglite DB
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold text-primary-800">Patients Management</span>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                        isActive ? activeClass : inactiveClass
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-secondary-600" />
                <span className="ml-2 text-sm font-medium text-secondary-700">
                  Using Pglite DB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
