import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Clock, 
  XCircle, 
  Cpu, 
  Award,
  HelpCircle
} from 'lucide-react';

export const JoinClub = () => {
  const { data, submitMembershipApplication } = useClub();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    usn: '',
    department: 'Mechatronics Engineering',
    semester: 3,
    technical_interests: [],
    skills_description: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Status lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const interestOptions = [
    'Autonomous Mobile Robotics & ROS 2',
    'Embedded Systems & Microcontrollers (STM32/ESP32)',
    'IoT, Telemetry & Sensor Interfacing',
    'Computer Vision & Edge AI (YOLO/OpenCV)',
    'CAD Modeling, Simulation & 3D Printing (SolidWorks/Fusion)',
    'Aerial Robotics & UAV Payloads',
    'Industrial PLC Automation & SCADA',
    'PCB Design & Power Electronics (KiCad)'
  ];

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const exists = prev.technical_interests.includes(interest);
      if (exists) {
        return { ...prev, technical_interests: prev.technical_interests.filter(i => i !== interest) };
      } else {
        return { ...prev, technical_interests: [...prev.technical_interests, interest] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.usn.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, and USN).');
      return;
    }

    if (formData.technical_interests.length === 0) {
      setErrorMessage('Please select at least one technical domain of interest.');
      return;
    }

    const res = submitMembershipApplication(formData);
    if (res.success) {
      setFormSubmitted(true);
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    } else {
      setErrorMessage(res.message || 'Failed to submit application.');
    }
  };

  const handleLookup = (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    const q = lookupQuery.trim().toLowerCase();
    const found = data.membershipApplications?.find(
      a => a.email.toLowerCase() === q || a.usn.toLowerCase() === q
    );

    setLookupResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" /> MITE Mechatronics Club Recruitment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Become a Member of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            MECHANEXUS
          </span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Join our multidisciplinary student engineering teams building autonomous rovers, drones, and industrial automation prototypes. Work with senior mentors, access lab kits, and compete nationwide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Application Form (Left 2 cols) */}
        <div className="lg:col-span-2">
          <div className="tech-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-nexus-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu size={20} className="text-cyan-400" /> Membership Application Form
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All MITE engineering students with an interest in robotics, automation, and mechatronics are encouraged to apply.
              </p>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Application Received!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong>{formData.full_name}</strong>. Your membership application for MECHANEXUS has been recorded with status <span className="text-amber-400 font-semibold">Pending Review</span>.
                </p>
                <div className="text-xs text-slate-400 bg-nexus-950 p-4 rounded-xl border border-nexus-800 max-w-md mx-auto">
                  Club Admins and Coordinators will review your application. You can monitor your application status anytime using your USN (<strong>{formData.usn}</strong>) in the tracker on this page.
                </div>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      full_name: '',
                      email: '',
                      usn: '',
                      department: 'Mechatronics Engineering',
                      semester: 3,
                      technical_interests: [],
                      skills_description: ''
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-nexus-800 hover:bg-nexus-750 text-slate-200 text-xs font-semibold"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditya Shenoy"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">College Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aditya.shenoy@mite.ac.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">University Seat No (USN) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4MT24MT028"
                      value={formData.usn}
                      onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                      className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                      <option value="Information Science">Information Science</option>
                      <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Current Semester *</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Technical Interests & Domains * <span className="text-slate-400 font-normal">(Select all that match your enthusiasm)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {interestOptions.map(opt => {
                      const isChecked = formData.technical_interests.includes(opt);
                      return (
                        <div
                          key={opt}
                          onClick={() => handleInterestToggle(opt)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 ${
                            isChecked
                              ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                              : 'bg-nexus-950/50 border-nexus-800/80 text-slate-400 hover:border-nexus-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded bg-nexus-950 border-nexus-800 text-cyan-500 focus:ring-0"
                          />
                          <span className="leading-snug select-none">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Skills & Prior Experience / What excites you about Mechatronics? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about any hardware kits, coding projects, CAD models, school science competitions, or why you want to join MECHANEXUS..."
                    value={formData.skills_description}
                    onChange={(e) => setFormData({ ...formData, skills_description: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-nexus-950 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <Send size={16} /> Submit Membership Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar / Status Lookup Tracker (Right col) */}
        <div className="space-y-6">
          
          {/* Status Tracker Card */}
          <div className="tech-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search size={16} className="text-cyan-400" /> Check Application Status
            </h3>
            <p className="text-xs text-slate-400">
              Already submitted? Enter your USN or college email below to track your approval status.
            </p>

            <form onSubmit={handleLookup} className="space-y-3">
              <input
                type="text"
                placeholder="USN or College Email"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-nexus-800 hover:bg-nexus-750 text-cyan-300 font-semibold text-xs border border-nexus-700 transition-colors flex items-center justify-center gap-2"
              >
                <Search size={14} /> Track Status
              </button>
            </form>

            {hasSearched && (
              <div className="pt-3 border-t border-nexus-800 text-xs">
                {lookupResult ? (
                  <div className="p-3 rounded-xl bg-nexus-950 border border-nexus-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{lookupResult.full_name}</span>
                      {lookupResult.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                      {lookupResult.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> Approved
                        </span>
                      )}
                      {lookupResult.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1">
                          <XCircle size={10} /> Rejected
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{lookupResult.usn} • Sem {lookupResult.semester}</div>
                    {lookupResult.status === 'approved' && (
                      <p className="text-[11px] text-emerald-300">
                        🎉 Welcome! Your membership is active. Sign in with your email to access the Club Portal.
                      </p>
                    )}
                    {lookupResult.admin_notes && (
                      <div className="text-[10px] text-slate-400 bg-nexus-900 p-2 rounded border border-nexus-850">
                        <strong>Note:</strong> {lookupResult.admin_notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-3 text-slate-400">
                    No application found matching "{lookupQuery}". Check spelling or submit an application.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Club Perks */}
          <div className="tech-card p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-amber-400" /> Member Benefits
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Access to Mechatronics lab sensors, microcontrollers, and 3D printing equipment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Work on national competitions (TechFest, Smart India Hackathon, E-Yantra).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Peer mentorship from senior coordinators and faculty advisors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Official participation certificates and club merchandise.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
