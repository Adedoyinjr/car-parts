import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import {
  Search, User, ShoppingCart, Shield, Menu, X,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/shop', label: 'SHOP' },
    { path: '/shop?category=engine-parts', label: 'CATALOGUE' },
    { path: '/shop?featured=true', label: 'ABOUT' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? 'bg-[#050505]/90 backdrop-blur-md border-b border-[#1a1a1a]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-[#FF5A00]" />
              <div>
                <span className="text-lg font-bold tracking-tight leading-none">TURBINE</span>
                <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-[#A1A09B] leading-none">Quality Parts. Every Mile.</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold tracking-[0.05em] transition-colors hover:text-[#FF5A00] ${
                    location.pathname === link.path ? 'text-[#FF5A00]' : 'text-[#F5F5F0]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl overflow-hidden z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-[#2a2a2a]">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-[#A1A09B]">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => { logout(); setAccountOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { navigate('/login'); setAccountOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#A1A09B] hover:bg-[#2a2a2a] hover:text-[#F5F5F0] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Login
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 hover:bg-[#1a1a1a] rounded transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#FF5A00] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 hover:bg-[#1a1a1a] rounded transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-md px-4 lg:px-8 py-3">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A09B]" />
              <input
                type="text"
                placeholder="Search by part name, SKU, or vehicle..."
                autoFocus
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50 transition-colors"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#0a0a0a] border-l border-[#1a1a1a] p-6 pt-20">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-semibold tracking-[0.05em] py-2 transition-colors ${
                    location.pathname === link.path ? 'text-[#FF5A00]' : 'text-[#F5F5F0]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
