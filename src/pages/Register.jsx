import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClub } from '../context/ClubContext';
import { Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const { register } = useClub();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    usn: '',
    department: 'Mechatronics Engineering',
    semester: 3,
    role: 'student',
    bio: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = register(formData);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/20">
            <Cpu size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Member Account</h1>
          <p className="text-xs text-slate-400">Join the MITE Mechatronics Club platform</p>
        </div>

        <div className="tech-card p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Karthik Bhat"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">College Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. karthik.bhat@mite.ac.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">USN *</label>
                <input
                  type="text"
                  required
                  placeholder="4MT24MT019"
                  value={formData.usn}
                  onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              Register & Enter Portal
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-nexus-800">
            Already registered?{' '}
            <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
