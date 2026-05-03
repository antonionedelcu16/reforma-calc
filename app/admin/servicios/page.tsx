"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { SERVICIOS, EXTRAS } from "../../data/services";

type Tab = "servicios" | "extras";

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
      <div className={`bg-white rounded-xl border-2 transition-colors ${activo ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
        <div className="flex items-center gap-3 p-4">
          <span className="text-2xl flex-shrink-0">{icono}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 text-sm">{nombre}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {custom && <span className="text-orange-500 font-medium">Personalizado · </span>}
              {unidad === "fijo" ? "Fijo" : "m²"} · {fmt(custom?.estandar ?? precioEstandar)}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {activo && (
              <button
                onClick={() => editando ? setEditandoId(null) : abrirEdicion(id, tipo)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-colors hidden sm:block"
              >
                {editando ? "Cancelar" : "Editar"}
              </button>
            )}
            <button
              onClick={() => tipo === "servicio" ? toggleServicio(id) : toggleExtra(id)}
              className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${activo ? "bg-orange-400" : "bg-slate-200"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${activo ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {/* Mobile edit button */}
        {activo && (
          <div className="sm:hidden px-4 pb-3">
            <button
              onClick={() => editando ? setEditandoId(null) : abrirEdicion(id, tipo)}
              className="w-full text-xs py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-colors"
            >
              {editando ? "Cancelar edición" : "✏️ Editar precios"}
            </button>
          </div>
        )}

        {editando && (
          <div className="px-4 pb-4 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
              {(["basico", "estandar", "premium"] as const).map((nivel) => (
                <div key={nivel}>
                  <label className="text-xs font-medium text-slate-500 capitalize block mb-1">{nivel}</label>
                  <div className="flex items-center border-2 border-slate-200 rounded-lg focus-within:border-orange-400 overflow-hidden">
                    <input
                      type="number"
                      value={precios[nivel]}
                      onChange={(e) => setPrecios((p) => ({ ...p, [nivel]: parseFloat(e.target.value) || 0 }))}
                      className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none w-0"
                    />
                    <span className="px-1 sm:px-2 text-xs text-slate-400">€</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => guardarPrecios(id, tipo)} className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-colors">
                Guardar
              </button>
              {custom && (
                <button onClick={() => resetearPrecios(id, tipo)} className="px-4 py-2 border border-slate-200 text-slate-500 text-sm rounded-lg hover:border-red-300 hover:text-red-500 transition-colors">
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
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Servicios y precios</h1>
        <p className="text-slate-500 mt-1 text-sm">Activa los servicios que ofreces y personaliza sus precios</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit mb-6">
        {(["servicios", "extras"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "servicios" ? "🔧 Servicios" : "➕ Extras"}
          </button>
        ))}
      </div>

      {tab === "servicios" && (
        <div className="flex flex-col gap-3">
          {SERVICIOS.map((s) => (
            <ItemCard key={s.id} id={s.id} nombre={s.nombre} icono={s.icono} unidad={s.unidad}
              precioBasico={s.precioBasico} precioEstandar={s.precioEstandar} precioPremium={s.precioPremium}
              activo={config.serviciosActivos.includes(s.id)}
              custom={config.preciosCustom[s.id]}
              tipo="servicio" />
          ))}
        </div>
      )}

      {tab === "extras" && (
        <div className="flex flex-col gap-3">
          {EXTRAS.map((e) => (
            <ItemCard key={e.id} id={e.id} nombre={e.nombre} icono={e.icono} unidad={e.unidad}
              precioBasico={e.precioBasico} precioEstandar={e.precioEstandar} precioPremium={e.precioPremium}
              activo={config.extrasActivos.includes(e.id)}
              custom={config.preciosExtrasCustom[e.id]}
              tipo="extra" />
          ))}
        </div>
      )}
    </div>
  );
}
