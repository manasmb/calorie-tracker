import { useState, useRef, useCallback } from "react";
import { searchFood, getMealTypeByTime, parseAmountFromText } from "../foodDatabase";
import { getAllRecipes } from "../db";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are a calorie tracking voice assistant specialised in Indian food.
When the user describes what they ate, respond with EXACTLY two lines:
LINE 1: A JSON object only — {"food":"<food name>","quantity":<number>,"grams":<number or null>,"meal":"<breakfast|lunch|snack|dinner>"}
LINE 2: A short, warm spoken confirmation, e.g. "Got it! Logged 150 grams of chicken biryani for lunch."

Rules:
- If the user says grams/g/gm (e.g. "150 grams"), set grams to that number and quantity to null.
- Determine meal from words like "breakfast", "lunch", "dinner", "snack". If not mentioned, use null.
- Keep the spoken line under 15 words.
- Respond only in the format above — no extra text.`;

// Convert Float32 samples → base64-encoded Int16 PCM
function float32ToBase64PCM(float32) {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    int16[i] = Math.max(-32768, Math.min(32767, Math.round(float32[i] * 32767)));
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Play raw Int16 PCM (24 kHz, mono) returned by Gemini
function playPCMBase64(chunks) {
  if (!chunks.length) return;
  const arrays = chunks.map(b64 => {
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf;
  });
  const totalLen = arrays.reduce((s, a) => s + a.length, 0);
  const merged = new Uint8Array(totalLen);
  let off = 0;
  for (const a of arrays) { merged.set(a, off); off += a.length; }

  const sampleRate = 24000;
  const numSamples = merged.length / 2;
  const ctx = new AudioContext({ sampleRate });
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channel = buffer.getChannelData(0);
  const view = new DataView(merged.buffer);
  for (let i = 0; i < numSamples; i++) channel[i] = view.getInt16(i * 2, true) / 32768;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
}

// ── Fallback: browser Web Speech API ────────────────────────────────
function useBrowserSpeech(onFoodDetected, setTranscript, setStatus, setListening) {
  const recogRef = useRef(null);

  const start = useCallback(async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus("Speech not supported. Use Chrome."); return; }
    const recog = new SR();
    recog.lang = "en-IN";
    recog.interimResults = true;
    recog.continuous = false;
    recogRef.current = recog;
    let finalText = "";

    recog.onstart  = () => { setListening(true);  setStatus("Listening…"); setTranscript(""); };
    recog.onresult = (e) => {
      finalText = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(finalText);
    };
    recog.onend = async () => {
      setListening(false);
      if (!finalText) return;
      setStatus(`Processing: "${finalText}"`);
      const customs = await getAllRecipes();
      const meal = getMealTypeByTime();
      const { quantity, grams } = parseAmountFromText(finalText);
      const results = searchFood(finalText, customs);
      if (results.length === 1) {
        onFoodDetected({ food: results[0], quantity, grams, meal });
        setStatus(`✓ Logged ${results[0].name}${grams ? ` (${grams}g)` : ""} for ${meal}`);
      } else if (results.length > 1) {
        onFoodDetected({ food: null, candidates: results, quantity, grams, meal });
        setStatus(`Found ${results.length} matches — pick one below`);
      } else {
        setStatus("Couldn't identify the food. Try searching manually.");
      }
    };
    recog.onerror = (e) => { setListening(false); setStatus(`Error: ${e.error}`); };
    recog.start();
  }, [onFoodDetected, setTranscript, setStatus, setListening]);

  const stop = useCallback(() => { recogRef.current?.stop(); }, []);
  return { start, stop };
}

// ── Main component ───────────────────────────────────────────────────
export default function VoiceInput({ onFoodDetected }) {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus]         = useState("Tap the mic to log food by voice");

  const wsRef        = useRef(null);
  const streamRef    = useRef(null);
  const audioCtxRef  = useRef(null);
  const processorRef = useRef(null);
  const audioChunks  = useRef([]);
  const textBuffer   = useRef("");

  const fallback = useBrowserSpeech(onFoodDetected, setTranscript, setStatus, setListening);

  // ── Parse Gemini's structured text response ──────────────────────
  async function handleGeminiText(text) {
    textBuffer.current += text;
    const lines = textBuffer.current.split("\n");
    if (lines.length < 1) return;
    try {
      // Strip markdown code fences if present
      const jsonLine = lines[0].replace(/```json?|```/g, "").trim();
      const parsed = JSON.parse(jsonLine);
      const spoken = lines.slice(1).join(" ").trim();
      if (spoken) setTranscript(spoken);

      const customs   = await getAllRecipes();
      const meal      = parsed.meal || getMealTypeByTime();
      const grams     = parsed.grams ? Number(parsed.grams) : null;
      const quantity  = parsed.quantity ? Number(parsed.quantity) : 1;
      const results   = searchFood(parsed.food || "", customs);

      if (results.length >= 1) {
        onFoodDetected({ food: results[0], quantity, grams, meal });
        setStatus(`✓ Logged ${results[0].name}${grams ? ` (${grams}g)` : ""} for ${meal}`);
      } else if (parsed.food) {
        setStatus(`"${parsed.food}" not found — try searching manually.`);
      }
    } catch {
      // JSON not yet complete — wait for more chunks
    }
  }

  // ── Cleanup all resources ────────────────────────────────────────
  function cleanup() {
    try { processorRef.current?.disconnect(); } catch {}
    try { audioCtxRef.current?.close(); }       catch {}
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    try { wsRef.current?.close(); }             catch {}
    processorRef.current = null;
    audioCtxRef.current  = null;
    streamRef.current    = null;
    wsRef.current        = null;
  }

  // ── Start Gemini Live session ────────────────────────────────────
  async function startGeminiLive() {
    setStatus("Connecting to Gemini…");
    audioChunks.current = [];
    textBuffer.current  = "";

    let micStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setStatus("Microphone access denied.");
      return;
    }
    streamRef.current = micStream;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        setup: {
          model: "models/gemini-2.0-flash-live-001",
          generationConfig: {
            responseModalities: ["AUDIO", "TEXT"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
            }
          },
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
        }
      }));
    };

    ws.onmessage = async (event) => {
      let msg;
      try { msg = JSON.parse(event.data); } catch { return; }

      // Setup complete → start streaming mic
      if (msg.setupComplete) {
        setListening(true);
        setStatus("Listening… speak now");
        setTranscript("");

        const audioCtx = new AudioContext({ sampleRate: 16000 });
        audioCtxRef.current = audioCtx;

        // eslint-disable-next-line no-deprecated
        const processor = audioCtx.createScriptProcessor(2048, 1, 1);
        processorRef.current = processor;
        const source = audioCtx.createMediaStreamSource(micStream);

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const b64 = float32ToBase64PCM(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: b64 }]
            }
          }));
        };

        source.connect(processor);
        processor.connect(audioCtx.destination);
        return;
      }

      // Collect model response
      if (msg.serverContent?.modelTurn?.parts) {
        for (const part of msg.serverContent.modelTurn.parts) {
          if (part.text) await handleGeminiText(part.text);
          if (part.inlineData?.data) audioChunks.current.push(part.inlineData.data);
        }
      }

      // Turn complete → play audio response
      if (msg.serverContent?.turnComplete) {
        if (audioChunks.current.length > 0) {
          playPCMBase64(audioChunks.current);
          audioChunks.current = [];
        }
        cleanup();
        setListening(false);
      }
    };

    ws.onerror = () => {
      setStatus("Connection error — falling back to browser mic.");
      cleanup();
      setListening(false);
      fallback.start();
    };

    ws.onclose = (e) => {
      if (e.code !== 1000 && e.code !== 1005) {
        setStatus("Disconnected. Try again.");
        setListening(false);
      }
    };
  }

  function stopListening() {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        clientContent: { turnComplete: true }
      }));
    }
    // Mic stream stays open — server response will trigger cleanup
    setStatus("Processing…");
    setListening(false);
    // Stop audio capture immediately
    try { processorRef.current?.disconnect(); } catch {}
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
  }

  function handleClick() {
    if (listening) {
      stopListening();
      return;
    }
    if (API_KEY) {
      startGeminiLive();
    } else {
      fallback.start();
    }
  }

  return (
    <div className="voice-input">
      <button
        className={`mic-btn ${listening ? "mic-active" : ""}`}
        onClick={handleClick}
        aria-label="Voice input"
      >
        <span className="mic-icon">{listening ? "⏹" : "🎤"}</span>
        <span className="mic-label">{listening ? "Stop" : "Speak"}</span>
      </button>
      {transcript && <p className="transcript">"{transcript}"</p>}
      <p className="voice-status">{status}</p>
    </div>
  );
}
