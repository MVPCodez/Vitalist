import React from 'react';
import { Activity, Bell, LogOut, User, Stethoscope, ArrowLeftRight } from 'lucide-react';
import { logOut } from '../../firebase/auth';
import NavTabs from './NavTabs';

export default function Header({
  user,
  userRole,
  activeTab,
  setActiveTab,
  notificationsEnabled,
  setNotificationsEnabled,
  onOpenAuth,
  onSwitchRole,
  onLogoutSuccess,
}) {
  const isDoctor = userRole === 'doctor';

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center gap-2">
        {/* Logo / Brand */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
          onClick={() => setActiveTab(isDoctor ? 'doctor-portal' : 'dashboard')}
        >
          <div className="bg-white p-1.5 sm:p-2 rounded-xl text-blue-600 shadow-inner">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">Vitalist</h1>
              <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isDoctor ? 'bg-amber-400 text-slate-900' : 'bg-emerald-400 text-slate-900'
              }`}>
                {isDoctor ? 'Doctor' : 'Patient'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-blue-100 line-clamp-1 max-w-[150px] xs:max-w-none">
              {isDoctor ? 'Provider Clinical Portal' : 'Chronic Care & Health Tracker'}
            </p>
          </div>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Switch Role Demo button (touch friendly on mobile too) */}
          <button
            onClick={onSwitchRole}
            className="flex items-center gap-1 text-[11px] sm:text-xs bg-blue-700/80 hover:bg-blue-700 px-2 sm:px-3 py-1.5 rounded-xl border border-blue-400/50 font-semibold transition text-blue-50"
            title="Switch between Patient and Doctor views"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">To {isDoctor ? 'Patient' : 'Doctor'}</span>
          </button>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`p-1.5 sm:p-2 rounded-lg transition ${
              notificationsEnabled
                ? 'bg-blue-500 text-yellow-300'
                : 'bg-blue-700 text-blue-200'
            }`}
            title="Toggle Alert Notifications"
            aria-label="Toggle notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-blue-50">
              {user?.displayName || (isDoctor ? 'Dr. Sarah Jenkins' : 'Active Patient')}
            </span>
            <span className="text-[10px] font-mono bg-blue-700 px-2 py-0.5 rounded text-blue-100 truncate max-w-[140px]">
              {user ? user.email || user.uid.substring(0, 10) + '...' : 'Guest Session'}
            </span>
          </div>

          {user ? (
            <button
              onClick={async () => {
                await logOut();
                if (onLogoutSuccess) onLogoutSuccess();
              }}
              className="flex items-center gap-1 text-[11px] sm:text-xs bg-blue-700 hover:bg-blue-800 px-2.5 sm:px-3 py-1.5 rounded-lg text-blue-50 font-medium transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 text-[11px] sm:text-xs bg-white text-blue-700 hover:bg-blue-50 px-2.5 sm:px-3.5 py-1.5 rounded-lg font-bold shadow transition"
            >
              <User className="w-3.5 h-3.5" /> <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
    </header>
  );
}
