import React, { useState } from 'react';
import { Activity, Heart, FileText, Mic, Sparkles } from 'lucide-react';
import VoiceCheckinModal from './VoiceCheckinModal';

export default function TrackerForm({ logForm, setLogForm, onSave, onCancel, onDirectSubmit }) {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const handleChange = (field, value) => {
    setLogForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyVoiceMetrics = (metrics) => {
    setLogForm((prev) => ({
      ...prev,
      ...metrics,
    }));
  };

  const boardSections = [
    {
      title: 'Today',
      notes: [
        { id: 1, title: 'Medication', text: 'Take vitamin D at 8:00 AM', color: 'bg-yellow-200' },
        { id: 2, title: 'Hydration', text: 'Goal: 2L water before 6 PM', color: 'bg-cyan-200' },
      ],
    },
    {
      title: 'This Week',
      notes: [
        { id: 3, title: 'Appointment', text: 'Rheumatology follow-up on Friday', color: 'bg-pink-200' },
        { id: 4, title: 'Check-in', text: 'Review symptom triggers with doctor', color: 'bg-orange-200' },
      ],
    },
    {
      title: 'Mood',
      notes: [
        { id: 5, title: 'Mood', text: 'Felt calmer after a rest break', color: 'bg-green-200' },
        { id: 6, title: 'Stress', text: 'Lower stress after stretching routine', color: 'bg-violet-200' },
      ],
    },
    {
      title: 'Questions',
      notes: [
        { id: 7, title: 'Follow-up', text: 'Ask doctor about fatigue triggers', color: 'bg-blue-200' },
        { id: 8, title: 'Goal', text: 'Track sleep quality more closely', color: 'bg-emerald-200' },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sm:space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Daily Health Entry</h2>
          <p className="text-xs text-slate-500">Record symptoms, vitals, mood, and daily metrics.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="flex-1 sm:flex-none justify-center px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            title="Voice Check-in"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Check-in</span>
          </button>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
            <label className="text-[11px] font-semibold text-slate-600">Date:</label>
            <input
              type="date"
              value={logForm.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="px-1 py-0.5 border-0 bg-transparent text-xs font-medium focus:ring-0 outline-none"
            />
          </div>
        </div>
      </div>

      <VoiceCheckinModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentForm={logForm}
        onApplyMetrics={handleApplyVoiceMetrics}
        onDirectSubmit={onDirectSubmit || onSave}
      />

      <form onSubmit={onSave} className="space-y-5 sm:space-y-6">
        {/* SYMPTOM SEVERITY */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" /> Symptom Severity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50 p-3.5 sm:p-4 rounded-xl">
            {/* Pain */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Pain Level</span>
                <span className="text-rose-600 font-bold">{logForm.painLevel} / 10</span>
              </div>
              <input
                type="range" min="0" max="10"
                value={logForm.painLevel}
                onChange={(e) => handleChange('painLevel', e.target.value)}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>None (0)</span><span>Moderate (5)</span><span>Severe (10)</span>
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
                onChange={(e) => handleChange('fatigueLevel', e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Energized</span><span>Moderate</span><span>Exhausted</span>
              </div>
            </div>
          </div>
        </div>

        {/* MOOD & MENTAL WELL-BEING */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-blue-600" /> Mood &amp; Mental Well-being
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50 p-3.5 sm:p-4 rounded-xl">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Overall Mood</span>
                <span className="text-emerald-600 font-bold">{logForm.mood} / 5</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={logForm.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Low (1)</span><span>Neutral (3)</span><span>Great (5)</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Stress Level</span>
                <span className="text-indigo-600 font-bold">{logForm.stress} / 5</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={logForm.stress}
                onChange={(e) => handleChange('stress', e.target.value)}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Calm (1)</span><span>Moderate (3)</span><span>High (5)</span>
              </div>
            </div>
          </div>
        </div>

        {/* VITAL SIGNS & DAILY METRICS */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Vital Signs &amp; Daily Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 bg-slate-50 p-3.5 sm:p-4 rounded-xl">
            {[
              { label: 'BP Systolic (mmHg)', field: 'systolic' },
              { label: 'BP Diastolic (mmHg)', field: 'diastolic' },
              { label: 'Heart Rate (bpm)', field: 'heartRate' },
              { label: 'Blood Glucose (mg/dL)', field: 'glucose' },
              { label: 'Sleep (Hours)', field: 'sleepHours', step: '0.5' },
              { label: 'Water Intake (mL)', field: 'waterIntake', step: '100' },
            ].map(({ label, field, step }) => (
              <div key={field}>
                <label className="text-[11px] sm:text-xs font-semibold text-slate-700 block mb-1">{label}</label>
                <input
                  type="number"
                  step={step}
                  value={logForm[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* JOURNAL NOTES */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
            Daily Notes &amp; Flare Observations
          </label>
          <textarea
            rows="3"
            value={logForm.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Record triggers, food intake, weather changes, or specific flare locations..."
            className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={(e) => {
              if (onSave) onSave(e);
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
          >
            Save Log Entry
          </button>
        </div>
      </form>

      {/* DAILY WHITEBOARD */}
      <div className="mt-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">Daily Whiteboard</h3>
          <span className="text-[10px] text-slate-500 font-medium">Quick Health Notes</span>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {boardSections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-slate-200 bg-white/80 p-3">
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-600">{section.title}</h4>
              <div className="space-y-2.5">
                {section.notes.map((note) => (
                  <div
                    key={note.id}
                    className={`${note.color} rounded-2xl p-3 shadow-sm border border-slate-200 rotate-[-1deg] min-h-[75px]`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-700">{note.title}</p>
                    <p className="mt-1 text-xs sm:text-sm text-slate-800 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
