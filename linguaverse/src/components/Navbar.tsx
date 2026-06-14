import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, BookMarked, BarChart3, Users, Trophy, LogIn, LogOut, Menu, X } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';

const navLinks = [
  { to: '/', label: '首页', icon: Home },
  { to: '/courses', label: '课程', icon: BookMarked },
  { to: '/progress', label: '进度', icon: BarChart3 },
  { to: '/community', label: '社区', icon: Users },
  { to: '/achievements', label: '成就', icon: Trophy },
];

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-display text-xl font-bold text-charcoal">
              Lingua<span className="text-emerald-600">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-charcoal/70 hover:bg-emerald-600/10 hover:text-emerald-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-charcoal">{user.username}</span>
                    <span className="ml-1.5 px-2 py-0.5 bg-gold-400/20 text-gold-500 rounded-full text-xs font-semibold">
                      Lv.{user.level}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-charcoal/50 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-capsule bg-emerald-600 text-white px-5 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-emerald-700"
              >
                <LogIn className="w-4 h-4" />
                登录
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-charcoal hover:bg-emerald-600/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : 'text-charcoal/70 hover:bg-emerald-600/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t border-charcoal/10">
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-charcoal">{user.username}</span>
                    </div>
                    <button onClick={logout} className="text-red-500 text-sm">
                      退出
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center btn-capsule bg-emerald-600 text-white px-5 py-2 text-sm font-medium mx-4"
                  >
                    登录
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
