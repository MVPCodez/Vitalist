import {
  signInAnonymously,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Initialize authentication with optional custom token or anonymous sign-in.
 */
export async function initAuth() {
  try {
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    }
  } catch (err) {
    console.error('Auth initialization error:', err);
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Register a new user with Email and Password
 */
export async function signUpUser(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
}

/**
 * Quick Guest / Demo sign-in
 */
export async function signInAsGuest(role = 'patient') {
  const credential = await signInAnonymously(auth);
  if (credential.user) {
    await updateProfile(credential.user, {
      displayName: role === 'doctor' ? 'Dr. Sarah Jenkins' : 'Demo Patient'
    });
  }
  return credential;
}

/**
 * Sign the current user out.
 */
export function logOut() {
  return firebaseSignOut(auth);
}

