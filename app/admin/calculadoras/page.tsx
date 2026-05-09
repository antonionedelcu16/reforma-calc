"use client";

import { useState } from "react";
import { useConfig, toSlug } from "../../context/ConfigContext";
import Link from "next/link";

const card = { backgroundColor: "#101e35", border: "1px solid #1a2e4a" };
const inputStyle = { backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e", color: "#f1f5f9" };
const IV_BLUE = "#3b82f6";

export default function CalculadorasAdmin() {
  const { calculators, currentCalcId, selectCalc, createCalc, deleteCalc, loading } = useConfig();
  const [nuevaNombre, setNuevaNombre] = useState("");
  const [creando, setCreando] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const base = typeof window !== "undefined" ? window.location.origin : "";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaNombre.trim()) return;
    setCreando(true);
    await createCalc(nuevaNombre.trim());
    setNuevaNombre("");
    setFormVisible(false);
    setCreando(false);
  };

  const handleDelete = async (id: string) => {
    await deleteCalc(id);
    setConfirmDelete(null);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Mis calculadoras
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>
            <span style={{ color: IV_BLUE }}>{calculators.length}</span> calculadora{calculators.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setFormVisible(true)}
          className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-80"
          style={{ background: `linear-gradient(135deg, ${IV_BLUE}, #2563eb)`, color: "#fff" }}>
          + Nueva
        </button>
      </div>

      {/* Create form */}
      {formVisible && (
        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: "#111111", border: "1px solid #3b82f630" }}>
          <h3 className="font-bold text-white mb-3">Nueva calculadora</h3>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              value={nuevaNombre} onChange={(e) => setNuevaNombre(e.target.value)}
              placeholder="Nombre (ej: Web principal, Campañas Meta...)"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              style={inputStyle} autoFocus
            />
            <button type="submit" disabled={creando || !nuevaNombre.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:opacity-80 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${IV_BLUE}, #2563eb)`, color: "#fff" }}>
              {creando ? "..." : "Crear"}
            </button>
            <button type="button" onClick={() => setFormVisible(false)}
              className="px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a" }}>
              ✕
            </button>
          </form>
          {nuevaNombre && (
            <p className="text-xs mt-2" style={{ color: "#2a4060" }}>
              URL: <span style={{ color: "#4a6080" }}>{base}/calc/{toSlug(nuevaNombre)}</span>
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl p-12 text-center" style={card}>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>Cargando...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {calculators.map((calc) => {
            const activa = calc.id === currentCalcId;
            const url = `${base}/calc/${calc.slug}`;
            return (
              <div key={calc.id} className="rounded-2xl p-4 sm:p-5 transition-all"
                style={{ ...card, borderColor: activa ? "#3b82f640" : "#1a2e4a" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: activa ? "linear-gradient(135deg, #3b82f622, #3b82f644)" : "#0f1a2e", color: activa ? IV_BLUE : "#2a4060" }}>
                    🧮
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{calc.nombre}</span>
                      {activa && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "#3b82f615", color: IV_BLUE }}>
                          ● Activa
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="text-xs hover:underline truncate max-w-[240px]" style={{ color: "#3a5a7a" }}>
                        /calc/{calc.slug}
                      </a>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#2a3a4a" }}>
                      Creada el {formatDate(calc.created_at)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!activa && (
                      <button onClick={() => selectCalc(calc.id)}
                        className="text-xs px-3 py-1.5 rounded-xl font-bold transition-all hover:opacity-80"
                        style={{ background: `linear-gradient(135deg, ${IV_BLUE}, #2563eb)`, color: "#fff" }}>
                        Seleccionar
                      </button>
                    )}
                    {activa && (
                      <Link href="/admin/apariencia"
                        className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:opacity-80"
                        style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a", border: "1px solid #222" }}>
                        Editar
                      </Link>
                    )}
                    {calculators.length > 1 && (
                      confirmDelete === calc.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(calc.id)}
                            className="text-xs px-2 py-1.5 rounded-xl font-bold transition-all"
                            style={{ backgroundColor: "#4a1a1a", color: "#f87171", border: "1px solid #3a1a1a" }}>
                            Confirmar
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="text-xs px-2 py-1.5 rounded-xl transition-all"
                            style={{ backgroundColor: "#1a1a1a", color: "#4a4a4a" }}>
                            No
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(calc.id)}
                          className="text-xs px-3 py-1.5 rounded-xl transition-all hover:text-red-400"
                          style={{ backgroundColor: "#1a1a1a", color: "#2a2a2a", border: "1px solid #1a1a1a" }}>
                          ✕
                        </button>
                      )
                    )}
                  </div>
                </div>

                {activa && (
                  <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #1a2e4a" }}>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all hover:opacity-80"
                      style={{ backgroundColor: "#0f1a2e", color: IV_BLUE, border: "1px solid #1a2e4a" }}>
                      Abrir ↗
                    </a>
                    <Link href="/admin/compartir"
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all hover:opacity-80"
                      style={{ backgroundColor: "#0f1a2e", color: "#4a6080", border: "1px solid #1a2e4a" }}>
                      Compartir / Embed
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl p-4 mt-4" style={{ backgroundColor: "#0f1a2e", border: "1px solid #1a3a5a" }}>
        <p className="text-xs" style={{ color: "#3b82f6" }}>
          💡 Cada calculadora tiene su propia URL, configuración, precios y apariencia. Perfecta para distintas campañas, páginas web o servicios.
        </p>
      </div>
    </div>
  );
}
