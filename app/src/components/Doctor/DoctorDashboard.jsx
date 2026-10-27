import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck, Lock, UserCheck, AlertTriangle, FileText, Activity,
  Heart, Download, RefreshCw, CheckCircle, Clock, Pill, Calendar, ChevronRight,
  UserPlus, Search, X, Bot, Stethoscope, Users, ClipboardList, Eye
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function DoctorDashboard({ 
  logs = [], 
  medications = [], 
  appointments = [], 
  shareCode = '', 
  user = null, 
  userRole = 'doctor'
}) {
  // Main Top-Level Tab State (6 Main Tabs)
  const [activeTab, setActiveTab] = useState('clinical'); 
  // 'clinical' | 'schedule' | 'care_plan' | 'ai_advisor'

  const [enteredCode, setEnteredCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Default practice patients list
  const [patients, setPatients] = useState([
    {
      id: 'PT-89421',
      name: 'Jane Doe',
      age: 42,
      gender: 'Female',
      condition: 'Fibromyalgia / POTS',
      lastActive: 'Today, 08:30 AM',
      avgPain: 5.8,
      avgFatigue: 7.2,
      adherence: 85,
      flares7d: 3,
      passcode: 'VT-DEMO',
      logs: logs,
      medications: medications
    },
    {
      id: 'PT-10293',
      name: 'Robert Smith',
      age: 58,
      gender: 'Male',
      condition: 'Rheumatoid Arthritis',
      lastActive: 'Yesterday',
      avgPain: 4.1,
      avgFatigue: 3.5,
      adherence: 95,
      flares7d: 0,
      passcode: 'RA-9921',
      logs: [
        { id: '1', date: '2026-03-28', painLevel: 4, fatigueLevel: 3, sleepHours: 7.5, systolic: 122, diastolic: 78, heartRate: 72, notes: 'Feeling relatively stable on current methotrexate dosage.' },
        { id: '2', date: '2026-03-27', painLevel: 5, fatigueLevel: 4, sleepHours: 6.8, systolic: 125, diastolic: 80, heartRate: 75, notes: 'Mild morning stiffness in hands.' }
      ],
      medications: [
        { id: 'm1', name: 'Methotrexate', dosage: '15 mg', frequency: 'Weekly', takenToday: true },
        { id: 'm2', name: 'Folic Acid', dosage: '1 mg', frequency: 'Daily', takenToday: true }
      ]
    },
    {
      id: 'PT-44912',
      name: 'Elena Rostova',
      age: 34,
      gender: 'Female',
      condition: 'Lupus Erythematosus',
      lastActive: '3 days ago',
      avgPain: 7.4,
      avgFatigue: 8.1,
      adherence: 60,
      flares7d: 5,
      passcode: 'LU-4412',
      logs: [
        { id: '1', date: '2026-03-25', painLevel: 8, fatigueLevel: 9, sleepHours: 5.0, systolic: 138, diastolic: 88, heartRate: 88, notes: 'Severe joint flare up and malar rash after sun exposure.' }
      ],
      medications: [
        { id: 'm1', name: 'Hydroxychloroquine', dosage: '200 mg', frequency: 'Twice daily', takenToday: false },
        { id: 'm2', name: 'Prednisone', dosage: '10 mg', frequency: 'Daily', takenToday: true }
      ]
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState('PT-89421');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  // AI Assistant Query States
  const [aiQuery, setAiQuery] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello Doctor. I am your Gemini Clinical Decision Advisor. I can synthesize longitudinal patient trends, analyze drug-symptom interactions, or help draft differential updates based on active journal logs. How can I assist you today?'
    }
  ]);

  // Dynamic log/med prop syncing
  useEffect(() => {
    if (logs.length || medications.length) {
      setPatients(prev => prev.map(p => p.id === 'PT-89421' ? { ...p, logs, medications } : p));
    }
  }, [logs, medications]);

  // Active selected patient
  const activePatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  const activePatientLogs = activePatient?.logs || [];
  const activePatientMeds = activePatient?.medications || [];

  const chronologicalLogs = useMemo(() => {
    return [...activePatientLogs].reverse();
  }, [activePatientLogs]);

  const avgPain = useMemo(() => {
    if (!activePatientLogs.length) return 0;
    return (activePatientLogs.reduce((acc, l) => acc + (l.painLevel || 0), 0) / activePatientLogs.length).toFixed(1);
  }, [activePatientLogs]);

  const avgFatigue = useMemo(() => {
    if (!activePatientLogs.length) return 0;
    return (activePatientLogs.reduce((acc, l) => acc + (l.fatigueLevel || 0), 0) / activePatientLogs.length).toFixed(1);
  }, [activePatientLogs]);

  const adherenceRate = useMemo(() => {
    if (!activePatientMeds.length) return 100;
    const taken = activePatientMeds.filter(m => m.takenToday).length;
    return Math.round((taken / activePatientMeds.length) * 100);
  }, [activePatientMeds]);

  const flaggedFlares = useMemo(() => {
    return activePatientLogs.filter(l => (l.painLevel >= 6 || l.fatigueLevel >= 7));
  }, [activePatientLogs]);

  // Handle Passcode Import directly within Clinical Chart Tab
  const handleVerifyAndLinkPatient = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const cleanCode = enteredCode.trim().toUpperCase();

    if (!cleanCode) {
      setAuthError('Please enter a patient access passcode.');
      return;
    }

    if (cleanCode === 'VT-DEMO' || (shareCode && cleanCode === shareCode.toUpperCase())) {
      setSelectedPatientId('PT-89421');
      setAuthSuccess('Successfully linked and loaded Jane Doe (PT-89421)');
      setEnteredCode('');
      return;
    }

    const foundPatient = patients.find(p => p.passcode === cleanCode);
    if (foundPatient) {
      setSelectedPatientId(foundPatient.id);
      setAuthSuccess(`Successfully linked chart for ${foundPatient.name} (${foundPatient.id})`);
      setEnteredCode('');
    } else {
      setAuthError('Invalid or expired passcode. Verification failed.');
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.condition.toLowerCase().includes(patientSearch.toLowerCase())
    );
  }, [patients, patientSearch]);

  const handleAiAsk = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery;
    setAiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setAiQuery('');

    setTimeout(() => {
      setAiMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Clinical Analysis for Dr. Specialist regarding query: "${userText}"\n\n` +
                `1. Patient Trajectory (${activePatient.name} - ${activePatient.id}): Chronic fatigue baseline (${avgFatigue}/10) shows intermittent correlation with pain spikes. Titration review recommended.\n` +
                `2. Clinical Guidelines: EULAR guidelines suggest evaluating sleep efficiency and autonomic testing in persistent fibromyalgia presentations.\n` +
                `3. Recommended Plan: Order ESR/CRP inflammatory markers at next visit and review hemodynamic logs during peak symptoms.`
        }
      ]);
    }, 800);
  };

  const doctorAppointments = appointments.length > 0 ? appointments : [
    { id: '1', time: '09:00 AM', patientName: 'Jane Doe', patientId: 'PT-89421', type: 'Follow-up Encounter', room: 'Exam Room 3', status: 'In Progress' },
    { id: '2', time: '10:30 AM', patientName: 'Robert Smith', patientId: 'PT-10293', type: 'Medication Review', room: 'Virtual / Telehealth', status: 'Scheduled' },
    { id: '3', time: '01:15 PM', patientName: 'Elena Rostova', patientId: 'PT-44912', type: 'Flare Evaluation', room: 'Exam Room 1', status: 'Scheduled' },
    { id: '4', time: '03:00 PM', patientName: 'Marcus Vance', patientId: 'PT-33019', type: 'Initial Intake', room: 'Exam Room 2', status: 'Scheduled' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-2.5 sm:p-6 space-y-4 sm:space-y-6">
      
      {/* GLOBAL HEADER WITH 6 MAIN TABS */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" /> Healthcare Provider Console
            </span>
            <span className="text-xs text-slate-400 font-mono">Dr. Specialist, MD</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Clinical Practice Portal</h1>
        </div>

        {/* 6 MAIN TOP-LEVEL NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto w-full xl:w-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('clinical')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'clinical' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Clinical Chart
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'schedule' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" /> Doctor Schedule
          </button>

          <button
            onClick={() => setActiveTab('care_plan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'care_plan' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Active Care Plan
          </button>

          <button
            onClick={() => setActiveTab('ai_advisor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ai_advisor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-300" /> Gemini Clinical Advisor
          </button>


          
        </div>
      </div>

      {/* ==================== TAB 1: CLINICAL CHART ==================== */}
      {activeTab === 'clinical' && (
        <div className="space-y-6">
          
          {/* PASSCODE LINK BANNER */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-300" />
                <h3 className="text-base font-bold">Import Patient Chart via Passcode</h3>
              </div>
              <p className="text-xs text-blue-100 max-w-xl">
                Enter a patient's access passcode to verify consent and link their longitudinal health data to your roster.
              </p>
            </div>

            <form onSubmit={handleVerifyAndLinkPatient} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="Passcode (e.g. VT-DEMO)"
                className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-300 text-xs font-mono tracking-wider focus:ring-2 focus:ring-blue-400 outline-none uppercase font-bold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl text-xs tracking-wider uppercase shadow transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Verify &amp; Link
              </button>
            </form>
          </div>

          {authError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
              <button onClick={() => setAuthError('')}><X className="w-4 h-4" /></button>
            </div>
          )}

          {authSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
              <button onClick={() => setAuthSuccess('')}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* MAIN GRID: ALL PATIENTS ROSTER + ACTIVE CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* ALL PRACTICE PATIENTS PANEL */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 lg:col-span-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Practice Patients ({patients.length})
              </h3>

              <div className="relative">
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search patient or ID..."
                  className="w-full px-3 py-2 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredPatients.map((pt) => {
                  const isSelected = pt.id === selectedPatientId;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => setSelectedPatientId(pt.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected 
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-slate-800">{pt.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{pt.id} &bull; {pt.age}y {pt.gender[0]}</p>
                        </div>
                        {pt.flares7d > 0 && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" /> {pt.flares7d} Flares
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-blue-700 font-medium">{pt.condition}</p>

                      <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-slate-500 border-t border-slate-200/60">
                        <span>Avg Pain: <b className="text-slate-800">{pt.avgPain}/10</b></span>
                        <span>Adherence: <b className="text-slate-800">{pt.adherence}%</b></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTIVE SELECTED PATIENT CLINICAL DATA CHART */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-800">{activePatient.name}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono rounded-md">{activePatient.id}</span>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{activePatient.condition}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Last Sync: {activePatient.lastActive}</p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Chart
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Pain</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-slate-800">{avgPain}</span>
                    <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                  <span className="text-[10px] text-rose-600 font-semibold block mt-1">14-Day Baseline</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Fatigue</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-slate-800">{avgFatigue}</span>
                    <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">Fatigue Impact</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Regimen Adherence</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-blue-600">{adherenceRate}%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">{activePatientMeds.length} active prescriptions</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flagged Flare Episodes</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-rose-600">{flaggedFlares.length}</span>
                    <span className="text-xs text-slate-400">episodes</span>
                  </div>
                  <span className="text-[10px] text-rose-500 font-semibold block mt-1">Requires review</span>
                </div>
              </div>

              {/* Trajectory Plots */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pain &amp; Fatigue Longitudinal Plot</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chronologicalLogs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="painLevel" name="Pain (0-10)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="fatigueLevel" name="Fatigue (0-10)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="sleepHours" name="Sleep (Hours)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Vitals &amp; Hemodynamics</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chronologicalLogs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[50, 150]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="systolic" name="Systolic (mmHg)" stroke="#0d9488" strokeWidth={2} />
                        <Line type="monotone" dataKey="diastolic" name="Diastolic (mmHg)" stroke="#0284c7" strokeWidth={2} />
                        <Line type="monotone" dataKey="heartRate" name="Heart Rate (bpm)" stroke="#e11d48" strokeWidth={1.5} strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Lower Section: Active Medications & Patient Daily Journal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-600" /> Prescribed Regimen
                  </h3>
                  <div className="space-y-2.5">
                    {activePatientMeds.length === 0 && (
                      <p className="text-xs text-slate-400">No active medications recorded.</p>
                    )}
                    {activePatientMeds.map((med) => (
                      <div key={med.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{med.name}</p>
                          <p className="text-[11px] text-slate-500">{med.dosage} &bull; {med.frequency}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          med.takenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {med.takenToday ? 'Taken Today' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Patient Daily Journal Entries
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {activePatientLogs.length === 0 && (
                      <p className="text-xs text-slate-400">No journal logs recorded for this patient.</p>
                    )}
                    {activePatientLogs.map((log) => (
                      <div
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="p-3.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-sky-300 rounded-2xl transition cursor-pointer space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">{log.date}</span>
                          <div className="flex gap-2">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              log.painLevel >= 6 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              Pain: {log.painLevel}/10
                            </span>
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800">
                              Fatigue: {log.fatigueLevel}/10
                            </span>
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-800">
                              Sleep: {log.sleepHours}h
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 italic line-clamp-2">
                          "{log.notes || 'No notes added for this date.'}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: DOCTOR SCHEDULE ==================== */}
      {activeTab === 'schedule' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Physician Daily Schedule
              </h2>
              <p className="text-xs text-slate-500">Upcoming clinical encounters, consultations, and review appointments</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition">
              + Schedule Encounter
            </button>
          </div>

          <div className="space-y-4">
            {doctorAppointments.map((apt) => (
              <div 
                key={apt.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-sky-300 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="px-3.5 py-2.5 bg-blue-700 text-white font-mono font-bold text-xs rounded-xl text-center">
                    <Clock className="w-4 h-4 mx-auto mb-0.5 text-sky-300" />
                    {apt.time}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{apt.patientName} <span className="text-xs text-slate-400 font-mono">({apt.patientId})</span></h3>
                    <p className="text-xs text-blue-600 font-medium">{apt.type}</p>
                    <p className="text-[11px] text-slate-500">{apt.room}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    apt.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {apt.status}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedPatientId(apt.patientId);
                      setActiveTab('clinical');
                    }}
                    className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1"
                  >
                    Open Patient Chart <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: ACTIVE CARE PLAN ==================== */}
      {activeTab === 'care_plan' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" /> Active Care Plan Management
              </h2>
              <p className="text-xs text-slate-500">Configure clinical goals and flare intervention thresholds for {activePatient.name}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">
              + Update Protocol
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700">Primary Treatment Goals</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Maintain baseline pain level below 5/10
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Monitor hemodynamic stability (BP &lt; 130/85 mmHg)
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" /> Improve sleep efficiency to &gt; 7 hours per night
                </li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700">Flare Escalation Protocol</h3>
              <div className="text-xs text-slate-600 space-y-2">
                <p><b>Pain Level ≥ 7/10 for 2 consecutive days:</b> Initiate acute rescue medication and schedule follow-up consultation.</p>
                <p><b>Systolic Blood Pressure &gt; 140 mmHg:</b> Request twice-daily resting vitals logs and alert clinical coordinator.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: GEMINI CLINICAL ADVISOR ==================== */}
      {activeTab === 'ai_advisor' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-slate-900 rounded-2xl text-amber-300 shadow">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Gemini Clinical Intelligence Advisor</h2>
                <p className="text-xs text-slate-500">Physician source for clinical synthesis, differential consultation &amp; medical literature cross-referencing</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {aiMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white ml-auto max-w-xl shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 max-w-2xl shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[10px] text-slate-400 mb-1">
                  <span>{msg.role === 'user' ? 'Physician Query' : 'Gemini AI Assistant'}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAiAsk} className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask Gemini regarding differential diagnoses, drug interactions, or active patient synthesis..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-300" /> Ask AI
            </button>
          </form>
        </div>
      )}

      {/* JOURNAL ENTRY DETAIL DRILL-DOWN MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Journal Record Details ({selectedLog.date})
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-[10px] text-rose-600 font-bold block">Pain</span>
                <span className="text-base font-bold text-rose-800">{selectedLog.painLevel}/10</span>
              </div>
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[10px] text-amber-600 font-bold block">Fatigue</span>
                <span className="text-base font-bold text-amber-800">{selectedLog.fatigueLevel}/10</span>
              </div>
              <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[10px] text-blue-600 font-bold block">Sleep</span>
                <span className="text-base font-bold text-blue-800">{selectedLog.sleepHours}h</span>
              </div>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block">Patient Clinical Notes:</span>
              <p className="text-slate-600 italic">{selectedLog.notes || 'No detailed notes provided.'}</p>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition"
            >
              Close Record Detail
            </button>
          </div>
        </div>
      )}

    </div>
  );
}