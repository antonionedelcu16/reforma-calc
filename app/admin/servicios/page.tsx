"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { SERVICIOS, EXTRAS } from "../../data/services";

type Tab = "servicios" | "extras";
const card = { backgroundColor: "#101e35", border: "1px solid #1a2e4a" };

export default function ServiciosAdmin() {
  const { config, updateConfig } = useConfig();
  const [tab, setTab] = useState<Tab>("servicios");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [precios, setPrecios] = useState({ basico: 0, estandar: 0, premium: 0 });

  const toggleServicio = (id: string) => {
    const activos = config.serviciosActivos.includes(id)
      ? config.serviciosActivos.filter((s) => s !== id)
      : [...config.serviciosActivos, id];
    updateConfig({ serviciosActivos: activos });
  };

  const toggleExtra = (id: string) => {
    const activos = config.extrasActivos.includes(id)
      ? config.extrasActivos.filter((s) => s !== id)
      : [...config.extrasActivos, id];
    updateConfig({ extrasActivos: activos });
  };

  const abrirEdicion = (id: string, tipo: "servicio" | "extra") => {
    const custom = tipo === "servicio" ? config.preciosCustom[id] : config.preciosExtrasCustom[id];
    if (tipo === "servicio") {
      const s = SERVICIOS.find((s) => s.id === id)!;
      setPrecios(custom || { basico: s.precioBasico, estandar: s.precioEstandar, premium: s.precioPremium });
    } else {
      const e = EXTRAS.find((e) => e.id === id)!;
      setPrecios(custom || { basico: e.precioBasico, estandar: e.precioEstandar, premium: e.precioPremium });
    }
    setEditandoId(id);
  };

  const guardarPrecios = (id: string, tipo: "servicio" | "extra") => {
    if (tipo === "servicio") {
      updateConfig({ preciosCustom: { ...config.preciosCustom, [id]: precios } });
    } else {
      updateConfig({ preciosExtrasCustom: { ...config.preciosExtrasCustom, [id]: precios } });
    }
    setEditandoId(null);
  };

  const resetearPrecios = (id: string, tipo: "servicio" | "extra") => {
    if (tipo === "servicio") {
      const { [id]: _, ...resto } = config.preciosCustom;
      updateConfig({ preciosCustom: resto });
    } else {
      const { [id]: _, ...resto } = config.preciosExtrasCustom;
      updateConfig({ preciosExtrasCustom: resto });
    }
    setEditandoId(null);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const ItemCard = ({ id, nombre, icono, unidad, precioBasico, precioEstandar, precioPremium, activo, custom, tipo }: {
    id: string; nombre: string; icono: string; unidad: string;
    precioBasico: number; precioEstandar: number; precioPremium: number;
    activo: boolean; custom: { basico: number; estandar: number; premium: number } | undefined;
    tipo: "servicio" | "extra";
  }) => {
    const editando = editandoId === id;
    return (
      <div className="rounded-2xl transition-all" style={{ ...card, opacity: activo ? 1 : 0.45 }}>
        <div className="flex items-center gap-3 p-4">
          <span className="text-2xl flex-shrink-0">{icono}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm">{nombre}</div>
            <div className="text-xs mt-0.5" style={{ color: "#3a3a3a" }}>
              {custom && <span style={{ color: "#fb923c" }}>Personalizado · </span>}
              {unidad === "fijo" ? "Precio fijo" : "Por m²"} · Estándar: <span style={{ color: "#8a8a8a" }}>{fmt(custom?.estandar ?? precioEstandar)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {activo && (
              <button
                onClick={() => editando ? setEditandoId(null) : abrirEdicion(id, tipo)}
                className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:opacity-80 hidden sm:block"
                style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a", border: "1px solid #222" }}>
                {editando ? "Cancelar" : "Editar"}
              </button>
            )}
            <button
              onClick={() => tipo === "servicio" ? toggleServicio(id) : toggleExtra(id)}
              className="w-12 h-6 rounded-full transition-all flex-shrink-0"
              style={{ background: activo ? "linear-gradient(135deg, #fb923c, #f97316)" : "#1a1a1a" }}>
              <div className="w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5"
                style={{ transform: activo ? "translateX(24px)" : "translateX(0)" }} />
            </button>
          </div>
        </div>

        {activo && (
          <div className="sm:hidden px-4 pb-3">
            <button
              onClick={() => editando ? setEditandoId(null) : abrirEdicion(id, tipo)}
              className="w-full text-xs py-2 rounded-xl font-semibold transition-all"
              style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a", border: "1px solid #222" }}>
              {editando ? "Cancelar edición" : "✏ Editar precios"}
            </button>
          </div>
        )}

        {editando && (
          <div className="px-4 pb-4" style={{ borderTop: "1px solid #1a1a1a", paddingTop: "16px" }}>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(["basico", "estandar", "premium"] as const).map((nivel, i) => (
                <div key={nivel}>
                  <label className="text-xs font-medium block mb-1.5 capitalize" style={{ color: i === 1 ? "#fb923c" : "#4a4a4a" }}>{nivel}</label>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ backgroundColor: "#0f0f0f", border: i === 1 ? "1px solid #fb923c40" : "1px solid #1e1e1e" }}>
                    <input
                      type="number"
                      value={precios[nivel]}
                      onChange={(e) => setPrecios((p) => ({ ...p, [nivel]: parseFloat(e.target.value) || 0 }))}
                      className="flex-1 px-2 py-2 text-xs font-bold text-white focus:outline-none w-0"
                      style={{ backgroundColor: "transparent" }}
                    />
                    <span className="px-1.5 text-xs" style={{ color: "#3a3a3a" }}>€</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => guardarPrecios(id, tipo)}
                className="px-4 py-2 rounded-xl text-black text-sm font-black transition-all hover:opacity-80"
                style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>
                Guardar
              </button>
              {custom && (
                <button onClick={() => resetearPrecios(id, tipo)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a", border: "1px solid #222" }}>
                  Restablecer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Servicios y precios</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>Activa los servicios que ofreces y personaliza sus precios</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl w-fit mb-6" style={{ backgroundColor: "#101e35", border: "1px solid #1a2e4a" }}>
        {(["servicios", "extras"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t ? "linear-gradient(135deg, #fb923c, #f97316)" : "transparent",
              color: tab === t ? "#000" : "#4a4a4a",
            }}>
            {t === "servicios" ? "🔧 Servicios" : "➕ Extras"}
          </button>
        ))}
      </div>

      {tab === "servicios" && (
        <div className="flex flex-col gap-2.5">
          {SERVICIOS.map((s) => (
            <ItemCard key={s.id} id={s.id} nombre={s.nombre} icono={s.icono} unidad={s.unidad}
              precioBasico={s.precioBasico} precioEstandar={s.precioEstandar} precioPremium={s.precioPremium}
              activo={config.serviciosActivos.includes(s.id)} custom={config.preciosCustom[s.id]} tipo="servicio" />
          ))}
        </div>
      )}

      {tab === "extras" && (
        <div className="flex flex-col gap-2.5">
          {EXTRAS.map((e) => (
            <ItemCard key={e.id} id={e.id} nombre={e.nombre} icono={e.icono} unidad={e.unidad}
              precioBasico={e.precioBasico} precioEstandar={e.precioEstandar} precioPremium={e.precioPremium}
              activo={config.extrasActivos.includes(e.id)} custom={config.preciosExtrasCustom[e.id]} tipo="extra" />
          ))}
        </div>
      )}
    </div>
  );
}
