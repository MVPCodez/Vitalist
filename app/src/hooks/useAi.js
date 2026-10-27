import { useState } from 'react';
import { callGemini } from '../api/gemini';

/**
 * Hook that wraps the Gemini API with loading / error state.
 */
export function useAi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (prompt, systemInstruction) => {
    setLoading(true);
    setError(null);
    try {
      const text = await callGemini(prompt, systemInstruction);
      return text;
    } catch (err) {
      console.error('Gemini AI error:', err);
      setError(err.message || 'Unknown error');
      return 'Error generating AI insights. Please retry shortly.';
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
}
