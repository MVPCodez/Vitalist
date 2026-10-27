import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
      <p>Vitalist &copy; 2026. Patient Chronic Care &amp; Health Monitoring.</p>
      <p className="text-[10px] mt-1 text-slate-400">
        Disclaimer: This application is for personal health tracking purposes and does
        not replace formal medical advice.
      </p>
    </footer>
  );
}
