"use client";

import { useState } from "react";
import {
  SERVICIOS, ZONAS_DEFAULT, EXTRAS, NIVELES,
  TipoReforma, Zona, Habitaciones,
  calcularM2Habitaciones,
} from "../data/services";

type Step = 1 | 2 | 3 | 4;

type State = {
  step: Step;
  servicio: TipoReforma | null;
  zona: Zona | null;
  metros: string;
  habitaciones: Habitaciones;
  extrasIds: string[];
};

const DEFAULT_HABITACIONES: Habitaciones = {
  banos: 1,
  dormitorios: 2,
  salon: true,
  cocina: false,
  pasillo: false,
};

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export default function Calculator() {
  const [state, setState] = useState<State>({
    step: 1,
    servicio: null,
    zona: null,
    metros: "",
    habitaciones: DEFAULT_HABITACIONES,
    extrasIds: [],
  });
  const [desglose, setDesglose] = useState(false);

  const update = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));

  const getMetros = (): number => {
    if (!state.servicio) return 0;
    if (state.servicio.unidad === "habitaciones") return calcularM2Habitaciones(state.habitaciones);
    return parseFloat(state.metros) || 0;
  };

  const calcular = (nivelId: "basico" | "estandar" | "premium") => {
    if (!state.servicio || !state.zona) return { base: 0, extras: 0, total: 0, min: 0, max: 0, desglosado: [] };

    const s = state.servicio;
    const precioBase = nivelId === "basico" ? s.precioBasico : nivelId === "estandar" ? s.precioEstandar : s.precioPremium;
    const m2 = getMetros();
    const base = s.unidad === "fijo" ? precioBase : precioBase * m2;
    const baseConZona = base * state.zona.multiplicador;

    const extrasSeleccionados = EXTRAS.filter((e) => state.extrasIds.includes(e.id));
    const extrasTotal = extrasSeleccionados.reduce((sum, e) => {
      const p = nivelId === "basico" ? e.precioBasico : nivelId === "estandar" ? e.precioEstandar : e.precioPremium;
      return sum + (e.unidad === "m2" ? p * m2 : p);
    }, 0);

    const total = baseConZona + extrasTotal;
    const nivel = NIVELES.find((n) => n.id === nivelId)!;

    const desglosado = [
      { concepto: "Mano de obra", importe: baseConZona * 0.55 },
      { concepto: "Materiales", importe: baseConZona * 0.38 },
      { concepto: "Gestión y varios", importe: baseConZona * 0.07 },
      ...extrasSeleccionados.map((e) => {
        const p = nivelId === "basico" ? e.precioBasico : nivelId === "estandar" ? e.precioEstandar : e.precioPremium;
        return { concepto: e.nombre, importe: e.unidad === "m2" ? p * m2 : p };
      }),
    ];

    return {
      base: baseConZona,
      extras: extrasTotal,
      total,
      min: Math.round(total * nivel.variacionMin),
      max: Math.round(total * nivel.variacionMax),
      desglosado,
    };
  };

  const puedeAvanzar = () => {
    if (state.step === 1) return !!state.servicio;
    if (state.step === 2) return !!state.zona;
    if (state.step === 3) {
      if (!state.servicio) return false;
      if (state.servicio.unidad === "fijo" || state.servicio.unidad === "habitaciones") return true;
      const m = parseFloat(state.metros);
      return m >= (state.servicio.minimoM2 || 1);
    }
    return true;
  };

  const extrasDisponibles = state.servicio
    ? EXTRAS.filter((e) => state.servicio!.extrasAplicables.includes(e.id))
    : [];

  const toggleExtra = (id: string) =>
    update({ extrasIds: state.extrasIds.includes(id) ? state.extrasIds.filter((x) => x !== id) : [...state.extrasIds, id] });

  const PASOS = ["Reforma", "Zona", "Detalles", "Resultado"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Calculadora de Reformas</h1>
          <p className="text-slate-500 text-sm">Obtén una estimación personalizada en segundos</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-6 px-2">
          {PASOS.map((nombre, i) => {
            const num = i + 1;
            const activo = state.step === num;
            const completado = state.step > num;
            return (
              <div key={num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    completado ? "bg-orange-400 text-white" : activo ? "bg-orange-400 text-white ring-4 ring-orange-100" : "bg-slate-200 text-slate-500"
                  }`}>
                    {completado ? "✓" : num}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${activo ? "text-orange-500" : completado ? "text-slate-600" : "text-slate-400"}`}>
                    {nombre}
                  </span>
                </div>
                {i < PASOS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 ${state.step > num ? "bg-orange-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Tipo de reforma */}
        {state.step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-700 mb-4">¿Qué quieres reformar?</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SERVICIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => update({ servicio: s, extrasIds: [] })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                    state.servicio?.id === s.id
                      ? "border-orange-400 bg-orange-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-2xl">{s.icono}</span>
                  <span className="text-xs font-medium text-slate-700 leading-tight">{s.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Zona */}
        {state.step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-700 mb-1">¿En qué zona está el inmueble?</h2>
            <p className="text-xs text-slate-400 mb-4">La ubicación influye en los precios de mano de obra y materiales</p>
            <div className="flex flex-col gap-3">
              {ZONAS_DEFAULT.map((z) => (
                <button
                  key={z.id}
                  onClick={() => update({ zona: z })}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    state.zona?.id === z.id
                      ? "border-orange-400 bg-orange-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-medium text-slate-700">{z.nombre}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    z.multiplicador > 1 ? "bg-red-100 text-red-600" :
                    z.multiplicador < 1 ? "bg-green-100 text-green-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {z.multiplicador > 1 ? `+${Math.round((z.multiplicador - 1) * 100)}%` :
                     z.multiplicador < 1 ? `-${Math.round((1 - z.multiplicador) * 100)}%` : "Precio base"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Configuración + Extras */}
        {state.step === 3 && state.servicio && (
          <div className="flex flex-col gap-4">

            {/* Metros o Habitaciones */}
            {state.servicio.unidad === "m2" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-700 mb-4">¿Cuántos metros cuadrados?</h2>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={state.metros}
                    onChange={(e) => update({ metros: e.target.value })}
                    placeholder="Ej: 80"
                    min={state.servicio.minimoM2 || 1}
                    className="flex-1 text-2xl font-semibold border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 text-slate-800"
                  />
                  <span className="text-xl font-medium text-slate-400">m²</span>
                </div>
                {state.servicio.minimoM2 && (
                  <p className="text-xs text-slate-400 mt-2">Mínimo {state.servicio.minimoM2} m²</p>
                )}
              </div>
            )}

            {state.servicio.unidad === "habitaciones" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-700 mb-4">¿Cómo es tu vivienda?</h2>
                <div className="flex flex-col gap-4">
                  {/* Baños */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-700">🚿 Baños</div>
                      <div className="text-xs text-slate-400">~6 m² por baño</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => update({ habitaciones: { ...state.habitaciones, banos: Math.max(0, state.habitaciones.banos - 1) } })}
                        className="w-8 h-8 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-colors">−</button>
                      <span className="w-6 text-center font-semibold text-slate-800">{state.habitaciones.banos}</span>
                      <button onClick={() => update({ habitaciones: { ...state.habitaciones, banos: state.habitaciones.banos + 1 } })}
                        className="w-8 h-8 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-colors">+</button>
                    </div>
                  </div>
                  {/* Dormitorios */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-700">🛏️ Dormitorios</div>
                      <div className="text-xs text-slate-400">~12 m² por dormitorio</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => update({ habitaciones: { ...state.habitaciones, dormitorios: Math.max(0, state.habitaciones.dormitorios - 1) } })}
                        className="w-8 h-8 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-colors">−</button>
                      <span className="w-6 text-center font-semibold text-slate-800">{state.habitaciones.dormitorios}</span>
                      <button onClick={() => update({ habitaciones: { ...state.habitaciones, dormitorios: state.habitaciones.dormitorios + 1 } })}
                        className="w-8 h-8 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-colors">+</button>
                    </div>
                  </div>
                  {/* Toggles */}
                  {[
                    { key: "salon", label: "🛋️ Salón / Comedor", m2: 28 },
                    { key: "cocina", label: "🍳 Cocina", m2: 10 },
                    { key: "pasillo", label: "🚪 Pasillos / Otros", m2: 8 },
                  ].map(({ key, label, m2 }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-700">{label}</div>
                        <div className="text-xs text-slate-400">~{m2} m²</div>
                      </div>
                      <button
                        onClick={() => update({ habitaciones: { ...state.habitaciones, [key]: !state.habitaciones[key as keyof Habitaciones] } })}
                        className={`w-12 h-6 rounded-full transition-colors ${state.habitaciones[key as keyof Habitaciones] ? "bg-orange-400" : "bg-slate-200"}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${state.habitaciones[key as keyof Habitaciones] ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-100 text-sm text-slate-500">
                    Total estimado: <span className="font-semibold text-slate-700">{getMetros()} m²</span>
                  </div>
                </div>
              </div>
            )}

            {/* Extras */}
            {extrasDisponibles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-700 mb-1">¿Necesitas algo más? <span className="text-slate-400 font-normal">(opcional)</span></h2>
                <p className="text-xs text-slate-400 mb-4">Selecciona los servicios adicionales que quieras incluir</p>
                <div className="flex flex-col gap-3">
                  {extrasDisponibles.map((e) => {
                    const activo = state.extrasIds.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        onClick={() => toggleExtra(e.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          activo ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xl">{e.icono}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-700">{e.nombre}</div>
                          <div className="text-xs text-slate-400">{e.descripcion}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activo ? "bg-orange-400 border-orange-400" : "border-slate-300"}`}>
                          {activo && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Resultados */}
        {state.step === 4 && state.servicio && state.zona && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-slate-700">Estimación de presupuesto</h2>
                <button onClick={() => setDesglose(!desglose)} className="text-xs text-orange-500 font-medium hover:underline">
                  {desglose ? "Ocultar desglose" : "Ver desglose"}
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                Para {state.servicio.nombre.toLowerCase()} · {state.zona.nombre}
                {state.servicio.unidad !== "fijo" && ` · ${getMetros()} m²`}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(["basico", "estandar", "premium"] as const).map((nivelId, i) => {
                  const nivel = NIVELES[i];
                  const resultado = calcular(nivelId);
                  const isMiddle = nivelId === "estandar";

                  return (
                    <div key={nivelId} className={`rounded-xl p-4 border-2 ${isMiddle ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-slate-50"}`}>
                      {isMiddle && <div className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-2">Más popular</div>}
                      <div className="text-base font-bold text-slate-800 mb-0.5">{nivel.nombre}</div>
                      <div className="text-xs text-slate-500 mb-3">{nivel.descripcion}</div>
                      <div className={`text-xl font-bold ${isMiddle ? "text-orange-500" : "text-slate-700"}`}>
                        {fmt(resultado.min)} – {fmt(resultado.max)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">estimación orientativa</div>

                      {desglose && (
                        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1.5">
                          {resultado.desglosado.map((d, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-slate-500">{d.concepto}</span>
                              <span className="font-medium text-slate-700">{fmt(d.importe)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-1">¿Te interesa? Pide tu presupuesto gratuito</h3>
              <p className="text-sm text-slate-500 mb-4">Te contactamos en menos de 24 horas con un presupuesto detallado sin compromiso.</p>
              <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors">
                Solicitar presupuesto gratuito →
              </button>
            </div>

            <button onClick={() => setState({ step: 1, servicio: null, zona: null, metros: "", habitaciones: DEFAULT_HABITACIONES, extrasIds: [] })}
              className="text-sm text-slate-400 hover:text-slate-600 text-center transition-colors">
              ← Hacer otra consulta
            </button>
          </div>
        )}

        {/* Navigation */}
        {state.step < 4 && (
          <div className="flex justify-between mt-4">
            {state.step > 1 ? (
              <button onClick={() => update({ step: (state.step - 1) as Step })}
                className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:border-slate-300 transition-colors">
                ← Atrás
              </button>
            ) : <div />}
            <button
              onClick={() => puedeAvanzar() && update({ step: (state.step + 1) as Step })}
              disabled={!puedeAvanzar()}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${
                puedeAvanzar()
                  ? "bg-orange-400 hover:bg-orange-500 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {state.step === 3 ? "Ver presupuesto →" : "Siguiente →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
