import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, appId } from '../firebase/config';

/**
 * Real-time Firestore hook for a per-user sub-collection.
 *
 * @param {string|null} userId - Firebase UID (null while unauthenticated)
 * @param {string} collectionName - e.g. 'healthLogs', 'medications'
 * @param {Array} fallbackData - data used when Firestore is empty or user is null
 * @param {object} [options]
 * @param {function} [options.sort] - comparator passed to Array.sort
 */
export function useFirestore(userId, collectionName, fallbackData = [], options = {}) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  // Resolve the Firestore collection path
  const getColRef = () =>
    collection(db, 'artifacts', appId, 'users', userId, collectionName);

  useEffect(() => {
    if (!userId) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    const colRef = getColRef();

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          let docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (options.sort) {
            docs.sort(options.sort);
          }
          setData(docs);
        } else {
          // Seed initial data into Firestore
          fallbackData.forEach(async (item) => {
            try {
              await addDoc(colRef, item);
            } catch (err) {
              console.error(`Error seeding ${collectionName}:`, err);
            }
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Firestore ${collectionName} error:`, err);
        setLoading(false);
      }
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, collectionName]);

  // --- Mutation helpers ---

  const add = async (item) => {
    // Optimistically update local state so UI updates immediately
    setData((prev) => {
      const next = [{ ...item, id: Date.now().toString() }, ...prev];
      if (options.sort) next.sort(options.sort);
      return next;
    });

    if (userId) {
      try {
        await addDoc(getColRef(), item);
      } catch (err) {
        console.warn(`Firestore addDoc failed (${collectionName}):`, err.message);
      }
    }
  };

  const update = async (docId, fields) => {
    // Optimistically update local state
    setData((prev) => {
      const next = prev.map((d) => (d.id === docId ? { ...d, ...fields } : d));
      if (options.sort) next.sort(options.sort);
      return next;
    });

    if (userId) {
      try {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', userId, collectionName, docId),
          fields
        );
      } catch (err) {
        console.warn(`Firestore updateDoc failed (${collectionName}):`, err.message);
      }
    }
  };

  const remove = async (docId) => {
    setData((prev) => prev.filter((d) => d.id !== docId));
    if (userId) {
      try {
        await deleteDoc(
          doc(db, 'artifacts', appId, 'users', userId, collectionName, docId)
        );
      } catch (err) {
        console.warn(`Firestore deleteDoc failed (${collectionName}):`, err.message);
      }
    }
  };

  return { data, loading, add, update, remove };
}
