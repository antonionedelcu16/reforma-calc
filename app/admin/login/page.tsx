"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";

const IV_BG = "#070d1a";
const IV_CARD = "#101e35";
const IV_BORDER = "#1a2e4a";
const IV_BLUE = "#3b82f6";
const inputStyle = { backgroundColor: "#0c1525", border: "1px solid #1a2e4a", color: "#f1f5f9" };

type Mode = "login" | "registro";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificacion, setVerificacion] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Email o contraseña incorrectos" : error.message);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setVerificacion(true);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: IV_BG }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/intervision-logo.svg" alt="Intervisión" className="w-10 h-10" />
          <div>
            <div className="font-black tracking-widest uppercase text-white text-base"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}>
              INTERVISIÓN
            </div>
            <div className="text-xs" style={{ color: IV_BLUE }}>Reforma Calc</div>
          </div>
        </div>

        {verificacion ? (
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: IV_CARD, border: `1px solid ${IV_BORDER}` }}>
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="text-white font-bold text-lg mb-2">Revisa tu email</h2>
            <p className="text-sm mb-4" style={{ color: "#4a6080" }}>
              Te hemos enviado un enlace de confirmación a <strong className="text-white">{email}</strong>.
              Confirma tu cuenta para acceder.
            </p>
            <button onClick={() => { setMode("login"); setVerificacion(false); }}
              className="text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: IV_BLUE }}>
              Volver al login →
            </button>
          </div>
        ) : (
          <div className="rounded-2xl p-6" style={{ backgroundColor: IV_CARD, border: `1px solid ${IV_BORDER}` }}>

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ backgroundColor: "#0c1525" }}>
              {(["login", "registro"] as Mode[]).map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(null); }}
                  className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: mode === m ? `linear-gradient(135deg, ${IV_BLUE}, #2563eb)` : "transparent",
                    color: mode === m ? "#fff" : "#4a6080",
                  }}>
                  {m === "login" ? "Entrar" : "Crear cuenta"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a6080" }}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com" required
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a6080" }}>Contraseña</label>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={inputStyle}
                />
                {mode === "registro" && (
                  <p className="text-xs mt-1" style={{ color: "#2a4060" }}>Mínimo 6 caracteres</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "#2a0a0a", color: "#f87171", border: "1px solid #4a1a1a" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg, ${IV_BLUE}, #2563eb)`, color: "#fff" }}>
                {loading ? "..." : mode === "login" ? "Entrar al panel" : "Crear cuenta gratis"}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-xs mt-4" style={{ color: "#1a2e4a" }}>
          © 2024 Intervisión · intervision.click
        </p>
      </div>
    </div>
  );
}
