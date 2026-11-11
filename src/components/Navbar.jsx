import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { 
  Cpu, 
  Menu, 
  X, 
  LogOut, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Users, 
  FileText,
  RotateCcw
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout, resetAllDataToSeed } = useClub();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'club_admin':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold px-2 py-0.5 rounded-full">Club Admin</span>;
      case 'coordinator':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold px-2 py-0.5 rounded-full">Coordinator</span>;
      case 'team_leader':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold px-2 py-0.5 rounded-full">Team Leader</span>;
      case 'student':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold px-2 py-0.5 rounded-full">Student Member</span>;
      default:
        return null;
    }
  };

  const navLinks = [
    { name: 'Community Feed', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'Join Club', path: '/join' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-nexus-950/85 backdrop-blur-md border-b border-nexus-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300 border border-cyan-400/30">
              <Cpu className="w-5 h-5 transition-transform group-hover:rotate-45 duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-400">
                  MECHANEXUS
                </span>
                <span className="text-[10px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded font-mono font-medium">
                  MITE
                </span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-tight font-medium">
                Mechatronics Club Platform
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-nexus-900/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {currentUser && (
              <Link
                to="/dashboard"
                className={`ml-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/tasks') || location.pathname.startsWith('/projects') || location.pathname.startsWith('/teams')
                    ? 'bg-cyan-500 text-nexus-950 font-bold shadow-lg shadow-cyan-500/25'
                    : 'bg-nexus-850 hover:bg-nexus-800 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                <Sparkles size={15} /> Club Portal
              </Link>
            )}
          </nav>

          {/* Right Action Icons / User Info */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-nexus-900 border border-nexus-800/80 hover:border-nexus-700 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.full_name)}`}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <div className="hidden sm:block text-xs">
                    <div className="font-semibold text-slate-100 truncate max-w-[120px]">{currentUser.full_name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{currentUser.role?.replace('_', ' ')}</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-nexus-900/95 border border-nexus-700/80 shadow-2xl p-2 z-50 backdrop-blur-xl animate-fade-in">
                    <div className="px-3 py-2 border-b border-nexus-800">
                      <div className="font-semibold text-white text-sm">{currentUser.full_name}</div>
                      <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                      <div className="mt-1.5 flex items-center gap-2">
                        {getRoleBadge(currentUser.role)}
                        {currentUser.usn && (
                          <span className="text-[10px] text-slate-400 font-mono">{currentUser.usn}</span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-nexus-800 rounded-lg transition-colors"
                      >
                        <Radio size={14} className="text-cyan-400" /> Club Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-nexus-800 rounded-lg transition-colors"
                      >
                        <User size={14} className="text-blue-400" /> My Profile & Skills
                      </Link>
                      {currentUser.role === 'club_admin' && (
                        <Link
                          to="/admin/memberships"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-nexus-800 rounded-lg transition-colors"
                        >
                          <ShieldCheck size={14} className="text-rose-400" /> Review Applications
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-nexus-800">
                      <button
                        onClick={resetAllDataToSeed}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-400 hover:text-amber-300 hover:bg-nexus-800/60 rounded-lg transition-colors text-left"
                      >
                        <RotateCcw size={13} /> Reset Demo Data
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-nexus-850 transition-all border border-nexus-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/join"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-nexus-950 transition-all shadow-md shadow-cyan-500/20"
                >
                  Join Club
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-nexus-900 border border-nexus-800"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-nexus-800 bg-nexus-950 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-nexus-900 hover:text-cyan-400"
            >
              {link.name}
            </Link>
          ))}
          {currentUser && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30"
            >
              Open Club Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
