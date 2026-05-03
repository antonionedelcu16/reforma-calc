"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { Zona } from "../../data/services";
import { COMUNIDADES } from "../../data/regiones";

type Tab = "regiones" | "custom";
const ZONA_VACIA: Omit<Zona, "id"> = { nombre: "", multiplicador: 1.0 };

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

  const abrirEdicion = (z: Zona) => {
    setEditandoId(z.id);
    setForm({ nombre: z.nombre, multiplicador: z.multiplicador });
  };

  const guardar = (id: string) => {
    updateConfig({ zonas: config.zonas.map((z) => (z.id === id ? { ...z, ...form } : z)) });
    setEditandoId(null);
  };

  const eliminar = (id: string) =>
    updateConfig({ zonas: config.zonas.filter((z) => z.id !== id) });

  const agregar = () => {
    if (!formNueva.nombre.trim()) return;
    const id = formNueva.nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    updateConfig({ zonas: [...config.zonas, { id, ...formNueva }] });
    setFormNueva(ZONA_VACIA);
    setNueva(false);
  };

  const labelMult = (m: number) => {
    const diff = m - 1;
    if (diff > 0.01) return { texto: `+${Math.round(diff * 100)}%`, cls: "bg-red-50 text-red-500" };
    if (diff < -0.01) return { texto: `-${Math.round(Math.abs(diff) * 100)}%`, cls: "bg-green-50 text-green-600" };
    return { texto: "Base", cls: "bg-slate-100 text-slate-500" };
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Zonas de trabajo</h1>
        <p className="text-slate-500 mt-1">Define dónde operas y los precios reales de cada zona</p>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        <strong>Precios por comunidad autónoma:</strong> Los multiplicadores están basados en datos reales de mercado español 2024.
        Selecciona las comunidades donde operas y aparecerán en la calculadora de tus clientes.
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {([["regiones", "🗺️ Comunidades autónomas"], ["custom", "⚙️ Zonas personalizadas"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* CCAA */}
      {tab === "regiones" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COMUNIDADES.map((r) => {
            const activa = config.regionesActivas.includes(r.id);
            const { texto, cls } = labelMult(r.multiplicador);
            return (
              <div key={r.id}
                className={`bg-white rounded-2xl border-2 p-4 transition-all ${activa ? "border-orange-300" : "border-slate-200 opacity-60"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{r.emoji}</span>
                    <span className="font-semibold text-slate-800 text-sm">{r.nombre}</span>
                  </div>
                  <button onClick={() => toggleRegion(r.id)}
                    className="w-11 h-6 rounded-full transition-colors flex-shrink-0"
                    style={{ backgroundColor: activa ? "#fb923c" : "#e2e8f0" }}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${activa ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">~{r.precioRefIntegral} €/m² reforma integral</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>{texto}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zonas custom */}
      {tab === "custom" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500 mb-2">Añade zonas específicas con tu propio nombre y ajuste de precio (barrios, municipios, etc.)</p>
          {config.zonas.map((z) => {
            const editando = editandoId === z.id;
            const { texto, cls } = labelMult(z.multiplicador);
            return (
              <div key={z.id} className="bg-white rounded-2xl border-2 border-slate-200">
                {!editando ? (
                  <div className="flex items-center gap-4 p-4">
                    <span className="text-xl">📍</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{z.nombre}</div>
                      <div className="text-xs text-slate-400">×{z.multiplicador.toFixed(2)}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${cls}`}>{texto}</span>
                    <div className="flex gap-2">
                      <button onClick={() => abrirEdicion(z)} className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-colors">Editar</button>
                      <button onClick={() => eliminar(z.id)} className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:border-red-300 hover:text-red-500 transition-colors">Eliminar</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Nombre</label>
                        <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                          className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Multiplicador (1.25 = +25%)</label>
                        <input type="number" step="0.05" min="0.5" max="2" value={form.multiplicador}
                          onChange={(e) => setForm((f) => ({ ...f, multiplicador: parseFloat(e.target.value) || 1 }))}
                          className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => guardar(z.id)} className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg">Guardar</button>
                      <button onClick={() => setEditandoId(null)} className="px-4 py-2 border border-slate-200 text-slate-500 text-sm rounded-lg">Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={() => setNueva(true)}
            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl text-sm font-medium text-slate-500 hover:border-orange-300 hover:text-orange-500 transition-colors">
            + Añadir zona personalizada
          </button>

          {nueva && (
            <div className="bg-white rounded-2xl border-2 border-orange-300 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">Nueva zona</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Nombre</label>
                  <input value={formNueva.nombre} onChange={(e) => setFormNueva((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: Madrid centro" className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">Multiplicador</label>
                  <input type="number" step="0.05" min="0.5" max="2" value={formNueva.multiplicador}
                    onChange={(e) => setFormNueva((f) => ({ ...f, multiplicador: parseFloat(e.target.value) || 1 }))}
                    className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={agregar} className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg">Añadir</button>
                <button onClick={() => { setNueva(false); setFormNueva(ZONA_VACIA); }} className="px-4 py-2 border border-slate-200 text-slate-500 text-sm rounded-lg">Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
