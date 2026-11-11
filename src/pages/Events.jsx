import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  UserCheck,
  Check,
  CalendarCheck
} from 'lucide-react';

export const Events = () => {
  const { data, currentUser, createEvent, toggleEventDuty, assignEventDuty } = useClub();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dutyModalEventId, setDutyModalEventId] = useState(null);

  // New Event Form
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    venue: 'MITE Campus',
    banner_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
    schedule: [
      { time: '09:30 AM', activity: 'Inauguration & Keynote' },
      { time: '11:00 AM', activity: 'Hands-on Lab Session' }
    ]
  });

  // Assign duty form
  const [newDuty, setNewDuty] = useState({
    student_id: data.profiles?.find(p => p.role === 'student')?.id || '',
    area: 'Technical & Component Kits',
    duty_details: 'Verify and bundle hardware kits'
  });

  const canManage = currentUser && ['club_admin', 'coordinator'].includes(currentUser.role);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.event_date) return;

    createEvent(newEvent);
    setIsModalOpen(false);
    setNewEvent({
      title: '',
      description: '',
      event_date: '',
      venue: 'MITE Campus',
      banner_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
      schedule: []
    });
  };

  const handleAssignDutySubmit = (e) => {
    e.preventDefault();
    if (!dutyModalEventId || !newDuty.student_id) return;

    assignEventDuty(dutyModalEventId, newDuty.student_id, newDuty.area, newDuty.duty_details);
    setDutyModalEventId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
            <Calendar size={14} /> Club Programs
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Events, Workshops & Student Duties
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plan robotics hackathons, schedule guest bootcamps, and delegate event preparation responsibilities.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus size={15} /> Create Workshop / Event
          </button>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {data.events?.map(event => {
          const completedDuties = event.responsibilities?.filter(r => r.is_completed).length || 0;
          const totalDuties = event.responsibilities?.length || 0;

          return (
            <div
              key={event.id}
              className="tech-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-nexus-800"
            >
              {/* Event Image Banner (Left 4 cols) */}
              <div className="lg:col-span-4 relative h-48 lg:h-auto min-h-[200px] overflow-hidden bg-nexus-950">
                <img
                  src={event.banner_url || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-nexus-950/90 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold">
                  {event.status}
                </div>
              </div>

              {/* Event Details (Middle 5 cols) */}
              <div className="lg:col-span-5 p-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <Calendar size={13} /> {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {event.venue}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>
                </div>

                {/* Schedule Outline */}
                {event.schedule && event.schedule.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-nexus-850">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Schedule:</div>
                    <div className="space-y-1">
                      {event.schedule.map((slot, idx) => (
                        <div key={idx} className="text-xs flex items-center justify-between text-slate-300 bg-nexus-950/60 px-3 py-1 rounded-lg border border-nexus-850">
                          <span className="font-mono text-cyan-400 text-[11px]">{slot.time}</span>
                          <span>{slot.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Responsibilities Checklist (Right 3 cols) */}
              <div className="lg:col-span-3 p-6 bg-nexus-950/50 border-t lg:border-t-0 lg:border-l border-nexus-850 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-400" /> Prep Responsibilities
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {completedDuties}/{totalDuties} done
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {event.responsibilities?.length === 0 ? (
                      <div className="text-[11px] text-slate-500 italic py-2">No student duties assigned yet.</div>
                    ) : (
                      event.responsibilities?.map(duty => {
                        const student = data.profiles?.find(p => p.id === duty.student_id);

                        return (
                          <div
                            key={duty.id}
                            className={`p-2.5 rounded-xl border text-xs transition-all ${
                              duty.is_completed
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                                : 'bg-nexus-900 border-nexus-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-semibold text-cyan-300 block text-[11px]">{duty.area}</span>
                                <div className="text-[10px] text-slate-300 mt-0.5">{duty.duty_details}</div>
                                <div className="text-[10px] text-slate-400 mt-1">Lead: <strong>{student?.full_name}</strong></div>
                              </div>
                              <button
                                onClick={() => toggleEventDuty(event.id, duty.id)}
                                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                                  duty.is_completed
                                    ? 'bg-emerald-500 text-nexus-950 border-emerald-400'
                                    : 'border-nexus-700 bg-nexus-950 hover:border-slate-400'
                                }`}
                              >
                                {duty.is_completed && <Check size={12} className="stroke-[3]" />}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {canManage && (
                  <button
                    onClick={() => {
                      setDutyModalEventId(event.id);
                      setNewDuty({
                        student_id: data.profiles?.find(p => p.role === 'student')?.id || '',
                        area: 'Technical Kits',
                        duty_details: ''
                      });
                    }}
                    className="w-full py-2 rounded-xl bg-nexus-800 hover:bg-nexus-750 text-cyan-300 border border-nexus-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Plus size={13} /> Delegate Duty
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-nexus-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" /> Plan Event or Workshop
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MECHAHACK 2026 Hardware Hackathon"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newEvent.banner_url}
                  onChange={(e) => setNewEvent({ ...newEvent, banner_url: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Target audience, hardware kits provided, mentor sessions..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-nexus-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delegate Duty Modal */}
      {dutyModalEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck size={16} className="text-cyan-400" /> Delegate Event Responsibility
            </h3>

            <form onSubmit={handleAssignDutySubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Student</label>
                <select
                  value={newDuty.student_id}
                  onChange={(e) => setNewDuty({ ...newDuty, student_id: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {data.profiles?.filter(p => p.role === 'student' || p.role === 'team_leader').map(s => (
                    <option key={s.id} value={s.id}>{s.full_name} ({s.usn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Area / Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage AV & Livestream, Kit Bundling"
                  value={newDuty.area}
                  onChange={(e) => setNewDuty({ ...newDuty, area: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Duty Details / Instructions</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details of responsibility..."
                  value={newDuty.duty_details}
                  onChange={(e) => setNewDuty({ ...newDuty, duty_details: e.target.value })}
                  className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDutyModalEventId(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-nexus-950 font-bold"
                >
                  Assign Duty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
