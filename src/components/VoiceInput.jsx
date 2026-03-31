import { useState, useRef } from "react";
import { searchFood, getMealTypeByTime, parseMealTypeFromText, parseQuantityFromText } from "../foodDatabase";
import { getAllRecipes } from "../db";

export default function VoiceInput({ onFoodDetected }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Tap the mic to log food by voice");
  const recogRef = useRef(null);

  async function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-IN";
    recog.interimResults = true;
    recog.continuous = false;
    recogRef.current = recog;

    recog.onstart = () => {
      setListening(true);
      setStatus("Listening... speak now");
      setTranscript("");
    };

    recog.onresult = (e) => {
      const text = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(" ");
      setTranscript(text);
    };

    recog.onend = async () => {
      setListening(false);
      const text = recogRef.current._lastTranscript || transcript;
      if (text) await processTranscript(text);
    };

    recog.onerror = (e) => {
      setListening(false);
      setStatus(`Error: ${e.error}. Try again.`);
    };

    // Capture final transcript before onend fires
    recog._lastTranscript = "";
    recog.addEventListener("result", (e) => {
      recog._lastTranscript = Array.from(e.results).map(r => r[0].transcript).join(" ");
    });

    recog.start();
  }

  function stopListening() {
    if (recogRef.current) recogRef.current.stop();
  }

  async function processTranscript(text) {
    setStatus(`Processing: "${text}"`);

    // Load custom recipes too
    const customRecipes = await getAllRecipes();

    // Detect meal type
    const mealFromText = parseMealTypeFromText(text);
    const meal = mealFromText || getMealTypeByTime();

    // Detect quantity
    const qty = parseQuantityFromText(text);

    // Search food — check custom recipes first, then database
    const customMatch = customRecipes.find(r =>
      text.toLowerCase().includes(r.name.toLowerCase())
    );

    if (customMatch) {
      onFoodDetected({
        food: customMatch,
        quantity: qty,
        meal,
        transcript: text,
      });
      setStatus(`✓ Logged ${qty > 1 ? qty + "x " : ""}${customMatch.name} for ${meal}`);
      return;
    }

    const results = searchFood(text);
    if (results.length === 1) {
      onFoodDetected({ food: results[0], quantity: qty, meal, transcript: text });
      setStatus(`✓ Logged ${qty > 1 ? qty + "x " : ""}${results[0].name} for ${meal}`);
    } else if (results.length > 1) {
      onFoodDetected({ food: null, candidates: results, quantity: qty, meal, transcript: text });
      setStatus(`Found ${results.length} matches — pick one below`);
    } else {
      setStatus(`Couldn't find "${text}". Try adding it as a custom food.`);
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
        <span className="mic-label">{listening ? "Tap to stop" : "Tap to speak"}</span>
      </button>

      {transcript && (
        <p className="transcript">"{transcript}"</p>
      )}
      <p className="voice-status">{status}</p>
    </div>
  );
}
