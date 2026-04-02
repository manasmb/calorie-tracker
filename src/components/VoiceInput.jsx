import { useState, useRef } from "react";
import { searchFood, getMealTypeByTime, parseMealTypeFromText, parseAmountFromText } from "../foodDatabase";
import { getAllRecipes } from "../db";
import { getGlobalFoods } from "../globalFoods";
import { searchOpenFoodFacts } from "../openFoodFacts";

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-IN"; u.rate = 1.05;
  window.speechSynthesis.speak(u);
}

export default function VoiceInput({ onFoodDetected }) {
  const [listening,   setListening]   = useState(false);
  const [transcript,  setTranscript]  = useState("");
  const [status,      setStatus]      = useState("Tap the mic and speak");
  const recogRef = useRef(null);

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus("Not supported — use Chrome."); return; }
    const recog = new SR();
    recog.lang = "en-IN"; recog.interimResults = true; recog.continuous = false;
    recogRef.current = recog;
    let finalText = "";
    recog.onstart  = () => { setListening(true); setStatus("Listening…"); setTranscript(""); };
    recog.onresult = (e) => { finalText = Array.from(e.results).map(r => r[0].transcript).join(" "); setTranscript(finalText); };
    recog.onend    = async () => { setListening(false); if (!finalText) { setStatus("Didn't catch that. Try again."); return; } await processTranscript(finalText); };
    recog.onerror  = (e) => { setListening(false); setStatus(e.error === "not-allowed" ? "Mic permission denied." : `Error: ${e.error}`); };
    recog.start();
  }

  function stopListening() { recogRef.current?.stop(); }

  async function processTranscript(text) {
    setStatus(`Processing…`);
    const [customs, globals, offResults] = await Promise.all([getAllRecipes(), getGlobalFoods(), searchOpenFoodFacts(text)]);
    const allExtras = [...customs, ...globals];
    const meal    = parseMealTypeFromText(text) || getMealTypeByTime();
    const { quantity, grams } = parseAmountFromText(text);
    const customMatch = allExtras.find(r => text.toLowerCase().includes(r.name.toLowerCase()));
    if (customMatch) {
      onFoodDetected({ food: customMatch, quantity, grams, meal });
      const msg = confirmMsg(customMatch.name, quantity, grams, meal);
      setStatus(`✓ ${msg}`); speak(msg); return;
    }
    const localResults = searchFood(text, allExtras);
    const localNames   = new Set(localResults.map(f => f.name.toLowerCase()));
    const results      = [...localResults, ...offResults.filter(f => !localNames.has(f.name.toLowerCase()))];
    if (results.length === 1) {
      onFoodDetected({ food: results[0], quantity, grams, meal });
      const msg = confirmMsg(results[0].name, quantity, grams, meal);
      setStatus(`✓ ${msg}`); speak(msg);
    } else if (results.length > 1) {
      onFoodDetected({ food: null, candidates: results, quantity, grams, meal });
      setStatus(`Found ${results.length} matches — pick one`);
    } else {
      setStatus("Couldn't find that food. Try searching manually.");
      speak("Sorry, I couldn't find that food.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={listening ? stopListening : startListening}
        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 shadow-lg transition-all duration-200 ${
          listening
            ? "bg-red-600 animate-pulse scale-110"
            : "bg-secondary-container hover:scale-105 active:scale-95"
        }`}
      >
        <span className="material-symbols-outlined text-[28px] text-on-secondary-container"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          {listening ? "stop" : "mic"}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
          {listening ? "Stop" : "Speak"}
        </span>
      </button>

      {transcript && (
        <p className="text-sm italic text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full text-center">
          "{transcript}"
        </p>
      )}
      <p className="text-xs text-on-surface-variant text-center">{status}</p>
    </div>
  );
}

function confirmMsg(name, quantity, grams, meal) {
  const amount = grams != null ? `${grams} grams of ${name}` : quantity !== 1 ? `${quantity} ${name}` : name;
  return `Logged ${amount} for ${meal}.`;
}
