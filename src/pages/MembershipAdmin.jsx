import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

export const MembershipAdmin = () => {
  const { data, currentUser, reviewMembershipApplication } = useClub();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesModal, setNotesModal] = useState({ isOpen: false, appId: null, action: null, name: '' });
  const [adminNote, setAdminNote] = useState('');

  // Counts
  const pendingCount = data.membershipApplications?.filter(a => a.status === 'pending').length || 0;
  const approvedCount = data.membershipApplications?.filter(a => a.status === 'approved').length || 0;
  const rejectedCount = data.membershipApplications?.filter(a => a.status === 'rejected').length || 0;

  const filteredApps = data.membershipApplications?.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.full_name?.toLowerCase().includes(q);
      const matchUSN = app.usn?.toLowerCase().includes(q);
      const matchDept = app.department?.toLowerCase().includes(q);
      if (!matchName && !matchUSN && !matchDept) return false;
    }
    return true;
  }) || [];

  const handleAction = (appId, action, name) => {
    setNotesModal({
      isOpen: true,
      appId,
      action,
      name
    });
    setAdminNote(action === 'approved' ? 'Approved for membership.' : 'Application does not meet current prerequisites.');
  };

  const handleConfirmAction = () => {
    reviewMembershipApplication(notesModal.appId, notesModal.action, adminNote);
    setNotesModal({ isOpen: false, appId: null, action: null, name: '' });
    setAdminNote('');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
            <ShieldCheck size={14} /> Club Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Membership Application Review
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate candidate applications from the public portal, approve new members, and issue club accounts.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1.5">
            <Clock size={13} /> {pendingCount} Pending
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={13} /> {approvedCount} Approved
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidate by name, USN, dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-nexus-900 border border-nexus-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'pending', label: `Pending Review (${pendingCount})` },
            { id: 'approved', label: `Approved (${approvedCount})` },
            { id: 'rejected', label: `Rejected (${rejectedCount})` },
            { id: 'all', label: `All Applications (${data.membershipApplications?.length || 0})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                statusFilter === tab.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-sm'
                  : 'bg-nexus-900/60 hover:bg-nexus-850 text-slate-400 border-nexus-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="tech-card py-16 text-center text-slate-500 space-y-2">
            <UserCheck size={36} className="mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No membership applications found in this state.</p>
          </div>
        ) : (
          filteredApps.map(app => (
            <div
              key={app.id}
              className="tech-card p-6 flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-bold text-white">{app.full_name}</h3>
                  <span className="font-mono text-xs text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/60">
                    {app.usn}
                  </span>
                  <span className="text-xs text-slate-400">
                    {app.department} • Semester {app.semester}
                  </span>
                  <span className="text-xs text-slate-500">
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 font-mono text-[11px] uppercase block mb-0.5">Email:</span>
                  <span className="font-mono text-slate-200">{app.email}</span>
                </div>

                {/* Technical Interests */}
                {app.technical_interests && app.technical_interests.length > 0 && (
                  <div>
                    <span className="text-[11px] uppercase font-mono text-slate-400 block mb-1">
                      Technical Interests:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.technical_interests.map((interest, idx) => (
                        <span key={idx} className="text-[10px] bg-nexus-950 px-2 py-0.5 rounded text-cyan-300 border border-nexus-800">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills statement */}
                <div>
                  <span className="text-[11px] uppercase font-mono text-slate-400 block mb-0.5">
                    Experience Statement:
                  </span>
                  <p className="text-xs text-slate-300 bg-nexus-950/70 p-3 rounded-xl border border-nexus-850 leading-relaxed">
                    {app.skills_description}
                  </p>
                </div>

                {app.admin_notes && (
                  <div className="text-[11px] text-slate-400 bg-nexus-950 p-2.5 rounded-lg border border-nexus-800">
                    <strong>Admin Note:</strong> {app.admin_notes}
                  </div>
                )}
              </div>

              {/* Action Buttons Column */}
              <div className="flex md:flex-col items-center gap-2 shrink-0 self-end md:self-start">
                {app.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(app.id, 'approved', app.full_name)}
                      className="w-full px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-nexus-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(app.id, 'rejected', app.full_name)}
                      className="w-full px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center justify-center gap-1.5"
                    >
                      <X size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    app.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {app.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Decision & Feedback Modal */}
      {notesModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className={notesModal.action === 'approved' ? 'text-emerald-400' : 'text-rose-400'} />
              {notesModal.action === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
            </h3>

            <p className="text-slate-300">
              {notesModal.action === 'approved'
                ? `Approve ${notesModal.name}? This will promote the candidate and create their student club account.`
                : `Are you sure you want to reject ${notesModal.name}'s application?`
              }
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Feedback / Notes</label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-nexus-800">
              <button
                type="button"
                onClick={() => setNotesModal({ isOpen: false, appId: null, action: null, name: '' })}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 rounded-xl font-bold ${
                  notesModal.action === 'approved'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-nexus-950'
                    : 'bg-rose-500 hover:bg-rose-400 text-white'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
