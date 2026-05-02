"use client";

import { useState } from "react";
import { SERVICIOS, NIVELES, TipoReforma } from "../data/services";

export default function Calculator() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState<TipoReforma | null>(null);
  const [metros, setMetros] = useState<string>("");

  const calcularPrecio = (servicio: TipoReforma, nivel: "basico" | "estandar" | "premium") => {
    const precios = {
      basico: servicio.precioBasico,
      estandar: servicio.precioEstandar,
      premium: servicio.premioPremium,
    };
    if (servicio.unidad === "fijo") return precios[nivel];
    const m2 = parseFloat(metros) || 0;
    return precios[nivel] * m2;
  };

  const formatPrecio = (precio: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(precio);

  const mostrarResultados = servicioSeleccionado && (servicioSeleccionado.unidad === "fijo" || (parseFloat(metros) >= (servicioSeleccionado.minimoM2 || 1)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Calculadora de Reformas</h1>
          <p className="text-slate-500">Obtén una estimación instantánea para tu reforma</p>
        </div>

        {/* Paso 1: Tipo de reforma */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            1. ¿Qué quieres reformar?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SERVICIOS.map((servicio) => (
              <button
                key={servicio.id}
                onClick={() => { setServicioSeleccionado(servicio); setMetros(""); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                  servicioSeleccionado?.id === servicio.id
                    ? "border-orange-400 bg-orange-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="text-2xl">{servicio.icono}</span>
                <span className="text-xs font-medium text-slate-700 leading-tight">{servicio.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paso 2: Metros cuadrados (solo si aplica) */}
        {servicioSeleccionado && servicioSeleccionado.unidad === "m2" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              2. ¿Cuántos metros cuadrados?
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={metros}
                onChange={(e) => setMetros(e.target.value)}
                placeholder="Ej: 80"
                min={servicioSeleccionado.minimoM2 || 1}
                className="flex-1 text-2xl font-semibold border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 text-slate-800"
              />
              <span className="text-xl font-medium text-slate-400">m²</span>
            </div>
            {servicioSeleccionado.minimoM2 && (
              <p className="text-xs text-slate-400 mt-2">Mínimo {servicioSeleccionado.minimoM2} m²</p>
            )}
          </div>
        )}

        {/* Resultados */}
        {mostrarResultados && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Estimación de presupuesto
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Precios orientativos. El presupuesto final puede variar según la situación del inmueble.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(["basico", "estandar", "premium"] as const).map((nivelId, i) => {
                const nivel = NIVELES[i];
                const precio = calcularPrecio(servicioSeleccionado, nivelId);
                const isMiddle = nivelId === "estandar";

                return (
                  <div
                    key={nivelId}
                    className={`rounded-xl p-4 border-2 ${
                      isMiddle
                        ? "border-orange-400 bg-orange-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {isMiddle && (
                      <div className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-2">
                        Más popular
                      </div>
                    )}
                    <div className="text-lg font-bold text-slate-800 mb-1">{nivel.nombre}</div>
                    <div className="text-xs text-slate-500 mb-3">{nivel.descripcion}</div>
                    <div className={`text-2xl font-bold ${isMiddle ? "text-orange-500" : "text-slate-700"}`}>
                      {formatPrecio(precio)}
                    </div>
                    {servicioSeleccionado.unidad === "m2" && (
                      <div className="text-xs text-slate-400 mt-1">
                        {formatPrecio(nivelId === "basico" ? servicioSeleccionado.precioBasico : nivelId === "estandar" ? servicioSeleccionado.precioEstandar : servicioSeleccionado.premioPremium)}/m²
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600 text-center">
                ¿Te interesa? <span className="font-semibold text-slate-800">Solicita un presupuesto personalizado</span> y te contactamos en menos de 24h.
              </p>
              <button className="mt-3 w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition-colors">
                Solicitar presupuesto gratuito
              </button>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {!servicioSeleccionado && (
          <div className="text-center py-8 text-slate-400">
            <div className="text-5xl mb-3">👆</div>
            <p className="text-sm">Selecciona un tipo de reforma para ver la estimación</p>
          </div>
        )}
      </div>
    </div>
  );
}
