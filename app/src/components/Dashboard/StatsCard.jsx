import React from 'react';

/**
 * Reusable stat card for the dashboard grid, optimized for mobile screens.
 */
export default function StatsCard({ title, icon, value, suffix, subtitle, subtitleColor = 'text-slate-500' }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate mr-1">{title}</span>
        <div className="shrink-0">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1 sm:gap-2">
        <span className="text-xl sm:text-2xl font-bold text-slate-800">{value}</span>
        {suffix && <span className="text-[10px] sm:text-xs text-slate-400">{suffix}</span>}
      </div>
      {subtitle && (
        <div className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium leading-tight ${subtitleColor}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
