import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayCell from './DayCell';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getAverage = (entries, field) => {
  const values = entries
    .map((entry) => entry[field])
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map(Number)
    .filter(Number.isFinite);

  return values.length
    ? (values.reduce((total, value) => total + value, 0) / values.length).toFixed(1)
    : '—';
};

export default function CalendarView({ logs, setLogForm, setActiveTab }) {
  const [calendarView, setCalendarView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthLabel = selectedDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
  const visibleDates = calendarView === 'week'
    ? Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
      })
    : [selectedDate];
  const periodStart = calendarView === 'week' ? formatDate(weekStart) : formatDate(selectedDate);
  const periodEnd = formatDate(visibleDates[visibleDates.length - 1]);
  const periodEntries = logs.filter((entry) => entry.date >= periodStart && entry.date <= periodEnd);
  const medicationEntries = periodEntries.filter((entry) => typeof entry.medsTaken === 'boolean');
  const medicationRate = medicationEntries.length
    ? `${Math.round((medicationEntries.filter((entry) => entry.medsTaken).length / medicationEntries.length) * 100)}%`
    : '—';

  const periodLabel = calendarView === 'week'
    ? `${weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} – ${visibleDates[6].toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const handleClickEntry = (entry) => {
    setSelectedDate(parseDate(entry.date));
    alert(
      `Log for ${entry.date}:\nPain: ${entry.painLevel}/10\nFatigue: ${entry.fatigueLevel}/10\nSleep: ${entry.sleepHours}h\nNotes: ${entry.notes || 'None'}`
    );
  };

  const handleClickEmpty = (dateString) => {
    setSelectedDate(parseDate(dateString));
    setLogForm((prev) => ({ ...prev, date: dateString }));
    setActiveTab('tracker');
  };

  const handleNavigate = (direction) => {
    setSelectedDate((date) => {
      if (calendarView === 'month') {
        return new Date(date.getFullYear(), date.getMonth() + direction, 1);
      }
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + direction * (calendarView === 'week' ? 7 : 1));
      return nextDate;
    });
  };

  return (
    <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Health Calendar</h2>
          <p className="text-xs text-slate-500">
            View severity trends and select any date to inspect details.
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {['month', 'week', 'day'].map((view) => (
            <button
              key={view}
              onClick={() => setCalendarView(view)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                calendarView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {calendarView === 'month' && (
        <div className="space-y-3 sm:space-y-4">
          {/* Month navigation */}
          <div className="flex justify-between items-center bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200">
            <button
              onClick={() => handleNavigate(-1)}
              className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-700 text-xs sm:text-sm">{monthLabel}</span>
            <button
              onClick={() => handleNavigate(1)}
              className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-slate-500">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: firstDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[54px] sm:min-h-[75px] rounded-lg sm:rounded-xl border border-dashed border-slate-200 bg-slate-50/20" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const dayNum = index + 1;
              const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const entry = logs.find((l) => l.date === dateString);

              return (
                <DayCell
                  key={dateString}
                  dayNum={dayNum}
                  entry={entry}
                  onClickEntry={handleClickEntry}
                  onClickEmpty={() => handleClickEmpty(dateString)}
                />
              );
            })}
          </div>
        </div>
      )}

      {(calendarView === 'week' || calendarView === 'day') && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200">
            <button
              onClick={() => handleNavigate(-1)}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
              title={`Previous ${calendarView}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-700 text-xs sm:text-sm text-center">{periodLabel}</span>
            <button
              onClick={() => handleNavigate(1)}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
              title={`Next ${calendarView}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* SUMMARY STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-center">
            {[
              { label: 'Entries', value: periodEntries.length },
              { label: 'Avg Pain', value: `${getAverage(periodEntries, 'painLevel')}/10` },
              { label: 'Avg Fatigue', value: `${getAverage(periodEntries, 'fatigueLevel')}/10` },
              { label: 'Avg Sleep', value: `${getAverage(periodEntries, 'sleepHours')}h` },
              { label: 'Meds Rate', value: medicationRate },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-3">
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase text-slate-500">{label}</p>
                <p className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          <div className={`grid gap-2.5 sm:gap-3 ${calendarView === 'week' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7' : 'grid-cols-1'}`}>
            {visibleDates.map((date) => {
              const dateString = formatDate(date);
              const dayEntries = logs.filter((entry) => entry.date === dateString);

              return (
                <section key={dateString} className="border border-slate-200 rounded-xl p-2.5 sm:p-3 space-y-2 bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-700">
                      {date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </h3>
                    <span className="text-[10px] text-slate-500">{dayEntries.length} entries</span>
                  </div>
                  {dayEntries.length ? dayEntries.map((entry) => (
                    <button
                      key={entry.id || `${entry.date}-${entry.notes}`}
                      onClick={() => handleClickEntry(entry)}
                      className="w-full text-left rounded-lg border border-slate-200 bg-slate-50 p-2 hover:bg-slate-100 transition"
                    >
                      <p className="text-[11px] font-semibold text-slate-800">
                        Pain {entry.painLevel}/10 &bull; Fatigue {entry.fatigueLevel}/10
                      </p>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        Sleep {entry.sleepHours ?? '—'}h &bull; Mood {entry.mood ?? '—'}/5
                      </p>
                      {entry.notes && <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{entry.notes}</p>}
                    </button>
                  )) : (
                    <div className="text-center py-2">
                      <p className="text-[10px] text-slate-400 mb-1">No entry</p>
                      <button
                        onClick={() => handleClickEmpty(dateString)}
                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-800"
                      >
                        + Add log
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
