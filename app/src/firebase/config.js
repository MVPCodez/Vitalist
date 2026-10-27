import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// In production, use environment variables (import.meta.env.VITE_FIREBASE_*)
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDigBEPt78LS2ddH0_lHrxvMiDq84f7cG4',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'carepulse-414fb.firebaseapp.com',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'carepulse-414fb',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'carepulse-414fb.firebasestorage.app',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1012375502923',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1012375502923:web:71a588fc30cc0cbe270dce',
    };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId =
  typeof __app_id !== 'undefined' ? __app_id : 'carepulse-health-tracker';

export default app;
