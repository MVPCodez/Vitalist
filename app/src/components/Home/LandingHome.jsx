import React from 'react';
import { Activity, Stethoscope, ArrowRight, ShieldCheck, Sparkles, Heart, CheckCircle2, ChevronRight, Mic, Calendar, FileText } from 'lucide-react';

export default function LandingHome({ onSelectRole, onOpenAuth }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/30 to-slate-100 flex flex-col font-sans">
      {/* TOP NAVIGATION BAR */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-teal-700 p-2 rounded-xl text-white shadow-md">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Vitalist</h1>
              <p className="text-[11px] text-teal-600 font-medium">Chronic Care &amp; Health Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('patient')}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition"
            >
              Log In
            </button>
            <button
              onClick={() => onOpenAuth('patient')}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 md:py-16 flex flex-col items-center text-center space-y-8">
        
        {/* BADGE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wide shadow-sm border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Empowering Patients &amp; Physicians with Daily Health Clarity</span>
        </div>

        {/* HERO TITLE */}
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Effortless Chronic Care Tracking &amp; Clinical Insights
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Record symptoms and vitals in seconds—even on low-energy flare days with hands-free voice logging. Securely connect your data directly with your physician.
          </p>
        </div>

        {/* ROLE SELECTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-4 text-left">
          
          {/* PATIENT CARD */}
          <div className="bg-white rounded-3xl p-8 border-2 border-teal-200/80 hover:border-teal-500 shadow-xl hover:shadow-2xl transition flex flex-col justify-between space-y-6 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-inner">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient Experience</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">I am a Patient</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Log symptoms, vitals, and medications. Use our hands-free low-energy voice recorder powered by Gemini AI, view calendar trends, and generate secure doctor passcodes.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Low-energy voice check-in (auto-parsed by Gemini)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Interactive symptom trajectories (Pain vs. Fatigue vs. Sleep)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Temporary passcode generator for appointments</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 relative z-10 space-y-2">
              <button
                onClick={() => onSelectRole('patient')}
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Enter as Patient</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DOCTOR CARD */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-amber-500 shadow-xl hover:shadow-2xl transition flex flex-col justify-between space-y-6 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-inner">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Healthcare Provider Portal</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">I am a Doctor</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Review longitudinal patient charts, monitor flagged flare episodes and blood pressure, and generate a 15-minute clinical briefing note before encounters.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Real-time longitudinal symptom trajectory charts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Automated AI Pre-Encounter Clinical Briefing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>One-click printable clinical PDF export</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 relative z-10 space-y-2">
              <button
                onClick={() => onSelectRole('doctor')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Enter Doctor Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* DEMO HIGHLIGHT BANNER */}
        <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <span>
              <strong>Cross-Role Live Sync Demo:</strong> When a patient logs a daily symptom or voice check-in, the data synchronizes instantly to the doctor's chart!
            </span>
          </div>
          <button
            onClick={() => onOpenAuth('patient')}
            className="text-teal-700 hover:text-teal-900 font-bold underline shrink-0"
          >
            Sign in with email &rarr;
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Vitalist Chronic Health Platform &copy; 2026. Designed for patient and provider collaboration.</p>
        <p className="text-[10px] text-slate-400 mt-1">Connected to Firebase Project carepulse-414fb</p>
      </footer>
    </div>
  );
}
