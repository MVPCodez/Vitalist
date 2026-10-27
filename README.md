# Vitalist

**AI-Powered Chronic Disease Management and Patient Monitoring**

Vitalist is a chronic disease management app that helps patients track symptoms, monitor daily health metrics, manage medications, and prepare for doctor visits. It combines health tracking, data visualization, AI-generated insights, and voice-based check-ins in one place.

Vitalist also includes a doctor portal that gives healthcare providers a view of patient health logs, medication status, and appointments. Patient data is backed by Firebase Firestore, and AI features help users review health trends and prepare questions for their care team.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Application Structure](#application-structure)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Health Data Model](#health-data-model)
- [AI Features](#ai-features)
- [Patient and Doctor Workflows](#patient-and-doctor-workflows)
- [Privacy and Security](#privacy-and-security)
- [Medical Disclaimer](#medical-disclaimer)
- [Future Improvements](#future-improvements)

## Overview

Managing a chronic condition often means tracking symptoms, remembering medications, monitoring vital signs, and sharing health updates with a care team. These details can be hard to manage across separate tools.

Vitalist brings these tasks into one interface.

Patients can record daily symptoms and health metrics, review past entries, monitor medication adherence, and use AI tools to explore patterns in their data. Voice check-ins offer another way to record health information. Doctors can review the same patient record through a dedicated provider portal.

The goal is to make daily health tracking easier and help patients have more informed conversations with their clinicians.

## Features

### 1. Patient Dashboard

The dashboard provides an overview of the patient's health data and key metrics.

- View recent health logs.
- Monitor average pain and fatigue levels.
- Review medication adherence.
- Access the daily tracker and voice check-in.
- Navigate to other health management tools.

### 2. Daily Health Tracking

Patients can record health information for each day, including:

| Metric | Description |
|---|---|
| Pain level | Daily pain rating |
| Fatigue level | Daily fatigue rating |
| Mood | Self-reported mood |
| Stress | Self-reported stress level |
| Blood pressure | Systolic and diastolic readings |
| Heart rate | Heart rate measurement |
| Blood glucose | Blood glucose reading |
| Sleep | Hours of sleep |
| Water intake | Daily water intake |
| Medication status | Whether medications were taken |
| Notes | Additional symptoms or observations |
| Date | Date of the health entry |

If a patient saves another entry for a date that already exists, the app updates the existing entry rather than adding a second one.

### 3. Voice-Based Health Check-ins

Vitalist includes a voice check-in modal that can support hands-free health logging.

- Open a voice check-in from the dashboard.
- Apply captured health metrics to the daily tracker.
- Submit a completed health entry.
- Return to the dashboard after saving.

The voice modal is integrated through a shared callback interface. Speech recognition and metric extraction depend on the implementation of the voice check-in component and its supporting services.

### 4. Health Calendar

The calendar provides a date-based view of health logs.

Patients can review past entries and select a date to work with its health data. This helps users keep track of changes over time and connect daily experiences with their recorded metrics.

### 5. Health Analytics

The analytics view uses recorded health logs to help patients review their health data over time.

It receives the patient's logs and can display trends or comparisons based on the metrics collected by the tracker.

### 6. Medication Reminders

The medication view displays the patient's medication list and allows medication status to be updated.

- View medications.
- Mark a medication as taken or not taken for the day.
- Review the current medication adherence rate.

The current adherence calculation is based on the proportion of listed medications whose `takenToday` field is true. It is a simple status measure, not a full record of doses taken over time.

### 7. Appointment Management

The reminders section includes an appointment list to help patients keep their upcoming care visits in view.

Appointment data is loaded through the Firestore data hook and passed to the appointment component for display.

### 8. AI Health Insights

Vitalist uses an AI service to analyze recent health logs and generate a readable health summary.

The report prompt asks the model to identify:

- Symptom trends across pain, fatigue, and sleep.
- Potential patterns or triggers in the recorded data.
- Practical self-care and pacing ideas.
- Questions and notes to discuss with a doctor.

The generated report uses Markdown formatting to make the findings easier to review.

These insights are intended to help patients organize their observations, not to establish a diagnosis or prescribe treatment.

### 9. AI Health Assistant

The chat interface lets patients ask health-related questions.

The current implementation sends the user's question and a summary of up to five recent health logs to the AI service. The model is instructed to respond with empathy, use the available health context, and remind users to review advice with a clinician.

### 10. Patient Sharing and Doctor Portal

Vitalist includes a sharing panel and a dedicated doctor dashboard.

The sharing panel receives health logs, average pain, medication adherence, and a share code. It can also provide navigation to the doctor portal.

The doctor dashboard receives:

- Patient health logs.
- Medication data.
- Appointment data.
- The current sharing code.
- User and role information.

Both views use the same configured patient record ID in the current implementation. This lets updates to the shared Firestore record appear in both views when the data hook subscribes to changes or refreshes its data.

**Important:** The current shared record configuration is suitable for a prototype, but it must be replaced with properly authorized, patient-specific access before real patient data is used.

## Tech Stack

The following technologies are visible in the provided application code or are implied by its data flow.

- **React:** Component-based user interface and state management.
- **JavaScript (ES6+):** Application logic.
- **Firebase Firestore:** Persistent storage for health logs, medications, and appointments.
- **AI service:** Generates health reports and chat responses through the custom `useAi` hook.
- **Tailwind CSS:** Utility classes for layout, spacing, colors, and responsive design.

Additional dependencies may be used for authentication, charts, voice input, icons, and other interface elements. Check the project's package manifest to confirm the full list.

## Application Structure

The application separates its main interface, data access, and feature-specific components.

```text
src/
├── App.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useFirestore.js
│   └── useAi.js
├── data/
│   └── initialData.js
└── components/
    ├── common/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   └── AlertBanner.jsx
    ├── Auth/
    │   └── AuthModal.jsx
    ├── Home/
    │   └── LandingHome.jsx
    ├── Dashboard/
    │   └── Dashboard.jsx
    ├── Tracker/
    │   ├── TrackerForm.jsx
    │   └── VoiceCheckinModal.jsx
    ├── Calendar/
    │   └── CalendarView.jsx
    ├── Analytics/
    │   └── Analytics.jsx
    ├── Reminders/
    │   ├── MedReminders.jsx
    │   └── AppointmentList.jsx
    ├── AiInsights/
    │   ├── AiReport.jsx
    │   └── AiChat.jsx
    ├── Share/
    │   └── SharePanel.jsx
    └── Doctor/
        └── DoctorDashboard.jsx
```

*This tree illustrates the files imported by `App.jsx`. File extensions, additional files, and the actual directory layout may differ in your repository.*

### Main Application Responsibilities

| File | Responsibility |
|---|---|
| `App.jsx` | Main application state, navigation, data coordination, and view rendering |
| `useAuth` | Provides the current authentication state |
| `useFirestore` | Reads and updates Firestore-backed collections |
| `useAi` | Sends prompts to the AI service and returns generated text |
| `initialData.js` | Provides initial health logs, medications, and appointments |
| `Dashboard.jsx` | Displays the patient overview |
| `TrackerForm.jsx` | Collects daily health data |
| `VoiceCheckinModal.jsx` | Handles the voice check-in interface |
| `CalendarView.jsx` | Displays health logs by date |
| `Analytics.jsx` | Presents health data for analysis |
| `MedReminders.jsx` | Displays medications and their status |
| `AppointmentList.jsx` | Displays appointments |
| `AiReport.jsx` | Displays generated AI health reports |
| `AiChat.jsx` | Provides the AI chat interface |
| `SharePanel.jsx` | Handles the health-sharing interface |
| `DoctorDashboard.jsx` | Displays the provider-facing patient view |

## How It Works

### Data flow

1. The application checks the authentication state through `useAuth`.
2. Users enter the patient or doctor experience through the landing page and authentication flow.
3. The main app loads health logs, medications, and appointments through `useFirestore`.
4. Patients add or update health logs through the daily tracker or voice check-in.
5. The app updates the corresponding Firestore data.
6. Dashboard and doctor views receive the shared health data.
7. The AI service receives selected recent logs and a user prompt to generate a report or chat response.

### State management

React state manages navigation, form inputs, role selection, modal visibility, AI output, and chat messages.

The `useMemo` hook calculates average pain, average fatigue, and medication adherence from the current data.

### Health log updates

The daily log handler checks whether a log already exists for the selected date.

- If a matching date exists, it updates that record.
- Otherwise, it adds a new record.

This approach is intended to keep one health log per day within the active patient record.

## Getting Started

### Prerequisites

Before running the application, make sure you have:

- Node.js installed.
- npm or another package manager supported by the project.
- Access to the Firebase project used by the app.
- The required AI service credentials, if AI features need an external API.
- The project's source files and package manifest.

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with your repository URL and project folder.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root if your Firebase or AI configuration uses environment variables.

For example, a Vite project may use:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

These names are examples, not confirmed variable names from the supplied `App.jsx`. Use the exact names expected by your Firebase setup and supporting hooks.

Configure the AI service according to the implementation of `useAi`. If it calls a third-party model API, keep private API keys on a trusted server rather than exposing them in client-side code.

### 4. Configure Firebase

In the Firebase console:

1. Create or select a Firebase project.
2. Set up Cloud Firestore.
3. Enable the authentication method required by `useAuth`.
4. Configure security rules for authorized access to patient data.
5. Add the Firebase configuration expected by the application.

The Firestore collections used by the app are:

- `healthLogs`
- `medications`
- `appointments`

The `useFirestore` hook controls how these collections are read and written. Check its implementation for the exact document structure and collection paths.

### 5. Start the development server

For a Vite project, run:

```bash
npm run dev
```

For other React setups, use the development command defined in `package.json`.

Open the local URL printed in your terminal.

### 6. Build for production

For a project configured with Vite:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

These commands assume the project uses Vite. Check `package.json` if your project uses another build tool.

## Configuration

### Patient record

The current application uses a fixed record ID:

```js
const ACTIVE_PATIENT_RECORD_ID = 'primary-patient';
```

This ID is passed to the Firestore hooks for health logs, medications, and appointments.

It ensures that the patient and doctor views read from the same configured record. However, it does not create a secure link between an authenticated user and a patient record.

For a multi-user deployment, replace this approach with a patient-specific record ID resolved from the authenticated user's authorized account or sharing relationship.

### Initial data

The app imports default data from:

```js
import {
  initialLogs,
  initialMeds,
  initialAppointments
} from './data/initialData';
```

These values provide starting data to the Firestore hooks. Whether they are used as fallbacks, seeded into Firestore, or displayed when the database is empty depends on the `useFirestore` implementation.

### Notifications

The app stores a notification setting in React state:

```js
const [notificationsEnabled, setNotificationsEnabled] = useState(true);
```

When enabled, the app renders an alert banner. This state alone does not establish browser push notifications or scheduled medication alerts.

### Authentication and roles

The app tracks a user role of either `patient` or `doctor` and uses it to select the active view.

The role controls the interface shown by the application. It should not be treated as a security boundary on its own. The authentication and backend rules must enforce what each user is allowed to read or change.

## Health Data Model

The tracker uses a health log object with fields similar to the following:

```js
{
  date: "YYYY-MM-DD",
  painLevel: 3,
  fatigueLevel: 3,
  mood: 4,
  stress: 3,
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  glucose: 95,
  sleepHours: 7,
  waterIntake: 2000,
  notes: "",
  medsTaken: true
}
```

These values are examples of the default form state, not medical targets or recommended values.

A medication record needs an `id` and a `takenToday` field for the medication toggle and adherence calculation to work as written. Other medication fields depend on the medication components and initial data.

Appointment fields depend on the `AppointmentList` and `DoctorDashboard` implementations.

## AI Features

Vitalist uses two AI workflows.

### Health report generation

The report generator sends up to seven recent logs to the model and requests a summary of symptom trends, possible triggers, self-care pacing ideas, and questions for a clinician.

The report is based on the logs supplied to the model. It may miss relevant factors or identify patterns that are not clinically meaningful.

### Health chat

The chat workflow sends up to five recent logs alongside the user's question.

The AI response is added to the conversation and displayed in the chat interface. In the supplied implementation, the chat history is held in React state and is not shown being persisted across sessions.

### Responsible use

AI-generated content is not a diagnosis and should not replace professional medical advice. Correlations in a small set of health logs do not establish cause and effect.

Users should verify health advice with a qualified clinician, especially before making changes to medications, treatment plans, or care routines.

## Patient and Doctor Workflows

### Patient workflow

1. Open the application.
2. Choose the patient experience and sign in if required.
3. Review the dashboard.
4. Enter daily symptoms and health measurements.
5. Use voice check-in if desired.
6. Review the calendar and analytics.
7. Track medication status and appointments.
8. Generate an AI health report or ask the AI assistant a question.
9. Use the sharing interface to support a discussion with a healthcare provider.

### Doctor workflow

1. Open the application and select the doctor experience.
2. Complete the required authentication flow.
3. Open the doctor portal.
4. Review the available patient logs, medications, and appointments.
5. Use the available health summaries to support a clinical discussion.

The supplied application code wires these views together, but it does not by itself confirm that separate patient accounts, doctor permissions, or a secure consent-based sharing process are fully implemented.

## Privacy and Security

Vitalist handles health-related data, so privacy and access control must be core design requirements.

Before using the app with real patient data:

- Require authentication for protected views and data operations.
- Enforce patient-specific access in Firestore security rules or a trusted backend.
- Verify that doctors can access only records they are authorized to view.
- Replace the shared hard-coded patient record ID with a secure patient-to-account mapping.
- Protect sharing codes and validate them on a trusted backend.
- Keep AI service credentials out of client-side code.
- Limit the health data sent to AI services to what is needed for the requested task.
- Avoid logging sensitive health information in browser consoles or server logs.
- Define retention, deletion, and consent policies for patient records.
- Review applicable health privacy laws and security requirements before deployment.

The current `App.jsx` also defines a default sharing code. A fixed code in client-side code is not a secure way to grant access to medical records.

These are important production requirements. The provided component wiring alone does not establish compliance with HIPAA or any other privacy standard.

## Medical Disclaimer

Vitalist is a health tracking and informational support tool. It is not a medical device, diagnostic system, or substitute for a licensed healthcare professional.

The app's calculations and AI-generated insights may contain errors and should not be used alone to make medical decisions. Patients should consult their care team before changing treatment or medication.

The app is not designed to handle medical emergencies. Seek emergency care for urgent or life-threatening symptoms.

## Future Improvements

Potential next steps include:

- **Personalized patient records:** Link each account to its own authorized health record.
- **Secure sharing:** Add consent-based access, expiring share links, and server-side permission checks.
- **Long-term analytics:** Track trends across weeks and months, with clear limits on what the data can show.
- **Medication schedules:** Add dose-level tracking, time-based reminders, and adherence history.
- **Appointment tools:** Support appointment creation, editing, and calendar integration.
- **AI report history:** Save reports with timestamps and let patients compare them over time.
- **Voice accessibility:** Improve speech input, confirmation of extracted metrics, and support for users with different speech patterns.
- **Data export:** Let patients export health logs for review with their clinicians.
- **Testing:** Add unit tests for health calculations, integration tests for Firestore operations, and end-to-end tests for patient and doctor workflows.
- **Accessibility:** Test keyboard navigation, screen-reader support, contrast, and mobile layouts.
- **Clinical validation:** Evaluate the usefulness and safety of AI insights with qualified clinicians before making clinical claims.

## Project Status

Vitalist includes the main interface and component wiring for chronic disease tracking, medication status, appointment viewing, AI-assisted health summaries, and a doctor-facing dashboard.

The completeness of authentication, live data synchronization, voice processing, AI integration, and security depends on the supporting hooks, components, backend configuration, and Firebase rules.

Vitalist is intended to support better health tracking and more informed conversations between patients and their care teams.
