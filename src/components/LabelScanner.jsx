import { useState, useRef } from "react";

const PROMPT = `You are reading a nutritional information label from a food product (likely Indian).

Extract the per-serving values. If the label only shows per-100g values, use those directly (set gramsPerServing to 100).
If it shows both per-serving and per-100g, use the per-serving column.

Return ONLY a valid JSON object — no explanation, no markdown, just JSON:
{
  "servingSize": "30g",
  "gramsPerServing": 30,
  "cal": 150,
  "protein": 3.5,
  "carbs": 20,
  "fat": 6,
  "fiber": 1,
  "sugar": 2,
  "sodium": 180
}

Rules:
- cal = calories or kcal (if only kJ is shown, divide by 4.184)
- carbs = "carbohydrates" or "total carbohydrate"
- sodium: convert to mg if shown in g (multiply by 1000)
- Use 0 for fiber/sugar/sodium if not listed
- gramsPerServing should be a number (grams or ml)
- Return null for values you truly cannot read`;

export default function LabelScanner({ onParsed }) {
  const [preview,  setPreview]  = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error,    setError]    = useState(null);
  const [done,     setDone]     = useState(false);
  const inputRef = useRef(null);

  // Resize image to max 1024px on longest side before sending —
  // phone cameras produce 4–12MB images which burns quota fast.
  function resizeImage(dataUrl, maxPx = 1024) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width  * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = dataUrl;
    });
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setDone(false);

    const raw = await new Promise(res => {
      const reader = new FileReader();
      reader.onload = ev => res(ev.target.result);
      reader.readAsDataURL(file);
    });

    // Resize before preview and before sending
    const dataUrl = await resizeImage(raw);
    setPreview(dataUrl);

    const [, base64] = dataUrl.split(",");
    await scan(base64, "image/jpeg");

    if (inputRef.current) inputRef.current.value = "";
  }

  async function scan(base64, mediaType) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      setError("Add your free Gemini API key as VITE_GEMINI_API_KEY in .env.local — get one free at aistudio.google.com");
      return;
    }

    setScanning(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: mediaType, data: base64 } },
                { text: PROMPT },
              ],
            }],
            generationConfig: { temperature: 0, maxOutputTokens: 512 },
          }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg  = body?.error?.message ?? JSON.stringify(body).slice(0, 150);
        if (res.status === 429) throw new Error(`Rate limit: ${msg}. Wait a minute and try again, or create a new API key at aistudio.google.com.`);
        throw new Error(`API ${res.status}: ${msg}`);
      }

      const data  = await res.json();
      const text  = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not find JSON in response. Try a clearer photo.");

      const parsed = JSON.parse(match[0]);
      setDone(true);
      onParsed(parsed);
    } catch (e) {
      setError(e.message);
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-4xl p-5 space-y-4 border-2 border-dashed border-primary/30">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[20px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            document_scanner
          </span>
        </div>
        <div>
          <p className="font-headline font-bold text-base text-on-surface leading-tight">Scan Nutrition Label</p>
          <p className="text-xs text-on-surface-variant">Take a photo — macros fill in automatically</p>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
          <img src={preview} alt="Label preview" className="w-full h-full object-contain" />
          {scanning && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
              <p className="text-white text-sm font-semibold">Reading label…</p>
            </div>
          )}
          {done && !scanning && (
            <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-4 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm font-bold text-emerald-700">Parsed!</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-2xl text-red-700">
          <span className="material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0">error</span>
          <p className="text-xs">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {/* Camera — opens rear camera on mobile */}
        <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-colors ${
          scanning
            ? "bg-surface-container text-on-surface-variant cursor-not-allowed"
            : "bg-primary text-white hover:bg-emerald-800 active:scale-95"
        }`}>
          <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          {scanning ? "Scanning…" : "Take Photo"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={scanning}
            onChange={handleFile}
          />
        </label>

        {/* File picker — for desktop or existing photo */}
        <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-colors border border-outline-variant ${
          scanning
            ? "text-on-surface-variant cursor-not-allowed"
            : "text-on-surface hover:bg-surface-container active:scale-95"
        }`}>
          <span className="material-symbols-outlined text-[20px]">upload</span>
          Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={scanning}
            onChange={handleFile}
          />
        </label>
      </div>

      <p className="text-[10px] text-center text-on-surface-variant/60">
        Works best with the full nutrition table in frame, good lighting, and no glare
      </p>
    </div>
  );
}
