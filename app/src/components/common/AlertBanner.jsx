import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AlertBanner({ onViewSchedule }) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold">Reminder:</span> You have 1 pending evening
          medication (Vitamin D3) and an upcoming Rheumatology appointment on Oct 24th.
        </p>
      </div>
      <button
        onClick={onViewSchedule}
        className="w-full sm:w-auto text-center text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-3.5 py-1.5 rounded-lg shrink-0 transition"
      >
        View Schedule
      </button>
    </div>
  );
}
