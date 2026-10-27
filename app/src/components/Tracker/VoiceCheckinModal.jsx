import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Sparkles, Check, AlertCircle, RefreshCw, X, Volume2 } from 'lucide-react';
import { extractMetricsFromVoice } from '../../api/gemini';

export default function VoiceCheckinModal({ isOpen, onClose, currentForm = {}, onApplyMetrics, onDirectSubmit }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  const [logDate, setLogDate] = useState(() => {
    return currentForm?.date || new Date().toISOString().split('T')[0];
  });

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (currentForm?.date) {
      setLogDate(currentForm.date);
    }
  }, [currentForm?.date]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
      }
      setTranscript(currentTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access was denied. Please allow microphone permissions in your browser URL bar.');
      } else if (event.error === 'service-not-allowed') {
        setErrorMsg('Speech service blocked. Make sure you are running on localhost or HTTPS.');
      } else {
        setErrorMsg(`Speech recognition error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    setErrorMsg('');
    setExtractedData(null);
    
    if (!speechSupported || !recognitionRef.current) {
      setErrorMsg('Speech recognition is not supported in this browser (try Google Chrome or Microsoft Edge). You can type your notes below.');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Speech start error:', err);
      try {
        recognitionRef.current.stop();
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        setErrorMsg('Could not access microphone. Ensure permissions are enabled in browser settings.');
      }
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleProcessWithGemini = async () => {
    if (!transcript.trim()) {
      setErrorMsg('Please record or type something first.');
      return;
    }
    setErrorMsg('');
    setIsExtracting(true);
    try {
      const extracted = await extractMetricsFromVoice(transcript, currentForm);
      setExtractedData(extracted);
    } catch (err) {
      setErrorMsg(err.message || 'Error parsing voice summary.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmAndApply = () => {
    if (!extractedData) return;
    onApplyMetrics({
      ...extractedData,
      date: logDate,
    });
    onClose();
  };

  const handleOneClickSubmit = () => {
    if (!extractedData) return;
    onDirectSubmit({
      ...extractedData,
      date: logDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-100 flex flex-col my-4">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 p-4 sm:p-5 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">Low-Energy Voice Check-In</h3>
              <p className="text-[11px] sm:text-xs text-blue-100">Speak naturally. Fills your daily log.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="bg-white/20 text-white text-[11px] sm:text-xs px-2 py-1 rounded-lg border border-white/30 outline-none"
              title="Target Log Date"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          
          {/* BROWSER SUPPORT WARNING */}
          {!speechSupported && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>Your current browser does not support live speech recognition. You can type your notes manually below.</span>
            </div>
          )}

          {/* MICROPHONE ACTION BUTTON */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isRecording
                  ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              }`}
            >
              {isRecording ? <Square className="w-7 h-7 sm:w-8 sm:h-8 fill-current" /> : <Mic className="w-7 h-7 sm:w-8 sm:h-8" />}
              {isRecording && (
                <span className="absolute -inset-2 rounded-full border-2 border-rose-400 animate-ping opacity-75" />
              )}
            </button>
            <p className="mt-3 text-xs font-semibold text-slate-600">
              {isRecording ? 'Listening... Tap to finish' : 'Tap to start speaking'}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 text-center px-4">
              "e.g. Mild pain in knees, rating 4. Slept 7 hours, took morning medication..."
            </p>
          </div>

          {/* TRANSCRIPT DISPLAY OR MANUAL EDIT */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Voice Transcript</span>
              {transcript && (
                <button
                  onClick={() => setTranscript('')}
                  className="text-slate-400 hover:text-rose-500 text-[11px]"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows="3"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your voice transcript will appear here in real time, or you can type here..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* PARSE BUTTON */}
          {transcript && !extractedData && (
            <button
              type="button"
              onClick={handleProcessWithGemini}
              disabled={isExtracting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing your symptoms...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze &amp; Extract Metrics
                </>
              )}
            </button>
          )}

          {/* EXTRACTED PREVIEW CARD */}
          {extractedData && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Auto-Detected Metrics</span>
              </div>
              <p className="text-xs text-slate-600 italic">
                "{extractedData.extractedSummary || 'Extracted metrics from your voice note.'}"
              </p>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] text-slate-400 block font-semibold">Pain</span>
                  <span className="text-sm font-bold text-rose-600">{extractedData.painLevel ?? '--'}/10</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] text-slate-400 block font-semibold">Fatigue</span>
                  <span className="text-sm font-bold text-amber-600">{extractedData.fatigueLevel ?? '--'}/10</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] text-slate-400 block font-semibold">Mood</span>
                  <span className="text-sm font-bold text-emerald-600">{extractedData.mood ?? '--'}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] text-slate-400 block font-semibold">Sleep</span>
                  <span className="text-xs font-bold text-slate-700">{extractedData.sleepHours ? `${extractedData.sleepHours}h` : '--'}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] text-slate-400 block font-semibold">Meds Taken</span>
                  <span className="text-xs font-bold text-slate-700">{extractedData.medsTaken ? 'Yes' : 'No'}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] text-slate-400 block font-semibold">Stress</span>
                  <span className="text-xs font-bold text-indigo-600">{extractedData.stress ?? '--'}/5</span>
                </div>
              </div>

              {extractedData.notes && (
                <div className="text-[11px] bg-white p-2.5 rounded-xl border border-blue-100 text-slate-700">
                  <span className="font-semibold text-slate-800">Generated Notes: </span>
                  {extractedData.notes}
                </div>
              )}

              {/* ACTION BUTTONS (STACK ON MOBILE) */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmAndApply}
                  className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition text-center"
                >
                  Review in Full Form
                </button>
                <button
                  type="button"
                  onClick={handleOneClickSubmit}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> 1-Click Save Log
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
