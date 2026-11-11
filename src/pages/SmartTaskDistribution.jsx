import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { parseSpreadsheet, parseImageWithOCR } from '../utils/fileParser';
import { 
  Workflow, 
  Upload, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Edit3, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Sliders, 
  UserCheck,
  ChevronDown,
  BarChart3,
  Calendar
} from 'lucide-react';

export const SmartTaskDistribution = () => {
  const { 
    data, 
    currentUser, 
    calculateStudentWorkloads, 
    createTaskWithDistribution,
    reassignTaskRecord
  } = useClub();

  // Wizard steps: 'create' | 'monitoring'
  const [activeTab, setActiveTab] = useState('create');
  
  // Step in task creation wizard: 1: Info & Students -> 2: Upload & Parse -> 3: Verify & Distribute
  const [step, setStep] = useState(1);

  // Form state
  const [taskInfo, setTaskInfo] = useState({
    title: '',
    description: '',
    deadline: '',
    source_filename: ''
  });

  // Selected student IDs for distribution
  const allStudents = data.profiles?.filter(p => p.role === 'student' || p.role === 'team_leader') || [];
  const [selectedStudentIds, setSelectedStudentIds] = useState(allStudents.map(s => s.id));

  // Parsed records for verification
  const [extractedRecords, setExtractedRecords] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState({ percent: 0, message: '' });
  const [parseError, setParseError] = useState('');

  // Selected task in monitoring view
  const [selectedTaskId, setSelectedTaskId] = useState(data.tasks?.[0]?.id || null);
  const [reassignModal, setReassignModal] = useState({ isOpen: false, taskId: null, recordId: null, currentAssigned: null });

  // Student workloads
  const workloads = calculateStudentWorkloads();

  // Handle student toggle
  const toggleStudentSelection = (id) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  // Sample Demo Datasets (Pre-configured for instant testing)
  const loadSampleAlumniDataset = () => {
    const sample = [
      { id: 's-1', name: 'Dr. Praveen Kumar', phone: '+91 98451 10001', email: 'praveen.k@isro.gov.in', role_or_work: 'Scientist SF, ISRO', notes: 'Alumnus 2014, Satellite telemetry' },
      { id: 's-2', name: 'Nayana Shenoy', phone: '+91 97410 20002', email: 'nayana.s@boeing.com', role_or_work: 'Avionics Lead, Boeing', notes: 'Alumna 2016, Flight control laws' },
      { id: 's-3', name: 'Adarsh Kamath', phone: '+91 94800 30003', email: 'adarsh.k@tesla.com', role_or_work: 'Autopilot Hardware, Tesla', notes: 'Alumnus 2018, Sensor calibration' },
      { id: 's-4', name: 'Rashmi Poojary', phone: '+91 99011 40004', email: 'rashmi.p@kuka.com', role_or_work: 'Robotics Engineer, KUKA', notes: 'Alumna 2019, Heavy payload arms' },
      { id: 's-5', name: 'Mahesh Shetty', phone: '+91 98862 50005', email: 'mahesh.s@honeywell.com', role_or_work: 'Systems Architect, Honeywell', notes: 'Alumnus 2015, Drone autonomy' },
      { id: 's-6', name: 'Sowmya Rao', phone: '+91 94483 60006', email: 'sowmya.r@ti.com', role_or_work: 'PMIC Design, Texas Instruments', notes: 'Alumna 2017, Motor driver ICs' },
      { id: 's-7', name: 'Gautham Bhat', phone: '+91 91484 70007', email: 'gautham.b@ather.com', role_or_work: 'BMS Engineer, Ather Energy', notes: 'Alumnus 2020, Li-Ion packs' },
      { id: 's-8', name: 'Ankitha Rai', phone: '+91 96115 80008', email: 'ankitha.r@volvo.com', role_or_work: 'Chassis Simulation, Volvo', notes: 'Alumna 2018, Suspension FEA' },
      { id: 's-9', name: 'Vinay Nayak', phone: '+91 94496 90009', email: 'vinay.n@bosch.com', role_or_work: 'ECU Firmware, Bosch', notes: 'Alumnus 2016, CAN bus' },
      { id: 's-10', name: 'Kavya Kudva', phone: '+91 99457 01010', email: 'kavya.k@schneider.com', role_or_work: 'SCADA Engineer, Schneider', notes: 'Alumna 2019, Modbus PLC' },
      { id: 's-11', name: 'Abhishek Pai', phone: '+91 98808 12011', email: 'abhishek.p@intel.com', role_or_work: 'FPGA Engineer, Intel', notes: 'Alumnus 2017, Verilog HDL' },
      { id: 's-12', name: 'Deepa Hegde', phone: '+91 97409 23012', email: 'deepa.h@siemens.com', role_or_work: 'Digital Factory, Siemens', notes: 'Alumna 2020, Industry 4.0' }
    ];

    setExtractedRecords(sample);
    setTaskInfo(prev => ({
      ...prev,
      title: prev.title || 'Alumni Tech Talk & Sponsorship Drive 2026',
      description: prev.description || 'Contact mechatronics alumni for guest lectures, workshop sponsorship, and rover component donations.',
      source_filename: 'Alumni_Directory_Preset_2026.xlsx'
    }));
    setStep(3);
  };

  // File Upload Handlers
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError('');
    setIsParsing(true);
    setTaskInfo(prev => ({ ...prev, source_filename: file.name }));

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (['xlsx', 'xls', 'csv'].includes(extension)) {
        setParsingProgress({ percent: 50, message: 'Parsing spreadsheet tables and columns...' });
        const records = await parseSpreadsheet(file);
        if (records.length === 0) {
          throw new Error('No valid records found in spreadsheet.');
        }
        setExtractedRecords(records);
        setStep(3);
      } else if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
        setParsingProgress({ percent: 10, message: 'Initializing Tesseract.js OCR engine...' });
        const records = await parseImageWithOCR(file, (percent, msg) => {
          setParsingProgress({ percent, message: msg });
        });
        if (records.length === 0) {
          throw new Error('OCR could not detect tabular records in this image. Try an Excel file or load demo dataset.');
        }
        setExtractedRecords(records);
        setStep(3);
      } else {
        throw new Error('Unsupported file format. Please upload an Excel (.xlsx, .csv) or image (.png, .jpg) file.');
      }
    } catch (err) {
      setParseError(err.message || 'File parsing failed.');
    } finally {
      setIsParsing(false);
    }
  };

  // Edit / Delete in Verification Table
  const handleRecordChange = (index, field, value) => {
    setExtractedRecords(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteRecord = (index) => {
    setExtractedRecords(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddManualRecord = () => {
    setExtractedRecords(prev => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        name: 'New Contact / Work Item',
        phone: '',
        email: '',
        role_or_work: 'Item',
        notes: '',
        status: 'Not Started',
        student_notes: ''
      }
    ]);
  };

  // Launch Distribution
  const handleLaunchDistribution = () => {
    if (!taskInfo.title.trim()) {
      alert('Please provide a task title.');
      return;
    }
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student for task assignment.');
      return;
    }
    if (extractedRecords.length === 0) {
      alert('No records available to distribute.');
      return;
    }

    const newTask = createTaskWithDistribution(taskInfo, extractedRecords, selectedStudentIds);
    setSelectedTaskId(newTask.id);
    setActiveTab('monitoring');
    setStep(1);
    setTaskInfo({ title: '', description: '', deadline: '', source_filename: '' });
    setExtractedRecords([]);
  };

  // Calculate projected distribution
  const projectedPerStudent = selectedStudentIds.length > 0 
    ? Math.floor(extractedRecords.length / selectedStudentIds.length) 
    : 0;
  const projectedRemainder = selectedStudentIds.length > 0 
    ? extractedRecords.length % selectedStudentIds.length 
    : 0;

  const currentMonitoredTask = data.tasks?.find(t => t.id === selectedTaskId) || data.tasks?.[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Module Title & Tab Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-nexus-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" /> Flagship Module
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            Smart Task Distribution Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated file parsing, OCR contact extraction, and fair workload-balanced allocation.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-nexus-900 border border-nexus-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-cyan-500 text-nexus-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus size={14} /> New Task Wizard
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'monitoring'
                ? 'bg-cyan-500 text-nexus-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={14} /> Monitoring Command Center ({data.tasks?.length || 0})
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: NEW TASK WIZARD */}
      {/* ==================================================================== */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          
          {/* Stepper Header */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs">
            <div 
              onClick={() => setStep(1)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                step === 1 
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold' 
                  : 'bg-nexus-900/60 border-nexus-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Step 1</div>
              <div className="truncate">Task Info & Student Pool</div>
            </div>

            <div 
              onClick={() => step >= 2 && setStep(2)}
              className={`p-3 rounded-xl border transition-all ${
                step === 2 
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold' 
                  : step > 2 
                    ? 'bg-nexus-900/80 border-cyan-900/60 text-slate-300 cursor-pointer' 
                    : 'bg-nexus-950/40 border-nexus-850 text-slate-600 cursor-not-allowed'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Step 2</div>
              <div className="truncate">Upload File & OCR Parsing</div>
            </div>

            <div 
              className={`p-3 rounded-xl border transition-all ${
                step === 3 
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold' 
                  : 'bg-nexus-950/40 border-nexus-850 text-slate-600 cursor-not-allowed'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Step 3</div>
              <div className="truncate">Verification & Fair Balancing</div>
            </div>
          </div>

          {/* STEP 1: Task Information & Student Pool Selection */}
          {step === 1 && (
            <div className="tech-card p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-nexus-800 pb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Workflow size={18} className="text-cyan-400" /> Define Task & Participating Students
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Specify deadlines and select the student pool. The algorithm will evaluate each student's current active task load.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Industry Alumni Sponsorship Outreach 2026"
                    value={taskInfo.title}
                    onChange={(e) => setTaskInfo({ ...taskInfo, title: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={taskInfo.deadline}
                    onChange={(e) => setTaskInfo({ ...taskInfo, deadline: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Task Instructions / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide guidance on outreach scripts, standard emails, or expectations..."
                    value={taskInfo.description}
                    onChange={(e) => setTaskInfo({ ...taskInfo, description: e.target.value })}
                    className="w-full bg-nexus-950 border border-nexus-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>

              {/* Student Pool Selection with Live Workload Badges */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-semibold">
                    Select Participating Students ({selectedStudentIds.length} of {allStudents.length} chosen)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentIds(allStudents.map(s => s.id))}
                      className="text-cyan-400 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentIds([])}
                      className="text-slate-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allStudents.map(student => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    const load = workloads[student.id];

                    return (
                      <div
                        key={student.id}
                        onClick={() => toggleStudentSelection(student.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-sm'
                            : 'bg-nexus-950/50 border-nexus-800 text-slate-400 hover:border-nexus-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded bg-nexus-950 border-nexus-800 text-cyan-500 focus:ring-0 shrink-0"
                          />
                          <div className="truncate">
                            <div className="font-semibold text-slate-100 truncate">{student.full_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">{student.usn} • Sem {student.semester}</div>
                          </div>
                        </div>

                        {/* Workload badge */}
                        <div className="shrink-0 text-right">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            load?.inProgress > 2
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {load?.inProgress || 0} active
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-nexus-800 flex justify-end">
                <button
                  type="button"
                  disabled={!taskInfo.title.trim() || selectedStudentIds.length === 0}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-nexus-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  Proceed to File Upload <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: File Upload & OCR Engine */}
          {step === 2 && (
            <div className="tech-card p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-nexus-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Upload size={18} className="text-cyan-400" /> Ingest Contacts or Work Item List
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload an Excel file (.xlsx, .csv) or an Image (.png, .jpg) to extract records automatically via OCR.
                  </p>
                </div>

                {/* Instant Preset Button */}
                <button
                  type="button"
                  onClick={loadSampleAlumniDataset}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Sparkles size={14} /> Load 12-Alumni Demo Dataset
                </button>
              </div>

              {parseError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-nexus-700/80 hover:border-cyan-500/60 rounded-2xl p-8 sm:p-12 text-center bg-nexus-950/60 transition-all relative group">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv, .png, .jpg, .jpeg, .webp"
                  onChange={handleFileUpload}
                  disabled={isParsing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    {isParsing ? <RefreshCw size={28} className="animate-spin" /> : <Upload size={28} />}
                  </div>

                  {isParsing ? (
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-white">Running Multi-format Extraction...</div>
                      <div className="text-xs text-cyan-300 font-mono">{parsingProgress.message}</div>
                      <div className="w-full bg-nexus-900 rounded-full h-2 overflow-hidden border border-nexus-800">
                        <div 
                          className="bg-cyan-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${parsingProgress.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="text-sm font-bold text-white">
                          Drag and drop your spreadsheet or image here
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Supports Excel (.xlsx, .csv) and Images (.png, .jpg) via Tesseract OCR
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-2">
                        <span className="flex items-center gap-1"><FileSpreadsheet size={13} className="text-emerald-400"/> Excel / CSV</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><ImageIcon size={13} className="text-cyan-400"/> Image OCR</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back to Task Info
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Table & Fair Workload Balancer */}
          {step === 3 && (
            <div className="tech-card p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexus-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" /> Verify Extracted Records ({extractedRecords.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Review and edit extracted items before launching equal, workload-balanced distribution.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddManualRecord}
                  className="px-3.5 py-1.5 rounded-xl bg-nexus-800 hover:bg-nexus-750 text-cyan-300 border border-nexus-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus size={14} /> Add Row
                </button>
              </div>

              {/* Projected Allocation Analytics Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-nexus-950 via-nexus-900 to-nexus-950 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Total Records:</span>{' '}
                  <strong className="text-white text-sm font-mono">{extractedRecords.length}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Students Selected:</span>{' '}
                  <strong className="text-cyan-400 text-sm font-mono">{selectedStudentIds.length}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Distribution Formula:</span>{' '}
                  <strong className="text-emerald-300 font-mono">
                    {projectedPerStudent} per student
                    {projectedRemainder > 0 && ` (+1 for ${projectedRemainder} students with lighter workload)`}
                  </strong>
                </div>
              </div>

              {/* Editable Verification Table */}
              <div className="overflow-x-auto rounded-xl border border-nexus-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-nexus-950/90 text-[11px] font-mono uppercase text-slate-400 border-b border-nexus-800">
                    <tr>
                      <th className="py-3 px-3 w-10">#</th>
                      <th className="py-3 px-3 min-w-[160px]">Name / Person</th>
                      <th className="py-3 px-3 min-w-[130px]">Phone</th>
                      <th className="py-3 px-3 min-w-[180px]">Email</th>
                      <th className="py-3 px-3 min-w-[180px]">Role / Organization</th>
                      <th className="py-3 px-3 min-w-[180px]">Notes</th>
                      <th className="py-3 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nexus-850 bg-nexus-900/40">
                    {extractedRecords.map((rec, idx) => (
                      <tr key={rec.id || idx} className="hover:bg-nexus-850/50">
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={rec.name}
                            onChange={(e) => handleRecordChange(idx, 'name', e.target.value)}
                            className="w-full bg-nexus-950 border border-nexus-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={rec.phone}
                            onChange={(e) => handleRecordChange(idx, 'phone', e.target.value)}
                            className="w-full bg-nexus-950 border border-nexus-800 rounded-lg px-2 py-1 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="email"
                            value={rec.email}
                            onChange={(e) => handleRecordChange(idx, 'email', e.target.value)}
                            className="w-full bg-nexus-950 border border-nexus-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={rec.role_or_work}
                            onChange={(e) => handleRecordChange(idx, 'role_or_work', e.target.value)}
                            className="w-full bg-nexus-950 border border-nexus-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={rec.notes}
                            onChange={(e) => handleRecordChange(idx, 'notes', e.target.value)}
                            className="w-full bg-nexus-950 border border-nexus-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(idx)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Launch & Final Confirmation */}
              <div className="pt-4 border-t border-nexus-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Upload Different File
                </button>

                <button
                  type="button"
                  onClick={handleLaunchDistribution}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-nexus-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles size={16} /> Execute Fair Workload Distribution Now
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: MONITORING COMMAND CENTER */}
      {/* ==================================================================== */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Active Tasks Selector Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {data.tasks?.map(task => {
              const isSelected = task.id === currentMonitoredTask?.id;
              const percent = task.total_records > 0 
                ? Math.round((task.completed_records / task.total_records) * 100) 
                : 0;

              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`px-4 py-3 rounded-xl border text-left shrink-0 transition-all ${
                    isSelected
                      ? 'bg-nexus-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                      : 'bg-nexus-950/70 border-nexus-800 text-slate-400 hover:border-nexus-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-xs mb-1">
                    <span className="font-bold text-white truncate max-w-[200px]">{task.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{percent}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {task.completed_records} of {task.total_records} completed
                  </div>
                </button>
              );
            })}
          </div>

          {currentMonitoredTask ? (
            <div className="space-y-6">
              
              {/* Task Header & Statistics */}
              <div className="tech-card p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold">
                        {currentMonitoredTask.status}
                      </span>
                      {currentMonitoredTask.deadline && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Calendar size={12} /> Deadline: {new Date(currentMonitoredTask.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1.5">{currentMonitoredTask.title}</h2>
                    <p className="text-xs text-slate-300 mt-1">{currentMonitoredTask.description}</p>
                  </div>

                  {/* Overall Progress ring/bar */}
                  <div className="flex items-center gap-4 bg-nexus-950 px-4 py-3 rounded-xl border border-nexus-800">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-400">Total Completion</div>
                      <div className="text-lg font-extrabold text-cyan-400 font-mono">
                        {currentMonitoredTask.completed_records} / {currentMonitoredTask.total_records}
                      </div>
                    </div>
                    <div className="w-20 bg-nexus-900 rounded-full h-3 overflow-hidden border border-nexus-800">
                      <div 
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(currentMonitoredTask.completed_records / currentMonitoredTask.total_records) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Breakdown by Assigned Student */}
                <div className="pt-4 border-t border-nexus-800">
                  <div className="text-xs font-semibold text-slate-300 mb-3">Student Allocations & Progress:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {currentMonitoredTask.assignments?.map(assign => {
                      const student = data.profiles?.find(p => p.id === assign.student_id);
                      const myRecords = currentMonitoredTask.records?.filter(r => r.assigned_to === assign.student_id) || [];
                      const completed = myRecords.filter(r => r.status === 'Completed').length;
                      const pct = myRecords.length > 0 ? Math.round((completed / myRecords.length) * 100) : 0;

                      return (
                        <div key={assign.student_id} className="p-3 rounded-xl bg-nexus-950 border border-nexus-800 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white truncate">{student?.full_name || 'Student'}</span>
                            <span className="text-[10px] font-mono font-bold text-cyan-400">{pct}%</span>
                          </div>
                          <div className="w-full bg-nexus-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span>{completed} done</span>
                            <span>{myRecords.length} assigned</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Records Detail Grid */}
              <div className="tech-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users size={16} className="text-cyan-400" /> Individual Task Records & Reassignment Controls
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-nexus-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-nexus-950/90 text-[11px] font-mono uppercase text-slate-400 border-b border-nexus-800">
                      <tr>
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Phone & Email</th>
                        <th className="py-3 px-3">Role / Work</th>
                        <th className="py-3 px-3">Assigned Student</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Student Notes</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nexus-850 bg-nexus-900/40">
                      {currentMonitoredTask.records?.map(record => {
                        const assignedStudent = data.profiles?.find(p => p.id === record.assigned_to);

                        return (
                          <tr key={record.id} className="hover:bg-nexus-850/40">
                            <td className="py-3 px-3 font-semibold text-white">{record.name}</td>
                            <td className="py-3 px-3">
                              <div className="font-mono text-slate-300">{record.phone || '—'}</div>
                              <div className="text-[10px] text-slate-400">{record.email || '—'}</div>
                            </td>
                            <td className="py-3 px-3 text-slate-300">{record.role_or_work}</td>
                            <td className="py-3 px-3">
                              <span className="font-medium text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                                {assignedStudent?.full_name || 'Unassigned'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                record.status === 'Completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : record.status === 'In Progress'
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    : record.status === 'Unable to Contact'
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : record.status === 'Needs Assistance'
                                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                        : 'bg-nexus-950 text-slate-400 border-nexus-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-xs text-slate-400 italic max-w-xs truncate">
                              {record.student_notes || '—'}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => setReassignModal({
                                  isOpen: true,
                                  taskId: currentMonitoredTask.id,
                                  recordId: record.id,
                                  currentAssigned: record.assigned_to
                                })}
                                className="px-2.5 py-1 rounded bg-nexus-800 hover:bg-nexus-750 text-slate-300 text-[11px] font-semibold border border-nexus-700 hover:text-white"
                              >
                                Reassign
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <Workflow size={32} className="mx-auto text-slate-600" />
              <p>No active tasks yet. Launch your first task using the wizard!</p>
            </div>
          )}

        </div>
      )}

      {/* Manual Reassignment Modal */}
      {reassignModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-nexus-900 border border-nexus-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck size={16} className="text-cyan-400" /> Reassign Record
            </h3>
            <p className="text-slate-400">
              Select the new student responsible for this work item:
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {allStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => {
                    reassignTaskRecord(reassignModal.taskId, reassignModal.recordId, student.id);
                    setReassignModal({ isOpen: false, taskId: null, recordId: null, currentAssigned: null });
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between ${
                    reassignModal.currentAssigned === student.id
                      ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-nexus-950 border-nexus-800 text-slate-300 hover:border-nexus-700'
                  }`}
                >
                  <span>{student.full_name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{student.usn}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setReassignModal({ isOpen: false, taskId: null, recordId: null, currentAssigned: null })}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
