import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { useClub } from '../context/ClubContext';

export const Layout = () => {
  const location = useLocation();
  const { currentUser } = useClub();

  // Determine if this is an authenticated workspace view
  const isDashboardRoute = [
    '/dashboard',
    '/tasks',
    '/projects',
    '/teams',
    '/events',
    '/logs',
    '/profile',
    '/admin'
  ].some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col bg-nexus-950 text-slate-100">
      <Navbar />

      {/* Floating / Top Demo Bar for seamless persona testing */}
      <div className="bg-nexus-950/90 border-b border-nexus-850 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <DemoRoleSwitcher />
        </div>
      </div>

      {isDashboardRoute ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-y-auto">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="flex-1">
          <Outlet />
        </main>
      )}

      {/* Modern Footer */}
      <footer className="border-t border-nexus-900 bg-nexus-950/80 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-slate-200">MECHANEXUS</span>
            <span>— Mechatronics Club of MITE</span>
          </div>
          <div className="text-slate-400">
            Engineered with React, Tailwind CSS & Supabase • Autonomous Operations
          </div>
        </div>
      </footer>
    </div>
  );
};
