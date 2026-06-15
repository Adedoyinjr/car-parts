import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, Package, ShoppingCart, Warehouse,
  Truck, Users, BarChart3, LogOut, Menu, X, Bell,
  Search, ChevronRight, Shield
} from 'lucide-react';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/admin/suppliers', label: 'Suppliers', icon: Truck },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-[#F5F5F0] flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full bg-[#0a0a0a] border-r border-[#1a1a1a] transition-all duration-300 ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#1a1a1a]">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'lg:hidden'}`}>
            <Shield className="w-6 h-6 text-[#FF5A00]" />
            <span className="font-bold text-lg tracking-tight">TURBINE</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-[#1a1a1a] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#FF5A00]/10 text-[#FF5A00]'
                    : 'text-[#A1A09B] hover:bg-[#1a1a1a] hover:text-[#F5F5F0]'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm font-medium transition-opacity ${!sidebarOpen && 'lg:opacity-0 lg:hidden'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight className={`w-4 h-4 ml-auto flex-shrink-0 ${!sidebarOpen && 'lg:hidden'}`} />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#1a1a1a]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#A1A09B] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className={`text-sm font-medium ${!sidebarOpen && 'lg:hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a] px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-[#1a1a1a] rounded transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[#1a1a1a] rounded transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A09B]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-1.5 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50 w-64 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-[#A1A09B]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5A00] rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-[#1a1a1a]">
              <div className="w-8 h-8 rounded-full bg-[#FF5A00]/10 flex items-center justify-center">
                <span className="text-xs font-bold text-[#FF5A00]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-[#A1A09B] capitalize">{user?.role?.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
