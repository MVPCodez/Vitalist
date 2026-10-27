import React from 'react';
import {
  Activity,
  Edit3,
  Calendar as CalendarIcon,
  FileText,
  Pill,
  Sparkles,
  Share2,
  Stethoscope,
} from 'lucide-react';

const PATIENT_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'tracker', label: 'Daily Tracker', icon: Edit3 },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'analytics', label: 'Analytics', icon: FileText },
  { id: 'reminders', label: 'Care Plan', icon: Pill },
  { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  { id: 'share', label: 'Sharing', icon: Share2 },
  { id: 'doctor-portal', label: 'Doctor Portal', icon: Stethoscope },
];

const DOCTOR_TABS = [
  { id: 'doctor-portal', label: 'Provider Dashboard', icon: Stethoscope },
  { id: 'dashboard', label: 'Patient View Preview', icon: Activity },
];

export default function NavTabs({ activeTab, setActiveTab, userRole = 'patient' }) {
  const isDoctor = userRole === 'doctor';
  const visibleTabs = isDoctor ? DOCTOR_TABS : PATIENT_TABS;

  return (
    <nav 
      aria-label="Main Navigation" 
      className="bg-blue-700 border-t border-blue-500/50 shadow-inner"
    >
      <div 
        role="tablist" 
        className="max-w-7xl mx-auto px-2 sm:px-4 flex overflow-x-auto space-x-1 sm:space-x-3 no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 outline-none shrink-0 ${
                isActive
                  ? 'border-white text-white bg-blue-600 font-semibold'
                  : 'border-transparent text-blue-100 hover:text-white hover:bg-blue-600/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
