import { useState, useRef } from "react";
import { searchFood, getMealTypeByTime, parseMealTypeFromText, parseAmountFromText } from "../foodDatabase";
import { getAllRecipes } from "../db";

export default function VoiceInput({ onFoodDetected }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Tap the mic to log food by voice");
  const recogRef = useRef(null);

  async function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Speech recognition not supported. Please use Chrome.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-IN";
    recog.interimResults = true;
    recog.continuous = false;
    recogRef.current = recog;
    let finalText = "";

    recog.onstart = () => { setListening(true); setStatus("Listening... speak now"); setTranscript(""); };

    recog.onresult = (e) => {
      finalText = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(finalText);
    };

    recog.onend = async () => {
      setListening(false);
      if (finalText) await processTranscript(finalText);
    };

    recog.onerror = (e) => { setListening(false); setStatus(`Error: ${e.error}. Try again.`); };
    recog.start();
  }

  function stopListening() {
    if (recogRef.current) recogRef.current.stop();
  }

  async function processTranscript(text) {
    setStatus(`Processing: "${text}"`);

    const customRecipes = await getAllRecipes();
    const meal = parseMealTypeFromText(text) || getMealTypeByTime();
    const { quantity, grams } = parseAmountFromText(text);

    // Check custom recipes first
    const customMatch = customRecipes.find(r => text.toLowerCase().includes(r.name.toLowerCase()));
    if (customMatch) {
      onFoodDetected({ food: customMatch, quantity, grams, meal, transcript: text });
      setStatus(`✓ Logged ${customMatch.name}${grams ? ` (${grams}g)` : quantity > 1 ? ` x${quantity}` : ""} for ${meal}`);
      return;
    }

    const results = searchFood(text, customRecipes);
    if (results.length === 1) {
      onFoodDetected({ food: results[0], quantity, grams, meal, transcript: text });
      setStatus(`✓ Logged ${results[0].name}${grams ? ` (${grams}g)` : quantity > 1 ? ` x${quantity}` : ""} for ${meal}`);
    } else if (results.length > 1) {
      onFoodDetected({ food: null, candidates: results, quantity, grams, meal, transcript: text });
      setStatus(`Found ${results.length} matches — pick one below`);
    } else {
      setStatus(`Couldn't identify the food. Try searching manually or add it as a custom food.`);
    }
  }

  return (
    <div className="voice-input">
      <button
        className={`mic-btn ${listening ? "mic-active" : ""}`}
        onClick={listening ? stopListening : startListening}
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
