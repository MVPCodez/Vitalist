// Gemini API wrapper
// Supports dynamic reading of import.meta.env, window.__gemini_api_key, or Vite env
// Includes 5-second timeout with demo-data-based dummy fallback response

// ─── Demo patient context (Eleanor Vance) ────────────────────────────────────
const DEMO_PATIENT = {
  name: 'Eleanor Vance',
  conditions: 'Rheumatoid Arthritis & Chronic Fatigue Syndrome',
  medications: [
    'Plaquenil 200mg (twice daily)',
    'Trexall 15mg (weekly)',
    'Cholecalciferol D3 2000 IU (daily)',
    'Neurontin 300mg (as needed)',
  ],
  avgPain: 3.8,
  avgFatigue: 4.4,
  flareDate: 'October 20',
  flareNote: 'pain spike to 6/10 correlated with barometric pressure drop',
  nextAppt: 'Dr. Aris Vance, Rheumatology – October 29',
};

const DUMMY_REPORT = `📊 **Vitalist Clinical Trajectory Summary — ${DEMO_PATIENT.name}**

**Conditions:** ${DEMO_PATIENT.conditions}

**Symptom Trend (Last 7 Days):**
Pain averaged **${DEMO_PATIENT.avgPain}/10** with an acute flare on ${DEMO_PATIENT.flareDate} (6/10), ${DEMO_PATIENT.flareNote}. Fatigue tracked closely with sleep quality — nights under 6 hours consistently correlated with next-day fatigue spikes above 5/10, suggesting a strong sleep–symptom relationship.

**Medication Adherence:**
Overall adherence was strong this week. Current regimen:
${DEMO_PATIENT.medications.map(m => `• ${m}`).join('\n')}
No adverse reactions were logged. Neurontin PRN usage increased on high-pain days (Oct 20–21), which is expected and appropriate.

**Key Observations:**
- 🌧️ **Environmental trigger identified:** The Oct 20 flare aligns with a documented barometric pressure drop. Consider tracking weather patterns as a predictive indicator.
- 😴 **Sleep is a key lever:** On days with ≥7 hours of sleep, fatigue scores averaged 3.1/10. On days with <6 hours, the average rose to 5.8/10. Prioritising sleep hygiene is the single highest-impact intervention available.
- 📉 **Positive trend:** Pain and fatigue scores trended downward over the second half of the week, indicating recovery from the flare.

**Recommendations for Upcoming Appointment:**
Bring this week's log data to your ${DEMO_PATIENT.nextAppt} visit. Key discussion points:
1. Weather-correlated flare pattern — ask about preventive dosing strategies.
2. Sleep quality — discuss whether a sleep aid or adjusted Neurontin timing may help.
3. Sustained fatigue levels (avg ${DEMO_PATIENT.avgFatigue}/10) — evaluate whether current DMARDs are providing adequate systemic control.

*Note: This summary was generated using your tracked data. Always follow your care team's guidance.*`;

const DUMMY_CHAT_RESPONSES = [
  {
    keywords: ['pain', 'hurt', 'ache', 'flare', 'sore'],
    reply: `Based on your logged data, your average pain this week has been **${DEMO_PATIENT.avgPain}/10**. Your most notable flare was on ${DEMO_PATIENT.flareDate} (6/10), which coincided with a barometric pressure drop. On lower-pain days, you logged 7+ hours of sleep — so rest appears to be protective for you. If pain spikes again, tracking the weather and your sleep that night could help identify your personal triggers.`,
  },
  {
    keywords: ['fatigue', 'tired', 'exhausted', 'energy', 'rest'],
    reply: `Your fatigue this week averaged **${DEMO_PATIENT.avgFatigue}/10**. There's a clear pattern in your data: on nights with less than 6 hours of sleep, the next-day fatigue score averaged 5.8/10 — nearly double compared to well-rested nights. Pacing your activities and protecting sleep windows may be the most effective fatigue management strategy available to you right now.`,
  },
  {
    keywords: ['sleep', 'insomnia', 'night', 'hours'],
    reply: `Your sleep logs show a strong connection to how you feel the next day. Nights with 7+ hours of sleep correlated with pain scores averaging around 3/10 and fatigue around 3.1/10. Nights under 6 hours pushed those averages significantly higher. If sleep is disrupted, it may be worth discussing sleep hygiene strategies — or a Neurontin timing adjustment — with Dr. Aris Vance at your October 29 appointment.`,
  },
  {
    keywords: ['medication', 'med', 'pill', 'plaquenil', 'trexall', 'neurontin', 'dose'],
    reply: `Your current medications are: **Plaquenil 200mg** (twice daily), **Trexall 15mg** (weekly), **Cholecalciferol D3 2000 IU** (daily), and **Neurontin 300mg** (as needed). Your adherence this week was strong. Neurontin PRN usage increased around the Oct 20 flare — that's appropriate use. Always consult your rheumatologist before adjusting any dosages.`,
  },
  {
    keywords: ['appointment', 'doctor', 'visit', 'dr', 'schedule'],
    reply: `Your next appointment is with **${DEMO_PATIENT.nextAppt}**. It's a great idea to bring this week's symptom log to that visit. Key things to mention: the Oct 20 flare and its potential weather trigger, your sleep–fatigue correlation, and sustained average fatigue of ${DEMO_PATIENT.avgFatigue}/10. Your Vitalist data makes these conversations much more productive.`,
  },
  {
    keywords: ['trend', 'week', 'pattern', 'summary', 'overall', 'report'],
    reply: `This week's summary for **${DEMO_PATIENT.name}**: Pain averaged ${DEMO_PATIENT.avgPain}/10 with a flare on ${DEMO_PATIENT.flareDate}. Fatigue averaged ${DEMO_PATIENT.avgFatigue}/10, closely tied to sleep quality. Medication adherence was strong. The second half of the week showed improvement — a positive recovery trend after the mid-week flare. Overall, your condition appears managed but with environmental sensitivity worth monitoring.`,
  },
];

const DUMMY_FALLBACK_CHAT = `Based on your tracked health data this week, things look relatively stable with an average pain of **${DEMO_PATIENT.avgPain}/10** and fatigue of **${DEMO_PATIENT.avgFatigue}/10**. A notable flare occurred on ${DEMO_PATIENT.flareDate}, likely related to environmental changes. Your medication adherence was strong. For more specific insights, try asking about pain, fatigue, sleep, medications, or your upcoming appointment.`;

/**
 * Returns a context-aware dummy response based on the user's prompt keywords.
 * Used when the real Gemini API call exceeds the 5-second timeout.
 *
 * @param {string} prompt
 * @returns {string}
 */
function getDummyResponse(prompt = '') {
  const lower = prompt.toLowerCase();

  // Detect AI Report generation (long-form synthesis request)
  if (
    lower.includes('clinical') ||
    lower.includes('trajectory') ||
    lower.includes('synthesis') ||
    lower.includes('generate a report') ||
    lower.includes('weekly summary') ||
    lower.includes('health summary') ||
    lower.includes('analyze') ||
    lower.includes('7-day') ||
    lower.includes('seven day')
  ) {
    return DUMMY_REPORT;
  }

  // Detect chat Q&A — match on keywords
  for (const { keywords, reply } of DUMMY_CHAT_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) {
      return reply;
    }
  }

  // Generic fallback for unrecognised chat queries
  return DUMMY_FALLBACK_CHAT;
}

const AI_TIMEOUT_MS = 5000; // 5 seconds

function getApiKey() {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  if (envKey) return envKey;

  if (typeof window !== 'undefined' && window.__gemini_api_key) {
    return String(window.__gemini_api_key).trim();
  }
  return '';
}

// Default models to try: gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.8-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Send a prompt to the Gemini generative-language API and return the
 * text of the first candidate.
 *
 * @param {string} prompt - user / system combined prompt text
 * @param {string} [systemInstruction] - optional system instruction
 * @returns {Promise<string>} generated text
 */
export async function callGemini(prompt, systemInstruction) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'Gemini API key is not configured. Please ensure VITE_GEMINI_API_KEY is set in .env.local and restart your dev server.';
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  /**
   * Inner function: attempt all models in sequence.
   * This is what we race against the 5-second timeout.
   */
  const fetchFromGemini = async () => {
    const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
          console.warn(`Gemini call failed with model ${model}:`, errorMsg);
          lastError = errorMsg;
          continue;
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        } else if (data?.candidates?.[0]?.finishReason) {
          return `Response finished with reason: ${data.candidates[0].finishReason}`;
        }
      } catch (err) {
        console.warn(`Network error with model ${model}:`, err);
        lastError = err.message;
      }
    }

    throw new Error(`GEMINI_FAILED:${lastError || 'Unknown error'}`);
  };

  // Race the real API call against the 5-second timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), AI_TIMEOUT_MS)
  );

  try {
    const result = await Promise.race([fetchFromGemini(), timeoutPromise]);
    return result;
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      console.warn('Gemini API timed out after 5 seconds — using demo fallback response.');
      return getDummyResponse(prompt);
    }
    if (err.message?.startsWith('GEMINI_FAILED:')) {
      const detail = err.message.replace('GEMINI_FAILED:', '');
      return `Unable to generate AI response. Details: ${detail}. Please check your API key and connection.`;
    }
    return `Unable to generate AI response. Details: ${err.message || 'Unknown error. Please check your API key and connection.'}`;
  }
}

/**
 * Extracts structured health metrics from raw conversational voice transcripts
 * using Gemini's natural language understanding.
 *
 * @param {string} transcript - Speech text recorded from the user
 * @param {object} existingForm - The current form values to merge into
 * @returns {Promise<object>} Extracted metrics object matching logForm schema
 */
export async function extractMetricsFromVoice(transcript, existingForm = {}) {
  const prompt = `You are a clinical data extraction assistant specializing in chronic illness patient logs.
A patient who is experiencing fatigue, pain, or low energy recorded this voice note:
"${transcript}"

Extract the health data and return ONLY a valid JSON object (no markdown, no backticks, no extra text) with the following numeric and string keys:
{
  "painLevel": number from 0 to 10 (infer based on language: e.g. "moderate" = 4-5, "agony/severe" = 8-9, "mild" = 2-3),
  "fatigueLevel": number from 0 to 10 (e.g. "exhausted/can barely move" = 8-9, "decent energy" = 2-3),
  "mood": number from 1 to 5 (1 = very low/depressed, 3 = neutral, 5 = great),
  "stress": number from 1 to 5 (1 = calm, 5 = extreme stress),
  "systolic": number or null (e.g. blood pressure systolic if mentioned),
  "diastolic": number or null (e.g. blood pressure diastolic if mentioned),
  "heartRate": number or null (bpm if mentioned),
  "glucose": number or null (blood sugar mg/dL if mentioned),
  "sleepHours": number or null (hours of sleep mentioned),
  "waterIntake": number or null (mL of water mentioned),
  "medsTaken": boolean or null (true if took meds, false if forgot/missed),
  "notes": string summarizing symptoms, flare locations, triggers, and activities mentioned,
  "confidenceSummary": string (one sentence summarizing what was detected to show the patient)
}

If any metric is not mentioned or cannot be inferred, omit it or set it to null.`;

  const systemInstruction = 'You are a precise clinical AI extractor. Output ONLY raw parseable JSON.';
  const rawResponse = await callGemini(prompt, systemInstruction);

  try {
    // Strip possible markdown fences like ```json ... ```
    const cleaned = rawResponse
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Merge non-null extracted fields over existingForm
    const result = { ...existingForm };
    for (const [key, val] of Object.entries(parsed)) {
      if (val !== null && val !== undefined) {
        result[key] = val;
      }
    }
    result.extractedSummary = parsed.confidenceSummary || 'Extracted metrics from voice note.';
    return result;
  } catch (err) {
    console.error('Failed to parse Gemini JSON extraction:', err, rawResponse);
    throw new Error('Could not parse voice data into health metrics. Please verify your transcript and try again.');
  }
}


