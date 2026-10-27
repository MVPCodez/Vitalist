import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Calendar as CalendarIcon, Activity, Pill, Heart, FileText, Share2, Sparkles, Plus, CheckCircle, AlertTriangle, Clock, ChevronLeft, ChevronRight, Download, User, LogOut, MessageSquare, RefreshCw, Sun, Moon, Bell, Shield, Info, Edit3, Trash2
} from 'lucide-react';

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  apiKey: "demo-api-key",
  authDomain: "demo-app.firebaseapp.com",
  projectId: "demo-app",
  storageBucket: "demo-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'carepulse-health-tracker';

// --- INITIAL MOCK DATA FOR NEW USERS ---
const initialLogs = [
  { id: '1', date: '2026-10-11', painLevel: 3, fatigueLevel: 4, mood: 4, stress: 3, systolic: 118, diastolic: 76, heartRate: 72, glucose: 95, sleepHours: 7.5, waterIntake: 2000, notes: 'Felt well in the morning. Minor stiffness in knees around 4 PM.', medsTaken: true },
  { id: '2', date: '2026-10-12', painLevel: 5, fatigueLevel: 6, mood: 3, stress: 5, systolic: 122, diastolic: 80, heartRate: 78, glucose: 102, sleepHours: 6.0, waterIntake: 1500, notes: 'Rainy day, joint flare up. Took extra heat pack.', medsTaken: true },
  { id: '3', date: '2026-10-13', painLevel: 4, fatigueLevel: 5, mood: 3, stress: 4, systolic: 120, diastolic: 78, heartRate: 74, glucose: 98, sleepHours: 6.8, waterIntake: 1800, notes: 'Rested in afternoon. Fatigue slightly improved.', medsTaken: false },
  { id: '4', date: '2026-10-14', painLevel: 2, fatigueLevel: 3, mood: 5, stress: 2, systolic: 116, diastolic: 74, heartRate: 68, glucose: 92, sleepHours: 8.0, waterIntake: 2200, notes: 'Great day overall! Light walking for 20 mins.', medsTaken: true },
  { id: '5', date: '2026-10-15', painLevel: 6, fatigueLevel: 7, mood: 2, stress: 6, systolic: 125, diastolic: 82, heartRate: 82, glucose: 110, sleepHours: 5.2, waterIntake: 1200, notes: 'High fatigue and brain fog. Couldn’t focus much.', medsTaken: true },
  { id: '6', date: '2026-10-16', painLevel: 4, fatigueLevel: 4, mood: 4, stress: 3, systolic: 119, diastolic: 77, heartRate: 71, glucose: 96, sleepHours: 7.2, waterIntake: 2000, notes: 'Stabilizing after rest. Took all morning medications on time.', medsTaken: true },
  { id: '7', date: '2026-10-17', painLevel: 3, fatigueLevel: 3, mood: 4, stress: 3, systolic: 117, diastolic: 75, heartRate: 70, glucose: 94, sleepHours: 7.8, waterIntake: 2100, notes: 'Feeling steady today.', medsTaken: true },
];

const initialMeds = [
  { id: 'm1', name: 'Hydroxychloroquine', dosage: '200 mg', frequency: 'Daily (Morning)', time: '08:00', takenToday: true },
  { id: 'm2', name: 'Methotrexate', dosage: '15 mg', frequency: 'Weekly (Saturdays)', time: '09:00', takenToday: true },
  { id: 'm3', name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Daily (Morning)', time: '08:00', takenToday: false },
  { id: 'm4', name: 'Gabapentin', dosage: '300 mg', frequency: 'As Needed (Night)', time: '21:00', takenToday: false },
];

const initialAppointments = [
  { id: 'a1', doctor: 'Dr. Sarah Jenkins', specialty: 'Rheumatology', date: '2026-10-24', time: '10:30 AM', location: 'City Health Clinic - Suite 402', notes: 'Review quarterly bloodwork & flare frequency' },
  { id: 'a2', doctor: 'Dr. Robert Chen', specialty: 'Endocrinology', date: '2026-11-05', time: '02:00 PM', location: 'Telehealth Virtual Portal', notes: 'Check fasting glucose log and dosage review' }
];

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App navigation state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'tracker', 'calendar', 'analytics', 'reminders', 'share'

  // Data states
  const [logs, setLogs] = useState(initialLogs);
  const [medications, setMedications] = useState(initialMeds);
  const [appointments, setAppointments] = useState(initialAppointments);

  // Form / Modal states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    painLevel: 3,
    fatigueLevel: 3,
    mood: 4,
    stress: 3,
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    glucose: 95,
    sleepHours: 7,
    waterIntake: 2000,
    notes: '',
    medsTaken: true
  });

  // Calendar State
  const [calendarView, setCalendarView] = useState('month'); // 'day', 'week', 'month'
  const [currentCalMonth, setCurrentCalMonth] = useState(new Date());

  // Gemini AI States
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your Vitalist AI Health Assistant. Ask me anything about your health trends, symptom pacing, or preparation questions for your doctor!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Doctor Sharing Access Code
  const [shareCode, setShareCode] = useState('');
  const [shareExpiry, setShareExpiry] = useState('');

  // Notifications toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // --- FIREBASE AUTH EFFECT ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- FIRESTORE SYNC EFFECT ---
  useEffect(() => {
    if (!user) return;

    // Load or sync logs
    const logsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'healthLogs');
    const unsubLogs = onSnapshot(logsCol, (snapshot) => {
      if (!snapshot.empty) {
        const loadedLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // sort by date descending
        loadedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(loadedLogs);
      } else {
        // Seed initial data to Firestore if empty
        initialLogs.forEach(async (log) => {
          await addDoc(logsCol, log);
        });
      }
    }, (err) => console.error("Firestore logs error:", err));

    // Load or sync medications
    const medsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'medications');
    const unsubMeds = onSnapshot(medsCol, (snapshot) => {
      if (!snapshot.empty) {
        setMedications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        initialMeds.forEach(async (med) => {
          await addDoc(medsCol, med);
        });
      }
    }, (err) => console.error("Firestore meds error:", err));

    // Load or sync appointments
    const apptsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'appointments');
    const unsubAppts = onSnapshot(apptsCol, (snapshot) => {
      if (!snapshot.empty) {
        setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        initialAppointments.forEach(async (appt) => {
          await addDoc(apptsCol, appt);
        });
      }
    }, (err) => console.error("Firestore appts error:", err));

    return () => {
      unsubLogs();
      unsubMeds();
      unsubAppts();
    };
  }, [user]);

  // --- LOG SAVING HANDLER ---
  const handleSaveLog = async (e) => {
    e.preventDefault();
    const newEntry = {
      ...logForm,
      painLevel: Number(logForm.painLevel),
      fatigueLevel: Number(logForm.fatigueLevel),
      mood: Number(logForm.mood),
      stress: Number(logForm.stress),
      systolic: Number(logForm.systolic),
      diastolic: Number(logForm.diastolic),
      heartRate: Number(logForm.heartRate),
      glucose: Number(logForm.glucose),
      sleepHours: Number(logForm.sleepHours),
      waterIntake: Number(logForm.waterIntake),
    };

    if (user) {
      try {
        const logsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'healthLogs');
        // Check if entry for date exists
        const existingDoc = logs.find(l => l.date === logForm.date);
        if (existingDoc) {
          await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'healthLogs', existingDoc.id), newEntry);
        } else {
          await addDoc(logsCol, newEntry);
        }
      } catch (err) {
        console.error("Error saving log to Firestore:", err);
      }
    } else {
      // Local fallback
      setLogs(prev => {
        const index = prev.findIndex(l => l.date === logForm.date);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...newEntry, id: prev[index].id };
          return updated;
        }
        return [{ ...newEntry, id: Date.now().toString() }, ...prev];
      });
    }

    alert('Daily health entry saved successfully!');
    setActiveTab('dashboard');
  };

  // Toggle Med Taken
  const handleToggleMed = async (medId) => {
    const med = medications.find(m => m.id === medId);
    if (!med) return;

    const updatedStatus = !med.takenToday;
    if (user) {
      try {
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'medications', medId), {
          takenToday: updatedStatus
        });
      } catch (err) {
        console.error("Error updating med:", err);
      }
    } else {
      setMedications(prev => prev.map(m => m.id === medId ? { ...m, takenToday: updatedStatus } : m));
    }
  };

  // Add New Medication
  const handleAddMedication = async (newMed) => {
    if (user) {
      const medsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'medications');
      await addDoc(medsCol, { ...newMed, takenToday: false });
    } else {
      setMedications(prev => [...prev, { ...newMed, id: Date.now().toString(), takenToday: false }]);
    }
  };

  // Add Appointment
  const handleAddAppointment = async (newAppt) => {
    if (user) {
      const apptsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'appointments');
      await addDoc(apptsCol, newAppt);
    } else {
      setAppointments(prev => [...prev, { ...newAppt, id: Date.now().toString() }]);
    }
  };

  // --- GEMINI AI HEALTH ANALYSIS ---
  const generateAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const prompt = `You are an expert AI clinical health assistant analyzing a chronic illness patient's recent 7-day health logs.
Log Summary Data: ${JSON.stringify(logs.slice(0, 7))}

Please provide:
1. Executive Summary & Symptom Trajectory (Pain vs Fatigue vs Sleep correlations).
2. Key Observations (e.g. identify potential triggers or patterns like poor sleep leading to higher pain/fatigue).
3. Practical Self-Care Pacing & Lifestyle Recommendations.
4. Suggested Questions or Notes to present to their Doctor at the next visit.

Format cleanly with readable Markdown bold headers and bullet points. Include a short medical disclaimer at the bottom.`;

      const apiKey = "AQ.Ab8RN6I0goXehsOhDcffsfwwJWJ-PqlZt29M8jf6bP7rCBofZw";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{ text: "Act as an empathetic, encouraging, high-precision chronic illness health analyst. Always maintain patient safety and suggest clinical verification." }]
          }
        })
      });

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate insights at this time. Please check your data logs.";
      setAiAnalysis(text);
    } catch (err) {
      console.error("Gemini AI API error:", err);
      setAiAnalysis("Error generating AI insights. Please retry shortly.");
    } finally {
      setAiLoading(false);
    }
  };

  // --- GEMINI CHATBOT HANDLER ---
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const apiKey = "AQ.Ab8RN6I0goXehsOhDcffsfwwJWJ-PqlZt29M8jf6bP7rCBofZw";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const contextPrompt = `User's Health Logs: ${JSON.stringify(logs.slice(0, 5))}. 
User Query: ${userMsg}. 
Answer empathetically, concisely, and accurately based on patient care guidelines for chronic condition management. Always include a brief note that advice should be reviewed with a clinician.`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: contextPrompt }] }]
        })
      });

      const data = await response.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I could not complete your request.";
      setChatMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, { role: 'assistant', text: "Connection error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Generate Doctor Access Code
  const handleGenerateShareCode = () => {
    const code = 'CP-' + Math.floor(100000 + Math.random() * 900000);
    const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
    setShareCode(code);
    setShareExpiry(exp);
  };

  // Stats Calculations
  const avgPain = useMemo(() => {
    if (!logs.length) return 0;
    return (logs.reduce((acc, l) => acc + (l.painLevel || 0), 0) / logs.length).toFixed(1);
  }, [logs]);

  const avgFatigue = useMemo(() => {
    if (!logs.length) return 0;
    return (logs.reduce((acc, l) => acc + (l.fatigueLevel || 0), 0) / logs.length).toFixed(1);
  }, [logs]);

  const medAdherence = useMemo(() => {
    if (!medications.length) return 100;
    const taken = medications.filter(m => m.takenToday).length;
    return Math.round((taken / medications.length) * 100);
  }, [medications]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* HEADER BAR */}
      <header className="bg-teal-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-white p-2 rounded-xl text-teal-700 shadow-inner">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Vitalist</h1>
              <p className="text-xs text-teal-200">Chronic Care & Daily Health Tracker</p>
            </div>
          </div>

          {/* User Profile & Auth Status */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2 rounded-lg transition ${notificationsEnabled ? 'bg-teal-600 text-yellow-300' : 'bg-teal-800 text-teal-300'}`}
              title="Toggle Alert Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-teal-100">Patient ID</span>
              <span className="text-xs font-mono bg-teal-800 px-2 py-0.5 rounded text-teal-200">
                {user ? user.uid.substring(0, 10) + '...' : 'Guest Patient'}
              </span>
            </div>
            {user && (
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center gap-1 text-xs bg-teal-800 hover:bg-teal-900 px-3 py-1.5 rounded-lg text-teal-100 font-medium transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            )}
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-teal-800 border-t border-teal-600/50">
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto space-x-1 sm:space-x-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'tracker', label: 'Daily Tracker', icon: Edit3 },
              { id: 'calendar', label: 'Calendar View', icon: CalendarIcon },
              { id: 'analytics', label: 'Analytics & Trends', icon: FileText },
              { id: 'reminders', label: 'Reminders & Care Plan', icon: Pill },
              { id: 'ai-insights', label: 'Gemini AI Insights', icon: Sparkles },
              { id: 'share', label: 'Doctor Sharing', icon: Share2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition border-b-2 ${
                    isActive 
                      ? 'border-white text-white bg-teal-700/60' 
                      : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* TOP ALERT NOTIFICATION BANNER */}
        {notificationsEnabled && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 flex items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Reminder:</span> You have 1 pending evening medication (Vitamin D3) and an upcoming Rheumatology appointment on Oct 24th.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('reminders')}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-3 py-1.5 rounded-lg shrink-0 transition"
            >
              View Schedule
            </button>
          </div>
        )}

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* WELCOME BANNER */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome Back to Your Health Dashboard</h2>
                <p className="text-teal-100 text-sm mt-1">
                  Tracking daily symptoms helps build long-term trends for better care decisions with your medical team.
                </p>
              </div>
              <button 
                onClick={() => {
                  setLogForm(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
                  setActiveTab('tracker');
                }}
                className="bg-white text-teal-700 font-bold px-5 py-2.5 rounded-xl shadow hover:bg-teal-50 transition flex items-center gap-2 shrink-0"
              >
                <Plus className="w-5 h-5" /> Log Today's Entry
              </button>
            </div>

            {/* KEY STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Avg Pain (7 Days)</span>
                  <Activity className="w-4 h-4 text-rose-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{avgPain}</span>
                  <span className="text-xs text-slate-400">/ 10</span>
                </div>
                <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <span>Stable compared to last week</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Avg Fatigue</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{avgFatigue}</span>
                  <span className="text-xs text-slate-400">/ 10</span>
                </div>
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1 font-medium">
                  <span>Moderate Energy Levels</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Meds Adherence</span>
                  <Pill className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-teal-700">{medAdherence}%</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {medications.filter(m => m.takenToday).length} of {medications.length} taken today
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Logging Streak</span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-700">{logs.length} Days</span>
                </div>
                <div className="mt-2 text-xs text-purple-600 font-medium">
                  Keep up the great routine!
                </div>
              </div>
            </div>

            {/* DASHBOARD GRID: RECENT TREND + TODAY MEDS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PAIN & FATIGUE CHART PREVIEW */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">7-Day Symptom Trajectory</h3>
                    <p className="text-xs text-slate-500">Correlation between daily Pain level & Fatigue</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    View Full Analytics &rarr;
                  </button>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...logs].reverse().slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Legend />
                      <Line type="monotone" dataKey="painLevel" name="Pain Level (0-10)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="fatigueLevel" name="Fatigue (0-10)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="sleepHours" name="Sleep (Hours)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TODAY'S MEDICATION QUICK LIST */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800 text-lg">Today's Medications</h3>
                    <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-semibold">
                      {medications.filter(m => m.takenToday).length} / {medications.length}
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {medications.map(med => (
                      <div 
                        key={med.id}
                        onClick={() => handleToggleMed(med.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          med.takenToday 
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                            : 'bg-slate-50 border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${med.takenToday ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{med.name}</p>
                            <p className="text-[11px] text-slate-500">{med.dosage} &bull; {med.time}</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={med.takenToday} 
                          onChange={() => {}} // handled by div click
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('reminders')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Manage Care Plan & Reminders
                </button>
              </div>
            </div>

            {/* RECENT LOG RECAP */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-lg">Recent Health Journal Entries</h3>
                <button onClick={() => setActiveTab('calendar')} className="text-xs text-teal-600 font-semibold">
                  View Full Calendar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {logs.slice(0, 3).map(log => (
                  <div key={log.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{log.date}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        log.painLevel >= 6 ? 'bg-rose-100 text-rose-700' :
                        log.painLevel >= 4 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        Pain: {log.painLevel}/10
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic line-clamp-2">"{log.notes || 'No detailed journal notes added.'}"</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span>Fatigue: {log.fatigueLevel}/10</span>
                      <span>Sleep: {log.sleepHours}h</span>
                      <span>BP: {log.systolic}/{log.diastolic}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. DAILY HEALTH TRACKER FORM */}
        {activeTab === 'tracker' && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Daily Health Entry</h2>
                <p className="text-xs text-slate-500">Record symptoms, vitals, mood, and daily metrics.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">Date:</label>
                <input 
                  type="date"
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-6">
              {/* SYMPTOMS SLIDERS */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Symptom Severity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
                  {/* Pain */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Pain Level</span>
                      <span className="text-rose-600 font-bold">{logForm.painLevel} / 10</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" 
                      value={logForm.painLevel}
                      onChange={(e) => setLogForm({ ...logForm, painLevel: e.target.value })}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>None (0)</span>
                      <span>Moderate (5)</span>
                      <span>Severe (10)</span>
                    </div>
                  </div>

                  {/* Fatigue */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Fatigue Level</span>
                      <span className="text-amber-600 font-bold">{logForm.fatigueLevel} / 10</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" 
                      value={logForm.fatigueLevel}
                      onChange={(e) => setLogForm({ ...logForm, fatigueLevel: e.target.value })}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Energized</span>
                      <span>Moderate</span>
                      <span>Exhausted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOOD & MENTAL WELL-BEING */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Mood & Mental Well-being
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Overall Mood</span>
                      <span className="text-emerald-600 font-bold">{logForm.mood} / 5</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" 
                      value={logForm.mood}
                      onChange={(e) => setLogForm({ ...logForm, mood: e.target.value })}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Low (1)</span>
                      <span>Neutral (3)</span>
                      <span>Great (5)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Stress Level</span>
                      <span className="text-purple-600 font-bold">{logForm.stress} / 5</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" 
                      value={logForm.stress}
                      onChange={(e) => setLogForm({ ...logForm, stress: e.target.value })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Calm (1)</span>
                      <span>Moderate (3)</span>
                      <span>High (5)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VITALS & METRICS */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-teal-800 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Vital Signs & Daily Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">BP Systolic (mmHg)</label>
                    <input 
                      type="number" 
                      value={logForm.systolic} 
                      onChange={(e) => setLogForm({ ...logForm, systolic: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">BP Diastolic (mmHg)</label>
                    <input 
                      type="number" 
                      value={logForm.diastolic} 
                      onChange={(e) => setLogForm({ ...logForm, diastolic: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Heart Rate (bpm)</label>
                    <input 
                      type="number" 
                      value={logForm.heartRate} 
                      onChange={(e) => setLogForm({ ...logForm, heartRate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Blood Glucose (mg/dL)</label>
                    <input 
                      type="number" 
                      value={logForm.glucose} 
                      onChange={(e) => setLogForm({ ...logForm, glucose: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Sleep (Hours)</label>
                    <input 
                      type="number" step="0.5" 
                      value={logForm.sleepHours} 
                      onChange={(e) => setLogForm({ ...logForm, sleepHours: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Water Intake (mL)</label>
                    <input 
                      type="number" step="100" 
                      value={logForm.waterIntake} 
                      onChange={(e) => setLogForm({ ...logForm, waterIntake: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs" 
                    />
                  </div>
                </div>
              </div>

              {/* JOURNALING NOTES */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  Daily Notes & Flare Observations
                </label>
                <textarea 
                  rows="3"
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  placeholder="Record triggers, food intake, weather changes, or specific flare locations..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Health Calendar</h2>
                <p className="text-xs text-slate-500">View severity trends and click any date to view log details.</p>
              </div>
              <div className="flex items-center gap-2">
                {['month', 'week', 'day'].map(view => (
                  <button 
                    key={view}
                    onClick={() => setCalendarView(view)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                      calendarView === view ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* MONTHLY CALENDAR GRID */}
            {calendarView === 'month' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setCurrentCalMonth(new Date(currentCalMonth.getFullYear(), currentCalMonth.getMonth() - 1, 1))}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <span className="font-bold text-slate-700 text-sm">
                    {currentCalMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={() => setCurrentCalMonth(new Date(currentCalMonth.getFullYear(), currentCalMonth.getMonth() + 1, 1))}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `2026-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                    const entry = logs.find(l => l.date === dateStr);

                    return (
                      <div 
                        key={i}
                        onClick={() => {
                          if (entry) {
                            alert(`Log for ${entry.date}:\nPain: ${entry.painLevel}/10\nFatigue: ${entry.fatigueLevel}/10\nSleep: ${entry.sleepHours}h\nNotes: ${entry.notes}`);
                          } else {
                            setLogForm(prev => ({ ...prev, date: dateStr }));
                            setActiveTab('tracker');
                          }
                        }}
                        className={`min-h-[75px] p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition hover:shadow-md ${
                          entry 
                            ? entry.painLevel >= 6 
                              ? 'bg-rose-50 border-rose-200' 
                              : entry.painLevel >= 4 
                              ? 'bg-amber-50 border-amber-200' 
                              : 'bg-emerald-50 border-emerald-200'
                            : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-700">{dayNum}</span>
                        {entry ? (
                          <div className="space-y-1">
                            <span className={`text-[10px] block px-1 py-0.5 rounded text-center font-bold ${
                              entry.painLevel >= 6 ? 'bg-rose-200 text-rose-800' :
                              entry.painLevel >= 4 ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'
                            }`}>
                              Pain: {entry.painLevel}
                            </span>
                            <span className="text-[9px] text-slate-500 block truncate">
                              Fatigue: {entry.fatigueLevel}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 text-center italic">+ Log</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(calendarView === 'week' || calendarView === 'day') && (
              <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl">
                <p className="text-sm">Detailed Timeline View for {calendarView.toUpperCase()}</p>
                <p className="text-xs mt-1">Select entries from the monthly grid to inspect individual metric breakdowns.</p>
              </div>
            )}
          </div>
        )}

        {/* 4. ANALYTICS & TREND VISUALIZATIONS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Trend Analytics & Insights</h2>
                <p className="text-xs text-slate-500">Longitudinal evaluation of symptom severity, medication adherence, and vitals.</p>
              </div>

              {/* PAIN VS MOOD CORRELATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pain vs Mood Correlation</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[...logs].reverse()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="painLevel" name="Pain Level (0-10)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="mood" name="Mood Rating (1-5)" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* VITALS HISTORY */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Blood Pressure Trajectory</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[...logs].reverse()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[60, 140]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="systolic" name="Systolic (mmHg)" stroke="#0d9488" strokeWidth={2} />
                        <Line type="monotone" dataKey="diastolic" name="Diastolic (mmHg)" stroke="#0284c7" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. REMINDERS & CARE PLAN */}
        {activeTab === 'reminders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MEDICATIONS SCHEDULE */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" /> Medication Reminders
                </h3>
              </div>
              <div className="space-y-3">
                {medications.map(med => (
                  <div key={med.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{med.name}</p>
                      <p className="text-[11px] text-slate-500">{med.dosage} &bull; {med.frequency}</p>
                      <p className="text-[10px] text-teal-700 font-medium mt-1">Scheduled Time: {med.time}</p>
                    </div>
                    <button 
                      onClick={() => handleToggleMed(med.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        med.takenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-700 text-white hover:bg-teal-800'
                      }`}
                    >
                      {med.takenToday ? '✓ Taken Today' : 'Mark as Taken'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCTOR APPOINTMENTS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-teal-600" /> Doctor Appointments
                </h3>
              </div>
              <div className="space-y-3">
                {appointments.map(appt => (
                  <div key={appt.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{appt.doctor}</p>
                        <p className="text-[11px] text-teal-700 font-semibold">{appt.specialty}</p>
                      </div>
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                        {appt.date} @ {appt.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600"><strong>Location:</strong> {appt.location}</p>
                    <p className="text-[11px] text-slate-500 italic"><strong>Prep Notes:</strong> {appt.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. GEMINI AI HEALTH INSIGHTS & CHATBOT */}
        {activeTab === 'ai-insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI REPORT GENERATOR */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" /> Gemini AI Health Clinical Summary
                  </h2>
                  <p className="text-xs text-slate-500">Automated pattern detection & symptom correlations.</p>
                </div>
                <button 
                  onClick={generateAiAnalysis}
                  disabled={aiLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2 disabled:opacity-50"
                >
                  {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {aiAnalysis ? 'Regenerate Analysis' : 'Generate AI Report'}
                </button>
              </div>

              {aiAnalysis ? (
                <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed space-y-3">
                  {aiAnalysis}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 space-y-2">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-xs font-semibold">Click "Generate AI Report" to perform an automated Gemini AI analysis on your logged health metrics.</p>
                </div>
              )}
            </div>

            {/* AI CHATBOT */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[500px]">
              <div>
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" /> Health Q&A Chatbot
                </h3>
                <div className="space-y-3 mt-3 max-h-[350px] overflow-y-auto pr-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-teal-700 text-white ml-6' : 'bg-slate-100 text-slate-800 mr-6'}`}>
                      {msg.text}
                    </div>
                  ))}
                  {chatLoading && <div className="text-slate-400 text-[11px] italic">Gemini is thinking...</div>}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button 
                  onClick={handleSendChatMessage}
                  className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. DOCTOR SHARING & REPORT EXPORT */}
        {activeTab === 'share' && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-teal-600" /> Secure Provider Sharing & PDF Export
              </h2>
              <p className="text-xs text-slate-500">Provide your healthcare provider with temporary read access or printable health logs.</p>
            </div>

            {/* GENERATE ACCESS CODE */}
            <div className="bg-teal-50 p-5 rounded-xl border border-teal-200 space-y-3">
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider">Generate Temporary Provider Passcode</h3>
              <p className="text-xs text-teal-700">This passcode allows your provider to access a read-only clinical breakdown of your last 30 days.</p>
              
              {shareCode ? (
                <div className="p-4 bg-white rounded-xl border border-teal-300 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Passcode</span>
                    <span className="text-xl font-mono font-bold text-teal-800">{shareCode}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Valid Until</span>
                    <span className="text-xs font-semibold text-slate-700">{shareExpiry}</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleGenerateShareCode}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Generate Passcode
                </button>
              )}
            </div>

            {/* PRINTABLE SUMMARY */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Doctor Visit Summary Prep</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <p><strong>Patient Logs Count:</strong> {logs.length} Total Daily Submissions</p>
                <p><strong>Average Pain Rating:</strong> {avgPain} / 10</p>
                <p><strong>Medication Adherence Rate:</strong> {medAdherence}%</p>
                <p><strong>Recent Flare Summary:</strong> Rainy day joint stiffness logged on 2026-10-12.</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Printable Clinical Report (PDF)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>Vitalist Tracker &copy; 2026. Designed for patient health management.</p>
        <p className="text-[10px] mt-1 text-slate-400">
          Disclaimer: This application is for personal health tracking purposes and does not replace formal medical advice.
        </p>
      </footer>
    </div>
  );
}