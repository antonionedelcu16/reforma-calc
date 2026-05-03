"use client";

import { useState } from "react";
import {
  SERVICIOS, EXTRAS, NIVELES,
  TipoReforma, Habitaciones,
  calcularM2Habitaciones,
} from "../data/services";
import { useConfig } from "../context/ConfigContext";
import FormularioContacto from "./FormularioContacto";
import { COMUNIDADES } from "../data/regiones";

type Step = 1 | 2 | 3 | 4;

type State = {
  step: Step;
  servicio: TipoReforma | null;
  zonaId: string | null;
  metros: string;
  habitaciones: Habitaciones;
  extrasIds: string[];
};

const DEFAULT_HAB: Habitaciones = { banos: 1, dormitorios: 2, salon: true, cocina: false, pasillo: false };

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export default function Calculator() {
  const { config } = useConfig();
  const [state, setState] = useState<State>({
    step: 1, servicio: null, zonaId: null, metros: "", habitaciones: DEFAULT_HAB, extrasIds: [],
  });
  const [desglose, setDesglose] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const update = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));

  // Combina regiones CCAA activas + zonas custom
  const zonasDisponibles = [
    ...COMUNIDADES.filter((r) => config.regionesActivas.includes(r.id)).map((r) => ({
      id: r.id, nombre: `${r.emoji} ${r.nombre}`, multiplicador: r.multiplicador,
    })),
    ...config.zonas,
  ];
  const zona = zonasDisponibles.find((z) => z.id === state.zonaId) ?? null;

  const serviciosDisponibles = SERVICIOS.filter((s) => config.serviciosActivos.includes(s.id));

  const getPrecioServicio = (s: TipoReforma, nivel: "basico" | "estandar" | "premium") => {
    const c = config.preciosCustom[s.id];
    if (c) return c[nivel];
    return nivel === "basico" ? s.precioBasico : nivel === "estandar" ? s.precioEstandar : s.precioPremium;
  };

  const getPrecioExtra = (id: string, nivel: "basico" | "estandar" | "premium") => {
    const e = EXTRAS.find((x) => x.id === id)!;
    const c = config.preciosExtrasCustom[id];
    if (c) return c[nivel];
    return nivel === "basico" ? e.precioBasico : nivel === "estandar" ? e.precioEstandar : e.precioPremium;
  };

  const getM2 = () => {
    if (!state.servicio) return 0;
    if (state.servicio.unidad === "habitaciones") return calcularM2Habitaciones(state.habitaciones);
    return parseFloat(state.metros) || 0;
  };

  const calcular = (nivelId: "basico" | "estandar" | "premium") => {
    if (!state.servicio || !zona) return { total: 0, min: 0, max: 0, desglosado: [] };
    const s = state.servicio;
    const base = s.unidad === "fijo" ? getPrecioServicio(s, nivelId) : getPrecioServicio(s, nivelId) * getM2();
    const baseZona = base * zona.multiplicador;
    const extrasActivos = EXTRAS.filter((e) => state.extrasIds.includes(e.id) && config.extrasActivos.includes(e.id));
    const extrasTotal = extrasActivos.reduce((sum, e) => {
      const p = getPrecioExtra(e.id, nivelId);
      return sum + (e.unidad === "m2" ? p * getM2() : p);
    }, 0);
    const total = baseZona + extrasTotal;
    const { variacionMin, variacionMax } = NIVELES.find((n) => n.id === nivelId)!;
    return {
      total,
      min: Math.round(total * variacionMin),
      max: Math.round(total * variacionMax),
      desglosado: [
        { concepto: "Mano de obra", importe: baseZona * 0.55 },
        { concepto: "Materiales", importe: baseZona * 0.38 },
        { concepto: "Gestión y varios", importe: baseZona * 0.07 },
        ...extrasActivos.map((e) => {
          const p = getPrecioExtra(e.id, nivelId);
          return { concepto: e.nombre, importe: e.unidad === "m2" ? p * getM2() : p };
        }),
      ],
    };
  };

  const puedeAvanzar = () => {
    if (state.step === 1) return !!state.servicio;
    if (state.step === 2) return !!state.zonaId;
    if (state.step === 3) {
      if (!state.servicio) return false;
      if (state.servicio.unidad === "fijo" || state.servicio.unidad === "habitaciones") return true;
      return parseFloat(state.metros) >= (state.servicio.minimoM2 || 1);
    }
    return true;
  };

  const extrasDisponibles = state.servicio
    ? EXTRAS.filter((e) => state.servicio!.extrasAplicables.includes(e.id) && config.extrasActivos.includes(e.id))
    : [];

  const toggleExtra = (id: string) =>
    update({ extrasIds: state.extrasIds.includes(id) ? state.extrasIds.filter((x) => x !== id) : [...state.extrasIds, id] });

  const color = config.colorPrimario;
  const fuente = config.fuente;
  const PASOS = ["Reforma", "Zona", "Detalles", "Resultado"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", fontFamily: fuente }}>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.logo ? (
              <img src={config.logo} alt={config.nombre} className="h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: color }}>
                {config.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            {!config.logo && <span className="font-bold text-slate-800 text-sm">{config.nombre}</span>}
          </div>
          {config.contactTelefono && (
            <a href={`tel:${config.contactTelefono}`} className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">
              📞 {config.contactTelefono}
            </a>
          )}
        </div>
      </header>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Hero — solo en paso 1 */}
          {state.step === 1 && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 text-white" style={{ backgroundColor: color }}>
                ✨ Estimación gratuita al instante
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                {config.tituloBienvenida}
              </h1>
              <p className="text-slate-500 text-base max-w-sm mx-auto">
                {config.subtituloBienvenida}
              </p>
            </div>
          )}

          {/* Progress */}
          {state.step > 1 && (
            <div className="flex items-center mb-6 px-1">
              {PASOS.map((nombre, i) => {
                const num = i + 1;
                const completado = state.step > num;
                const activo = state.step === num;
                return (
                  <div key={num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          backgroundColor: completado || activo ? color : "#e2e8f0",
                          color: completado || activo ? "white" : "#94a3b8",
                          boxShadow: activo ? `0 0 0 4px ${color}30` : "none",
                        }}
                      >
                        {completado ? "✓" : num}
                      </div>
                      <span className="text-xs mt-1 font-medium" style={{ color: activo ? color : completado ? "#475569" : "#94a3b8" }}>
                        {nombre}
                      </span>
                    </div>
                    {i < PASOS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1.5 mb-4 rounded-full transition-colors" style={{ backgroundColor: state.step > num ? color : "#e2e8f0" }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* PASO 1 — Tipo de reforma */}
          {state.step === 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
              {serviciosDisponibles.map((s) => {
                const activo = state.servicio?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => update({ servicio: s, extrasIds: [] })}
                    className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all text-center bg-white"
                    style={{
                      borderColor: activo ? color : "#e2e8f0",
                      backgroundColor: activo ? `${color}08` : "white",
                      boxShadow: activo ? `0 0 0 1px ${color}40` : "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{s.icono}</span>
                    <span className="text-xs font-semibold leading-tight" style={{ color: activo ? color : "#475569" }}>
                      {s.nombre}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* PASO 2 — Zona */}
          {state.step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 className="font-bold text-slate-800 mb-1">¿En qué zona está el inmueble?</h2>
              <p className="text-xs text-slate-400 mb-5">La ubicación influye en los costes de mano de obra y materiales</p>
              <div className="flex flex-col gap-2.5">
                {zonasDisponibles.map((z) => {
                  const activo = state.zonaId === z.id;
                  const diff = z.multiplicador - 1;
                  return (
                    <button
                      key={z.id}
                      onClick={() => update({ zonaId: z.id })}
                      className="flex items-center justify-between p-4 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: activo ? color : "#e2e8f0",
                        backgroundColor: activo ? `${color}08` : "white",
                      }}
                    >
                      <span className="font-semibold text-slate-700 text-sm">{z.nombre}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        diff > 0.01 ? "bg-red-50 text-red-500" : diff < -0.01 ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {diff > 0.01 ? `+${Math.round(diff * 100)}%` : diff < -0.01 ? `-${Math.round(Math.abs(diff) * 100)}%` : "Base"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3 — Detalles + Extras */}
          {state.step === 3 && state.servicio && (
            <div className="flex flex-col gap-4">
              {state.servicio.unidad === "m2" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <h2 className="font-bold text-slate-800 mb-5">¿Cuántos metros cuadrados?</h2>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={state.metros}
                      onChange={(e) => update({ metros: e.target.value })}
                      placeholder="0"
                      min={state.servicio.minimoM2 || 1}
                      className="flex-1 text-5xl font-extrabold text-slate-800 border-none outline-none bg-transparent w-0"
                    />
                    <span className="text-2xl font-bold text-slate-300">m²</span>
                  </div>
                  <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((parseFloat(state.metros) || 0) / 300 * 100, 100)}%`, backgroundColor: color }} />
                  </div>
                  {state.servicio.minimoM2 && <p className="text-xs text-slate-400 mt-2">Mínimo {state.servicio.minimoM2} m²</p>}
                </div>
              )}

              {state.servicio.unidad === "habitaciones" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <h2 className="font-bold text-slate-800 mb-5">¿Cómo es tu vivienda?</h2>
                  <div className="flex flex-col gap-5">
                    {[
                      { key: "banos", label: "Baños", emoji: "🚿", m2: 6, tipo: "contador" },
                      { key: "dormitorios", label: "Dormitorios", emoji: "🛏️", m2: 12, tipo: "contador" },
                    ].map(({ key, label, emoji, m2 }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{emoji}</span>
                          <div>
                            <div className="font-semibold text-slate-700 text-sm">{label}</div>
                            <div className="text-xs text-slate-400">~{m2} m² c/u</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => update({ habitaciones: { ...state.habitaciones, [key]: Math.max(0, (state.habitaciones[key as keyof Habitaciones] as number) - 1) } })}
                            className="w-9 h-9 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-300 transition-colors text-lg leading-none"
                          >−</button>
                          <span className="w-6 text-center font-bold text-slate-800 text-lg">{state.habitaciones[key as keyof Habitaciones]}</span>
                          <button
                            onClick={() => update({ habitaciones: { ...state.habitaciones, [key]: (state.habitaciones[key as keyof Habitaciones] as number) + 1 } })}
                            className="w-9 h-9 rounded-full border-2 font-bold text-white transition-colors text-lg leading-none"
                            style={{ backgroundColor: color, borderColor: color }}
                          >+</button>
                        </div>
                      </div>
                    ))}
                    {[
                      { key: "salon", label: "Salón / Comedor", emoji: "🛋️", m2: 28 },
                      { key: "cocina", label: "Cocina", emoji: "🍳", m2: 10 },
                      { key: "pasillo", label: "Pasillos / Otros", emoji: "🚪", m2: 8 },
                    ].map(({ key, label, emoji, m2 }) => {
                      const val = state.habitaciones[key as keyof Habitaciones] as boolean;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{emoji}</span>
                            <div>
                              <div className="font-semibold text-slate-700 text-sm">{label}</div>
                              <div className="text-xs text-slate-400">~{m2} m²</div>
                            </div>
                          </div>
                          <button
                            onClick={() => update({ habitaciones: { ...state.habitaciones, [key]: !val } })}
                            className="w-12 h-6 rounded-full transition-colors"
                            style={{ backgroundColor: val ? color : "#e2e8f0" }}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${val ? "translate-x-6" : "translate-x-0"}`} />
                          </button>
                        </div>
                      );
                    })}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-slate-500">Superficie total estimada</span>
                      <span className="font-bold text-slate-800">{getM2()} m²</span>
                    </div>
                  </div>
                </div>
              )}

              {extrasDisponibles.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <h2 className="font-bold text-slate-800 mb-1">¿Necesitas algo más?</h2>
                  <p className="text-xs text-slate-400 mb-4">Servicios adicionales opcionales</p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {extrasDisponibles.map((e) => {
                      const activo = state.extrasIds.includes(e.id);
                      return (
                        <button
                          key={e.id}
                          onClick={() => toggleExtra(e.id)}
                          className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left"
                          style={{
                            borderColor: activo ? color : "#e2e8f0",
                            backgroundColor: activo ? `${color}08` : "white",
                          }}
                        >
                          <span className="text-xl">{e.icono}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-700 truncate">{e.nombre}</div>
                            <div className="text-xs text-slate-400 truncate">{e.descripcion}</div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                            style={{ backgroundColor: activo ? color : "transparent", borderColor: activo ? color : "#cbd5e1" }}>
                            {activo && <span className="text-white text-xs">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 4 — Resultados */}
          {state.step === 4 && state.servicio && zona && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-800">Tu estimación</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {state.servicio.nombre} · {zona.nombre}
                      {state.servicio.unidad !== "fijo" && ` · ${getM2()} m²`}
                    </p>
                  </div>
                  <button onClick={() => setDesglose(!desglose)} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 transition-colors">
                    {desglose ? "Ocultar desglose" : "Ver desglose"}
                  </button>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100">
                  {(["basico", "estandar", "premium"] as const).map((nivelId, i) => {
                    const nivel = NIVELES[i];
                    const r = calcular(nivelId);
                    const isMiddle = nivelId === "estandar";
                    return (
                      <div key={nivelId} className="p-4 flex flex-col" style={{ backgroundColor: isMiddle ? `${color}06` : "white" }}>
                        {isMiddle && (
                          <span className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color }}>
                            ★ Popular
                          </span>
                        )}
                        <div className="font-bold text-slate-800 mb-0.5 text-sm">{nivel.nombre}</div>
                        <div className="text-xs text-slate-400 mb-3 leading-tight">{nivel.descripcion}</div>
                        <div className="mt-auto">
                          <div className="text-base font-extrabold leading-tight" style={{ color: isMiddle ? color : "#1e293b" }}>
                            {fmt(r.min)}
                          </div>
                          <div className="text-xs text-slate-400">— {fmt(r.max)}</div>
                        </div>
                        {desglose && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                            {r.desglosado.map((d, idx) => (
                              <div key={idx} className="flex justify-between gap-1">
                                <span className="text-xs text-slate-400 truncate">{d.concepto}</span>
                                <span className="text-xs font-semibold text-slate-600 flex-shrink-0">{fmt(d.importe)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="px-4 pb-4">
                  <p className="text-xs text-slate-400 text-center">Precios orientativos. El presupuesto final puede variar según el estado del inmueble.</p>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-bold text-slate-800 mb-1">¿Te interesa? Es gratis y sin compromiso</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Cuéntanos tu proyecto y te enviamos un presupuesto detallado en menos de 24h.
                  {config.contactTelefono && <span className="block mt-1 text-xs">📞 {config.contactTelefono}</span>}
                </p>
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className={`w-full py-4 text-white font-bold text-base transition-opacity hover:opacity-90 ${config.estiloBoton}`}
                  style={{ backgroundColor: color }}
                >
                  {config.textoCTA}
                </button>
              </div>

              {/* Powered by */}
              <div className="text-center">
                <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-slate-300 hover:text-slate-400 transition-colors">
                  Calculadora powered by <span className="font-semibold">Intervisión</span>
                </a>
              </div>

              <button
                onClick={() => setState({ step: 1, servicio: null, zonaId: null, metros: "", habitaciones: DEFAULT_HAB, extrasIds: [] })}
                className="text-sm text-slate-400 hover:text-slate-600 text-center transition-colors"
              >
                ← Hacer otra consulta
              </button>
            </div>
          )}

          {/* Navegación */}
          {state.step < 4 && (
            <div className={`flex mt-5 ${state.step > 1 ? "justify-between" : "justify-end"}`}>
              {state.step > 1 && (
                <button
                  onClick={() => update({ step: (state.step - 1) as Step })}
                  className={`px-5 py-3 border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 transition-colors ${config.estiloBoton}`}
                >
                  ← Atrás
                </button>
              )}
              <button
                onClick={() => puedeAvanzar() && update({ step: (state.step + 1) as Step })}
                disabled={!puedeAvanzar()}
                className={`px-8 py-3 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${config.estiloBoton}`}
                style={{ backgroundColor: puedeAvanzar() ? color : "#94a3b8" }}
              >
                {state.step === 3 ? "Ver presupuesto →" : "Siguiente →"}
              </button>
            </div>
          )}
        </div>
      </div>

      {mostrarFormulario && state.servicio && zona && (
        <FormularioContacto
          onCerrar={() => setMostrarFormulario(false)}
          resumenTexto={`${state.servicio.nombre} · ${zona.nombre}${state.servicio.unidad !== "fijo" ? ` · ${getM2()} m²` : ""}`}
          resumenHtml={`
            <strong>Servicio:</strong> ${state.servicio.nombre}<br/>
            <strong>Zona:</strong> ${zona.nombre}<br/>
            ${state.servicio.unidad !== "fijo" ? `<strong>Superficie:</strong> ${getM2()} m²<br/>` : ""}
            ${state.extrasIds.length > 0 ? `<strong>Extras:</strong> ${state.extrasIds.join(", ")}<br/>` : ""}
            <br/>
            <strong>Básico:</strong> ${fmt(calcular("basico").min)} – ${fmt(calcular("basico").max)}<br/>
            <strong>Estándar:</strong> ${fmt(calcular("estandar").min)} – ${fmt(calcular("estandar").max)}<br/>
            <strong>Premium:</strong> ${fmt(calcular("premium").min)} – ${fmt(calcular("premium").max)}
          `}
        />
      )}
    </div>
  );
}
