// Initial mock data seeded for new users

export const initialLogs = [
  { id: '1', date: '2026-10-11', painLevel: 3, fatigueLevel: 4, mood: 4, stress: 3, systolic: 118, diastolic: 76, heartRate: 72, glucose: 95, sleepHours: 7.5, waterIntake: 2000, notes: 'Felt well in the morning. Minor stiffness in knees around 4 PM.', medsTaken: true },
  { id: '2', date: '2026-10-12', painLevel: 5, fatigueLevel: 6, mood: 3, stress: 5, systolic: 122, diastolic: 80, heartRate: 78, glucose: 102, sleepHours: 6.0, waterIntake: 1500, notes: 'Rainy day, joint flare up. Took extra heat pack.', medsTaken: true },
  { id: '3', date: '2026-10-13', painLevel: 4, fatigueLevel: 5, mood: 3, stress: 4, systolic: 120, diastolic: 78, heartRate: 74, glucose: 98, sleepHours: 6.8, waterIntake: 1800, notes: 'Rested in afternoon. Fatigue slightly improved.', medsTaken: false },
  { id: '4', date: '2026-10-14', painLevel: 2, fatigueLevel: 3, mood: 5, stress: 2, systolic: 116, diastolic: 74, heartRate: 68, glucose: 92, sleepHours: 8.0, waterIntake: 2200, notes: 'Great day overall! Light walking for 20 mins.', medsTaken: true },
  { id: '5', date: '2026-10-15', painLevel: 6, fatigueLevel: 7, mood: 2, stress: 6, systolic: 125, diastolic: 82, heartRate: 82, glucose: 110, sleepHours: 5.2, waterIntake: 1200, notes: "High fatigue and brain fog. Couldn't focus much.", medsTaken: true },
  { id: '6', date: '2026-10-16', painLevel: 4, fatigueLevel: 4, mood: 4, stress: 3, systolic: 119, diastolic: 77, heartRate: 71, glucose: 96, sleepHours: 7.2, waterIntake: 2000, notes: 'Stabilizing after rest. Took all morning medications on time.', medsTaken: true },
];

export const initialMeds = [
  { id: 'm1', name: 'Hydroxychloroquine', dosage: '200 mg', frequency: 'Daily (Morning)', time: '08:00', takenToday: true },
  { id: 'm2', name: 'Methotrexate', dosage: '15 mg', frequency: 'Weekly (Saturdays)', time: '09:00', takenToday: true },
  { id: 'm3', name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Daily (Morning)', time: '08:00', takenToday: false },
  { id: 'm4', name: 'Gabapentin', dosage: '300 mg', frequency: 'As Needed (Night)', time: '21:00', takenToday: false },
];

export const initialAppointments = [
  { id: 'a1', doctor: 'Dr. Sarah Jenkins', specialty: 'Rheumatology', date: '2026-10-24', time: '10:30 AM', location: 'City Health Clinic - Suite 402', notes: 'Review quarterly bloodwork & flare frequency' },
  { id: 'a2', doctor: 'Dr. Robert Chen', specialty: 'Endocrinology', date: '2026-11-05', time: '02:00 PM', location: 'Telehealth Virtual Portal', notes: 'Check fasting glucose log and dosage review' },
];
