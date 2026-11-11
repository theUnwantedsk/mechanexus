import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Search,
  Filter,
  Calendar,
  Send
} from 'lucide-react';

export const StudentTasks = () => {
  const { data, currentUser, updateTaskRecordStatus } = useClub();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');

  // Find all task records assigned to the current user across all tasks
  const myAssignedRecords = [];
  data.tasks?.forEach(task => {
    task.records?.forEach(record => {
      if (record.assigned_to === currentUser?.id) {
        myAssignedRecords.push({
          ...record,
          taskTitle: task.title,
          taskDeadline: task.deadline,
          taskId: task.id
        });
      }
    });
  });

  // Calculate metrics
  const totalCount = myAssignedRecords.length;
  const completedCount = myAssignedRecords.filter(r => r.status === 'Completed').length;
  const inProgressCount = myAssignedRecords.filter(r => r.status === 'In Progress').length;
  const needsHelpCount = myAssignedRecords.filter(r => r.status === 'Needs Assistance' || r.status === 'Unable to Contact').length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter records
  const filteredRecords = myAssignedRecords.filter(record => {
    if (statusFilter !== 'all' && record.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = record.name?.toLowerCase().includes(q);
      const matchOrg = record.role_or_work?.toLowerCase().includes(q);
      const matchTask = record.taskTitle?.toLowerCase().includes(q);
      if (!matchName && !matchOrg && !matchTask) return false;
    }
    return true;
  });

  const statusOptions = [
    { label: 'Not Started', value: 'Not Started', color: 'text-slate-400 bg-nexus-950 border-nexus-800' },
    { label: 'In Progress', value: 'In Progress', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' },
    { label: 'Completed', value: 'Completed', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
    { label: 'Unable to Contact', value: 'Unable to Contact', color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    { label: 'Needs Assistance', value: 'Needs Assistance', color: 'text-rose-400 bg-rose-950/60 border-rose-800' },
  ];

  const handleStatusChange = (record, newStatus) => {
    updateTaskRecordStatus(record.taskId, record.id, newStatus, record.student_notes);
  };

  const handleSaveNotes = (record) => {
    updateTaskRecordStatus(record.taskId, record.id, record.status, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
            <CheckSquare size={14} /> Student Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Assigned Tasks & Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal contact outreach, follow-ups, and individual task items.
          </p>
        </div>

        {/* User Info Capsule */}
        <div className="flex items-center gap-3 bg-nexus-900 border border-nexus-800 px-4 py-2 rounded-xl text-xs">
          <img
            src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser?.full_name || 'S')}`}
            alt={currentUser?.full_name}
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
          />
          <div>
            <div className="font-semibold text-white">{currentUser?.full_name}</div>
            <div className="text-[10px] text-cyan-400 font-mono">{currentUser?.usn || 'STUDENT'}</div>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="tech-card p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Allocated</div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalCount}</div>
          <div className="text-[10px] text-slate-500">Distributed records</div>
        </div>

        <div className="tech-card p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Completed</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{completedCount}</div>
          <div className="text-[10px] text-emerald-500/80">{completionPercentage}% completion rate</div>
        </div>

        <div className="tech-card p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">In Progress</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{inProgressCount}</div>
          <div className="text-[10px] text-cyan-500/80">Pending follow-ups</div>
        </div>

        <div className="tech-card p-4 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Needs Help</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{needsHelpCount}</div>
          <div className="text-[10px] text-amber-500/80">Flagged for coordinator</div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search my records or tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-nexus-900 border border-nexus-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'Not Started', 'In Progress', 'Completed', 'Unable to Contact', 'Needs Assistance'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                statusFilter === status
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60'
                  : 'bg-nexus-900/60 hover:bg-nexus-850 text-slate-400 border-nexus-800'
              }`}
            >
              {status === 'all' ? 'All My Items' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Records Cards / Table */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="tech-card py-16 text-center text-slate-500 space-y-3">
            <CheckSquare size={36} className="mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">No records assigned matching your filter.</p>
            <p className="text-xs text-slate-500">Coordinators will assign work items to your profile as new tasks are created.</p>
          </div>
        ) : (
          filteredRecords.map(record => (
            <div
              key={record.id}
              className="tech-card p-5 space-y-4 border-l-4 border-l-cyan-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-2">
                    <span>Task: <strong>{record.taskTitle}</strong></span>
                    {record.taskDeadline && (
                      <span className="text-slate-400 flex items-center gap-1">
                        • <Calendar size={11} /> Due {new Date(record.taskDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{record.name}</h3>
                  <div className="text-xs text-slate-300">{record.role_or_work}</div>
                </div>

                {/* Status Selector Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={record.status}
                    onChange={(e) => handleStatusChange(record, e.target.value)}
                    className="bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Information & Coordinator Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-nexus-950/80 p-3.5 rounded-xl border border-nexus-800/80">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={14} className="text-cyan-400 shrink-0" />
                  <span className="font-mono">{record.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <Mail size={14} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{record.email || 'No email provided'}</span>
                </div>
                <div className="text-slate-400 sm:col-span-2 lg:col-span-1">
                  <strong>Notes:</strong> {record.notes || 'None'}
                </div>
              </div>

              {/* Student Personal Follow-up Notes Log */}
              <div className="pt-2 text-xs">
                {editingNotesId === record.id ? (
                  <div className="space-y-2 animate-fade-in">
                    <label className="block text-slate-300 font-semibold">
                      Your Progress Log / Notes:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Spoke with them; sent club proposal; follow-up scheduled for Friday..."
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(record)}
                        className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3 bg-nexus-950/40 p-3 rounded-xl border border-nexus-850">
                    <div>
                      <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider block mb-0.5">
                        My Progress Log:
                      </span>
                      <p className="text-slate-300 italic">
                        {record.student_notes || 'No log entered yet. Click "Update Log" to document your response.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNotesId(record.id);
                        setTempNotes(record.student_notes || '');
                      }}
                      className="px-3 py-1 rounded-lg bg-nexus-800 hover:bg-nexus-750 text-cyan-300 text-[11px] font-semibold border border-nexus-700 shrink-0"
                    >
                      Update Log
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
