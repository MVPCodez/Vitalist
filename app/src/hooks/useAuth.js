import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { initAuth } from '../firebase/auth';

/**
 * Hook that manages Firebase authentication lifecycle.
 *
 * Returns { user, loading } where `user` is the Firebase User object
 * (or null when signed-out / still loading).
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kick off sign-in
    initAuth().finally(() => setLoading(false));

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
