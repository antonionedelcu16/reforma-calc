"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";

const COLORES_PRESET = [
  { hex: "#fb923c", nombre: "Naranja" },
  { hex: "#3b82f6", nombre: "Azul" },
  { hex: "#10b981", nombre: "Verde" },
  { hex: "#8b5cf6", nombre: "Morado" },
  { hex: "#ef4444", nombre: "Rojo" },
  { hex: "#f59e0b", nombre: "Amarillo" },
  { hex: "#06b6d4", nombre: "Cyan" },
  { hex: "#64748b", nombre: "Gris" },
];

export default function AparienciaAdmin() {
  const { config, updateConfig } = useConfig();
  const [guardado, setGuardado] = useState(false);
  const [form, setForm] = useState({
    nombre: config.nombre,
    colorPrimario: config.colorPrimario,
    contactEmail: config.contactEmail,
    contactTelefono: config.contactTelefono,
  });

  const guardar = () => {
    updateConfig(form);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Apariencia y contacto</h1>
        <p className="text-slate-500 mt-1">Personaliza cómo ven tu calculadora tus clientes</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Nombre empresa */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Datos de tu empresa</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Nombre de la empresa</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Reformas García S.L."
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Email de contacto</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                placeholder="info@tuempresa.com"
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Teléfono de contacto</label>
              <input
                type="tel"
                value={form.contactTelefono}
                onChange={(e) => setForm((f) => ({ ...f, contactTelefono: e.target.value }))}
                placeholder="600 000 000"
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Color */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-1">Color principal</h2>
          <p className="text-xs text-slate-400 mb-4">Se usará en botones, selecciones y acentos de la calculadora</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {COLORES_PRESET.map(({ hex, nombre }) => (
              <button
                key={hex}
                onClick={() => setForm((f) => ({ ...f, colorPrimario: hex }))}
                title={nombre}
                className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${form.colorPrimario === hex ? "ring-4 ring-offset-2 ring-slate-400 scale-110" : ""}`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">O introduce un color personalizado (hex)</label>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-slate-200" style={{ backgroundColor: form.colorPrimario }} />
              <input
                value={form.colorPrimario}
                onChange={(e) => setForm((f) => ({ ...f, colorPrimario: e.target.value }))}
                placeholder="#fb923c"
                className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-400 w-32"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Vista previa del botón</h2>
          <button
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: form.colorPrimario }}
          >
            Solicitar presupuesto gratuito →
          </button>
          <p className="text-xs text-slate-400 mt-3">Así se verá el botón principal en tu calculadora</p>
        </div>

        {/* Guardar */}
        <button
          onClick={guardar}
          className="px-6 py-3 rounded-xl text-white font-semibold transition-colors"
          style={{ backgroundColor: guardado ? "#10b981" : form.colorPrimario }}
        >
          {guardado ? "✓ Guardado" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
