import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { Cpu, ShieldCheck, UserCheck, Users, GraduationCap, Lock, Mail, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, data, setCurrentUser } = useClub();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickPersona = (role) => {
    const user = data.profiles?.find(p => p.role === role);
    if (user) {
      setCurrentUser(user);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Cpu size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">MECHANEXUS</h1>
          <p className="text-xs text-slate-400">Sign in to access the Mechatronics Club platform</p>
        </div>

        {/* Quick Demo Selector */}
        <div className="tech-card p-4 space-y-2.5 border-cyan-500/30">
          <div className="text-[11px] font-mono uppercase text-cyan-400 font-semibold text-center">
            ⚡ Quick Demo Sign-in (Instant Access)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickPersona('club_admin')}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-2 text-left"
            >
              <ShieldCheck size={14} className="shrink-0" />
              <div className="truncate">
                <div>Prof. Admin</div>
                <div className="text-[10px] text-slate-400 font-normal">Club Admin</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickPersona('coordinator')}
              className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-2 text-left"
            >
              <UserCheck size={14} className="shrink-0" />
              <div className="truncate">
                <div>Ananya Rao</div>
                <div className="text-[10px] text-slate-400 font-normal">Coordinator</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickPersona('team_leader')}
              className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-2 text-left"
            >
              <Users size={14} className="shrink-0" />
              <div className="truncate">
                <div>Rahul Sharma</div>
                <div className="text-[10px] text-slate-400 font-normal">Team Lead</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickPersona('student')}
              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2 text-left"
            >
              <GraduationCap size={14} className="shrink-0" />
              <div className="truncate">
                <div>Preethi Nayak</div>
                <div className="text-[10px] text-slate-400 font-normal">Student Member</div>
              </div>
            </button>
          </div>
        </div>

        {/* Regular Sign in form */}
        <div className="tech-card p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">College Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. ananya.rao@mite.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              Sign In to Portal
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-nexus-800">
            Don't have an account yet?{' '}
            <Link to="/join" className="text-cyan-400 font-semibold hover:underline">
              Apply to Join MECHANEXUS
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
