import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      const from = (location.state as { from?: string } | null)?.from || '/';
      navigate(from);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/hero-car.jpg"
          alt="Performance Vehicle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#050505]/70" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#FF5A00]" />
            <span className="text-xl font-bold tracking-tight">TURBINE</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold tracking-[-0.02em] mb-4">
              ENGINEERED FOR<br />
              <span className="text-[#FF5A00]">PERFORMANCE.</span>
            </h2>
            <p className="text-sm text-[#A1A09B] max-w-sm">
              Join the elite community of automotive enthusiasts who demand nothing but the best for their machines.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 lg:px-8 bg-[#050505]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Shield className="w-8 h-8 text-[#FF5A00]" />
            <span className="text-xl font-bold tracking-tight">TURBINE</span>
          </div>

          <h1 className="text-3xl font-bold tracking-[-0.02em] mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-[#A1A09B] mb-8">
            {isLogin ? 'Sign in to access your account' : 'Register to start shopping'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50 transition-colors"
                />
              </div>
            )}


            <div>
              <label className="text-xs font-semibold text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A1A09B] uppercase tracking-[0.1em] mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 pr-12 text-sm text-[#F5F5F0] placeholder-[#A1A09B] focus:outline-none focus:border-[#FF5A00]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A09B] hover:text-[#F5F5F0] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#FF5A00] hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF5A00] text-[#050505] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#ff6b1a] transition-colors"
            >
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-[#A1A09B] hover:text-[#F5F5F0] transition-colors"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-[#FF5A00]">{isLogin ? 'Register' : 'Sign In'}</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
            <p className="text-[10px] text-[#A1A09B] text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
