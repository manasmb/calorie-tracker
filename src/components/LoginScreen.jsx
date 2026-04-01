import { useState } from "react";
import { signInWithGoogle } from "../firebase";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleLogin() {
    setLoading(true); setError("");
    try { await signInWithGoogle(); }
    catch { setError("Sign-in failed. Please try again."); setLoading(false); }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl">
        <div className="text-7xl mb-4">🥗</div>
        <h1 className="font-headline font-extrabold text-3xl text-primary mb-1">Vitality</h1>
        <p className="text-on-surface-variant text-sm mb-2">Indian Food Calorie Tracker</p>
        <p className="text-on-surface-variant text-xs mb-10 leading-relaxed">
          Sign in to save your food log and access it across all your devices.
        </p>

        <button onClick={handleLogin} disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-4 border-2 border-outline-variant rounded-2xl bg-white hover:border-blue-400 hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-zinc-300 border-t-blue-500 animate-spin" />
          ) : (
            <svg viewBox="0 0 48 48" width="20" height="20">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          <span className="font-headline font-semibold text-on-surface">
            {loading ? "Signing in…" : "Sign in with Google"}
          </span>
        </button>

        {error && <p className="mt-4 text-xs text-error font-semibold">{error}</p>}
      </div>
    </div>
  );
}
