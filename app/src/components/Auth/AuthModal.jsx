import React, { useState } from 'react';
import { Activity, Stethoscope, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { signInUser, signUpUser, signInAsGuest } from '../../firebase/auth';

export default function AuthModal({ isOpen, initialRole = 'patient', onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        const userCred = await signUpUser(email, password, name);
        onLoginSuccess(userCred.user, selectedRole);
      } else {
        const userCred = await signInUser(email, password);
        onLoginSuccess(userCred.user, selectedRole);
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Human-friendly Firebase error messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password. You can also use the Instant Demo buttons below.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const userCred = await signInAsGuest(role);
      onLoginSuccess(userCred.user, role);
    } catch (err) {
      console.error('Guest login error:', err);
      setErrorMsg('Demo sign-in error: ' + (err.message || 'Please check connection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col my-8">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 p-6 text-white text-center relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition text-xs font-bold"
            >
              ✕
            </button>
          )}
          <div className="w-14 h-14 bg-white/10 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-md mb-2 border border-white/20 shadow-inner">
            <Activity className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">CarePulse</h2>
          <p className="text-xs text-teal-200 mt-0.5">Chronic Care Health Management Platform</p>
        </div>

        {/* ROLE SELECTION TAB */}
        <div className="p-6 pb-2 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
              Choose Your Workspace Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                  selectedRole === 'patient'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedRole === 'patient' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Patient Portal</span>
                <span className="text-[10px] text-slate-400">Track logs &amp; voice AI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                  selectedRole === 'doctor'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-xl ${selectedRole === 'doctor' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Stethoscope className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Doctor Portal</span>
                <span className="text-[10px] text-slate-400">Clinical encounter review</span>
              </button>
            </div>
          </div>

          {/* INSTANT 1-CLICK DEMO BUTTONS */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                disabled={loading}
                className="py-2 px-3 bg-white hover:bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Demo Patient</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doctor')}
                disabled={loading}
                className="py-2 px-3 bg-white hover:bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Demo Doctor</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>

        {/* EMAIL / PASSWORD FORM */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'doctor' ? 'Dr. Sarah Jenkins' : 'Alex Johnson'}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <span>{isRegister ? `Create ${selectedRole === 'doctor' ? 'Doctor' : 'Patient'} Account` : `Sign In as ${selectedRole === 'doctor' ? 'Doctor' : 'Patient'}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg('');
              }}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
            >
              {isRegister
                ? 'Already have an account? Sign in here'
                : "Don't have an account? Sign up here"}
            </button>
          </div>
        </form>

        {/* SECURITY FOOTER */}
        <div className="bg-slate-50 border-t border-slate-100 p-3 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Connected to Firebase Authentication ({import.meta.env.VITE_FIREBASE_PROJECT_ID})</span>
        </div>
      </div>
    </div>
  );
}
