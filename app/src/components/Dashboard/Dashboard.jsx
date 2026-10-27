import React from 'react';
import { Activity, Clock, Pill, Sparkles, Plus, Mic } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import StatsCard from './StatsCard';

export default function Dashboard({
  logs,
  medications,
  avgPain,
  avgFatigue,
  medAdherence,
  setActiveTab,
  setLogForm,
  handleToggleMed,
  onOpenVoiceCheckin,
}) {
  const chartData = [...logs].reverse().slice(-7);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 text-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Welcome Back to Vitalist</h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Tracking daily symptoms builds longitudinal trends for informed discussions with your care team.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            onClick={onOpenVoiceCheckin}
            className="flex-1 sm:flex-none justify-center bg-blue-900/40 hover:bg-blue-900/60 border border-white/20 text-white font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow transition flex items-center gap-1.5"
            title="Low-Energy Voice Check-in"
          >
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-200" /> <span>Voice Log</span>
          </button>
          <button
            onClick={() => {
              setLogForm((prev) => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
              setActiveTab('tracker');
            }}
            className="flex-1 sm:flex-none justify-center bg-white text-blue-700 font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow hover:bg-blue-50 text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Log Entry</span>
          </button>
        </div>
      </div>

      {/* KEY STAT CARDS (2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <StatsCard
          title="Avg Pain (7d)"
          icon={<Activity className="w-4 h-4 text-rose-500" />}
          value={avgPain}
          suffix="/ 10"
          subtitle="Stable vs last week"
          subtitleColor="text-emerald-600"
        />
        <StatsCard
          title="Avg Fatigue"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
          value={avgFatigue}
          suffix="/ 10"
          subtitle="Moderate Energy"
          subtitleColor="text-amber-600"
        />
        <StatsCard
          title="Meds Adherence"
          icon={<Pill className="w-4 h-4 text-blue-600" />}
          value={`${medAdherence}%`}
          subtitle={`${medications.filter((m) => m.takenToday).length} of ${medications.length} taken`}
        />
        <StatsCard
          title="Logging Streak"
          icon={<Sparkles className="w-4 h-4 text-indigo-500" />}
          value={`${logs.length} Days`}
          subtitle="Keep up the routine!"
          subtitleColor="text-indigo-600"
        />
      </div>

      {/* CHART + TODAY'S MEDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 7-Day Symptom Trajectory */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">7-Day Symptom Trajectory</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Correlation between daily Pain level &amp; Fatigue
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Analytics &rarr;
            </button>
          </div>
          <div className="h-52 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Line type="monotone" dataKey="painLevel" name="Pain Level (0-10)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fatigueLevel" name="Fatigue (0-10)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sleepHours" name="Sleep (Hours)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TODAY'S MEDICATIONS QUICK LIST */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">Today's Medications</h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded font-semibold">
                {medications.filter((m) => m.takenToday).length} / {medications.length}
              </span>
            </div>
            <div className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
              {medications.map((med) => (
                <div
                  key={med.id}
                  onClick={() => handleToggleMed(med.id)}
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    med.takenToday
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${med.takenToday ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{med.name}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500">{med.dosage} &bull; {med.time}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={med.takenToday}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('reminders')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Manage Care Plan &amp; Reminders
          </button>
        </div>
      </div>

      {/* RECENT LOG RECAP */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg">Recent Health Journal Entries</h3>
          <button onClick={() => setActiveTab('calendar')} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
            View Full Calendar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3.5 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{log.date}</span>
                <span
                  className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    log.painLevel >= 6
                      ? 'bg-rose-100 text-rose-700'
                      : log.painLevel >= 4
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  Pain: {log.painLevel}/10
                </span>
              </div>
              <p className="text-xs text-slate-600 italic line-clamp-2">
                "{log.notes || 'No detailed journal notes added.'}"
              </p>
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Fatigue: {log.fatigueLevel}/10</span>
                <span>Sleep: {log.sleepHours}h</span>
                <span>BP: {log.systolic}/{log.diastolic}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
