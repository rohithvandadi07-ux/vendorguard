import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, History, LogOut } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scan Vendor', path: '/scan', icon: Search },
    { name: 'Scan History', path: '/history', icon: History },
  ];

  return (
    <div className="min-h-screen flex bg-cyber-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-cyber-800 bg-cyber-900/50 backdrop-blur flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-cyber-800">
          <Shield className="w-8 h-8 text-cyber-500 mr-3" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-400 to-indigo-600">
            VendorGuard
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-cyber-500/10 text-cyber-400 border border-cyber-500/20'
                    : 'text-gray-400 hover:bg-cyber-800/50 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-cyber-800">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-cyber-800 flex items-center px-4 bg-cyber-900/50 backdrop-blur">
          <Shield className="w-6 h-6 text-cyber-500 mr-3" />
          <span className="text-lg font-bold text-gray-100">VendorGuard</span>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
