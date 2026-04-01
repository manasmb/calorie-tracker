import { useState, useRef } from "react";
import { searchFood, getMealTypeByTime, parseMealTypeFromText, parseAmountFromText } from "../foodDatabase";
import { getAllRecipes } from "../db";

// Speak a confirmation aloud using the browser's built-in TTS (free, no API needed)
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang  = "en-IN";
  utterance.rate  = 1.05;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

export default function VoiceInput({ onFoodDetected }) {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus]         = useState("Tap the mic to log food by voice");
  const recogRef = useRef(null);

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus("Speech recognition not supported. Please use Chrome.");
      return;
    }

    const recog = new SR();
    recog.lang            = "en-IN";
    recog.interimResults  = true;
    recog.continuous      = false;
    recogRef.current      = recog;
    let finalText         = "";

    recog.onstart = () => {
      setListening(true);
      setStatus("Listening… speak now");
      setTranscript("");
    };

    recog.onresult = (e) => {
      finalText = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(finalText);
    };

    recog.onend = async () => {
      setListening(false);
      if (!finalText) { setStatus("Didn't catch that. Try again."); return; }
      await processTranscript(finalText);
    };

    recog.onerror = (e) => {
      setListening(false);
      setStatus(e.error === "not-allowed"
        ? "Microphone permission denied."
        : `Error: ${e.error}. Try again.`);
    };

    recog.start();
  }

  function stopListening() {
    recogRef.current?.stop();
  }

  async function processTranscript(text) {
    setStatus(`Processing: "${text}"`);

    const customs  = await getAllRecipes();
    const meal     = parseMealTypeFromText(text) || getMealTypeByTime();
    const { quantity, grams } = parseAmountFromText(text);

    // Check custom recipes first (exact name match)
    const customMatch = customs.find(r =>
      text.toLowerCase().includes(r.name.toLowerCase())
    );
    if (customMatch) {
      onFoodDetected({ food: customMatch, quantity, grams, meal, transcript: text });
      const msg = confirmMessage(customMatch.name, quantity, grams, meal);
      setStatus(`✓ ${msg}`);
      speak(msg);
      return;
    }

    const results = searchFood(text, customs);
    if (results.length === 1) {
      onFoodDetected({ food: results[0], quantity, grams, meal, transcript: text });
      const msg = confirmMessage(results[0].name, quantity, grams, meal);
      setStatus(`✓ ${msg}`);
      speak(msg);
    } else if (results.length > 1) {
      onFoodDetected({ food: null, candidates: results, quantity, grams, meal, transcript: text });
      setStatus(`Found ${results.length} matches — pick one below`);
    } else {
      const msg = "Couldn't identify the food. Try searching manually.";
      setStatus(msg);
      speak("Sorry, I couldn't find that food.");
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

function confirmMessage(name, quantity, grams, meal) {
  const amount = grams != null
    ? `${grams} grams of ${name}`
    : quantity !== 1
      ? `${quantity} ${name}`
      : name;
  return `Logged ${amount} for ${meal}.`;
}
