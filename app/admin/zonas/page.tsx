"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { Zona } from "../../data/services";
import { COMUNIDADES } from "../../data/regiones";

type Tab = "regiones" | "custom";
const ZONA_VACIA: Omit<Zona, "id"> = { nombre: "", multiplicador: 1.0 };
const card = { backgroundColor: "#111111", border: "1px solid #1a1a1a" };

export default function ZonasAdmin() {
  const { config, updateConfig } = useConfig();
  const [tab, setTab] = useState<Tab>("regiones");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Zona, "id">>(ZONA_VACIA);
  const [nueva, setNueva] = useState(false);
  const [formNueva, setFormNueva] = useState<Omit<Zona, "id">>(ZONA_VACIA);

  const toggleRegion = (id: string) => {
    const activas = config.regionesActivas.includes(id)
      ? config.regionesActivas.filter((r) => r !== id)
      : [...config.regionesActivas, id];
    updateConfig({ regionesActivas: activas });
  };

  const abrirEdicion = (z: Zona) => { setEditandoId(z.id); setForm({ nombre: z.nombre, multiplicador: z.multiplicador }); };
  const guardar = (id: string) => { updateConfig({ zonas: config.zonas.map((z) => (z.id === id ? { ...z, ...form } : z)) }); setEditandoId(null); };
  const eliminar = (id: string) => updateConfig({ zonas: config.zonas.filter((z) => z.id !== id) });
  const agregar = () => {
    if (!formNueva.nombre.trim()) return;
    const id = formNueva.nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    updateConfig({ zonas: [...config.zonas, { id, ...formNueva }] });
    setFormNueva(ZONA_VACIA); setNueva(false);
  };

  const labelMult = (m: number) => {
    const diff = m - 1;
    if (diff > 0.01) return { texto: `+${Math.round(diff * 100)}%`, color: "#f87171", bg: "#f8717115" };
    if (diff < -0.01) return { texto: `-${Math.round(Math.abs(diff) * 100)}%`, color: "#34d399", bg: "#34d39915" };
    return { texto: "Base", color: "#6a6a6a", bg: "#1a1a1a" };
  };

  const inputStyle = { backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e", color: "#f1f5f9" };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Zonas de trabajo</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>Define dónde operas y ajusta los precios por zona</p>
      </div>

      <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#0f1a2e", border: "1px solid #1a3a5a" }}>
        <p className="text-xs" style={{ color: "#60a5fa" }}>
          <strong className="text-blue-400">Precios reales 2024 por CCAA</strong> — Los multiplicadores se basan en datos de mercado español.
          Activa las comunidades donde operas y aparecerán como opciones en tu calculadora.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a" }}>
        {([["regiones", "🗺️ Comunidades autónomas"], ["custom", "⚙️ Zonas propias"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 px-3 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t ? "linear-gradient(135deg, #fb923c, #f97316)" : "transparent",
              color: tab === t ? "#000" : "#4a4a4a",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* CCAA */}
      {tab === "regiones" && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {COMUNIDADES.map((r) => {
            const activa = config.regionesActivas.includes(r.id);
            const { texto, color, bg } = labelMult(r.multiplicador);
            return (
              <div key={r.id} className="rounded-2xl p-4 transition-all" style={{ ...card, opacity: activa ? 1 : 0.4, borderColor: activa ? "#fb923c30" : "#1a1a1a" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{r.emoji}</span>
                    <span className="font-bold text-white text-sm">{r.nombre}</span>
                  </div>
                  <button onClick={() => toggleRegion(r.id)}
                    className="w-11 h-6 rounded-full transition-all flex-shrink-0"
                    style={{ background: activa ? "linear-gradient(135deg, #fb923c, #f97316)" : "#1a1a1a" }}>
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5"
                      style={{ transform: activa ? "translateX(20px)" : "translateX(0)" }} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#3a3a3a" }}>~{r.precioRefIntegral} €/m²</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color }}>{texto}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zonas custom */}
      {tab === "custom" && (
        <div className="flex flex-col gap-2.5">
          <p className="text-sm mb-2" style={{ color: "#4a4a4a" }}>Añade zonas con tu propio nombre y ajuste de precio (barrios, municipios, etc.)</p>

          {config.zonas.map((z) => {
            const editando = editandoId === z.id;
            const { texto, color, bg } = labelMult(z.multiplicador);
            return (
              <div key={z.id} className="rounded-2xl transition-all" style={card}>
                {!editando ? (
                  <div className="flex items-center gap-3 p-4">
                    <span className="text-xl">📍</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm">{z.nombre}</div>
                      <div className="text-xs" style={{ color: "#3a3a3a" }}>×{z.multiplicador.toFixed(2)}</div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: bg, color }}>{texto}</span>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => abrirEdicion(z)}
                        className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
                        style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a", border: "1px solid #222" }}>
                        Editar
                      </button>
                      <button onClick={() => eliminar(z.id)}
                        className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:text-red-400"
                        style={{ backgroundColor: "#1a1a1a", color: "#4a4a4a", border: "1px solid #222" }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Nombre</label>
                        <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                          className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                          style={inputStyle} />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Multiplicador (1.25 = +25%)</label>
                        <input type="number" step="0.05" min="0.5" max="2" value={form.multiplicador}
                          onChange={(e) => setForm((f) => ({ ...f, multiplicador: parseFloat(e.target.value) || 1 }))}
                          className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                          style={inputStyle} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => guardar(z.id)}
                        className="px-4 py-2 rounded-xl text-black text-sm font-black"
                        style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>
                        Guardar
                      </button>
                      <button onClick={() => setEditandoId(null)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={() => setNueva(true)}
            className="w-full py-3 rounded-2xl text-sm font-bold transition-all hover:border-orange-500/50"
            style={{ backgroundColor: "transparent", border: "1px dashed #2a2a2a", color: "#4a4a4a" }}>
            + Añadir zona personalizada
          </button>

          {nueva && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#111111", border: "1px solid #fb923c30" }}>
              <div className="text-sm font-bold text-white mb-3">Nueva zona</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Nombre</label>
                  <input value={formNueva.nombre} onChange={(e) => setFormNueva((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: Madrid centro"
                    className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                    style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Multiplicador</label>
                  <input type="number" step="0.05" min="0.5" max="2" value={formNueva.multiplicador}
                    onChange={(e) => setFormNueva((f) => ({ ...f, multiplicador: parseFloat(e.target.value) || 1 }))}
                    className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
                    style={inputStyle} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={agregar}
                  className="px-4 py-2 rounded-xl text-black text-sm font-black"
                  style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>
                  Añadir
                </button>
                <button onClick={() => { setNueva(false); setFormNueva(ZONA_VACIA); }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
