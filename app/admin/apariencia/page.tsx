"use client";

import { useState, useRef } from "react";
import { useConfig, Fuente, EstiloBoton } from "../../context/ConfigContext";

const COLORES = ["#fb923c", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b", "#06b6d4", "#0f172a"];
const FUENTES: Fuente[] = ["Inter", "Poppins", "Roboto", "Playfair Display"];
const BOTONES: { valor: EstiloBoton; label: string }[] = [
  { valor: "rounded-full", label: "Píldora" },
  { valor: "rounded-xl", label: "Redondeado" },
  { valor: "rounded-lg", label: "Suave" },
  { valor: "rounded-md", label: "Cuadrado" },
];

export default function AparienciaAdmin() {
  const { config, updateConfig } = useConfig();
  const [guardado, setGuardado] = useState(false);
  const [form, setForm] = useState({
    nombre: config.nombre,
    colorPrimario: config.colorPrimario,
    fuente: config.fuente,
    estiloBoton: config.estiloBoton,
    contactEmail: config.contactEmail,
    contactTelefono: config.contactTelefono,
    tituloBienvenida: config.tituloBienvenida,
    subtituloBienvenida: config.subtituloBienvenida,
    textoCTA: config.textoCTA,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const guardar = () => {
    updateConfig(form);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const subirLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateConfig({ logo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const eliminarLogo = () => {
    updateConfig({ logo: null });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Apariencia y textos</h1>
        <p className="text-slate-500 mt-1 text-sm">Personaliza cómo ven tu calculadora tus clientes</p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Logo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-slate-800 mb-1">Logo de tu empresa</h2>
          <p className="text-xs text-slate-400 mb-4">Se mostrará en la cabecera de la calculadora</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 flex-shrink-0">
              {config.logo ? (
                <img src={config.logo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-3xl">🏢</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => fileRef.current?.click()}
                className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-500 transition-colors">
                {config.logo ? "Cambiar logo" : "Subir logo"}
              </button>
              {config.logo && (
                <button onClick={eliminarLogo} className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-semibold text-red-400 hover:border-red-300 transition-colors">
                  Eliminar logo
                </button>
              )}
              <p className="text-xs text-slate-400">PNG o SVG recomendado</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={subirLogo} className="hidden" />
        </div>

        {/* Datos empresa */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-slate-800 mb-4">Datos de empresa</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">Nombre de la empresa</label>
              <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">Email de contacto</label>
                <input type="email" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">Teléfono</label>
                <input type="tel" value={form.contactTelefono} onChange={(e) => setForm((f) => ({ ...f, contactTelefono: e.target.value }))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Textos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-slate-800 mb-4">Textos de la calculadora</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">Título principal</label>
              <input value={form.tituloBienvenida} onChange={(e) => setForm((f) => ({ ...f, tituloBienvenida: e.target.value }))}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">Subtítulo</label>
              <textarea value={form.subtituloBienvenida} onChange={(e) => setForm((f) => ({ ...f, subtituloBienvenida: e.target.value }))}
                rows={2} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">Texto del botón principal</label>
              <input value={form.textoCTA} onChange={(e) => setForm((f) => ({ ...f, textoCTA: e.target.value }))}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
        </div>

        {/* Color */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-slate-800 mb-1">Color principal</h2>
          <p className="text-xs text-slate-400 mb-4">Botones, selecciones y acentos</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {COLORES.map((hex) => (
              <button key={hex} onClick={() => setForm((f) => ({ ...f, colorPrimario: hex }))}
                className="w-10 h-10 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: hex, boxShadow: form.colorPrimario === hex ? `0 0 0 3px white, 0 0 0 5px ${hex}` : "none" }} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-slate-200 flex-shrink-0" style={{ backgroundColor: form.colorPrimario }} />
            <input value={form.colorPrimario} onChange={(e) => setForm((f) => ({ ...f, colorPrimario: e.target.value }))}
              placeholder="#fb923c" className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-400 w-32" />
          </div>
        </div>

        {/* Fuente */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-slate-800 mb-4">Tipografía</h2>
          <div className="grid grid-cols-2 gap-3">
            {FUENTES.map((f) => (
              <button key={f} onClick={() => setForm((prev) => ({ ...prev, fuente: f }))}
                className={`p-3 rounded-xl border-2 text-left transition-all ${form.fuente === f ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}>
                <div className="text-xs text-slate-400 mb-1">Fuente</div>
                <div className="font-semibold text-slate-800 text-sm" style={{ fontFamily: f }}>{f}</div>
                <div className="text-xs text-slate-500 mt-1" style={{ fontFamily: f }}>Reforma integral</div>
              </button>
            ))}
          </div>
        </div>

        {/* Estilo botón */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-slate-800 mb-4">Estilo de botones</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BOTONES.map(({ valor, label }) => (
              <button key={valor} onClick={() => setForm((f) => ({ ...f, estiloBoton: valor }))}
                className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${form.estiloBoton === valor ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}>
                <div className={`px-3 py-1.5 text-xs font-bold text-white ${valor}`} style={{ backgroundColor: form.colorPrimario }}>
                  Botón
                </div>
                <span className="text-xs text-slate-500">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="font-bold text-slate-800 mb-4">Vista previa</h2>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              {config.logo ? (
                <img src={config.logo} alt="Logo" className="h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: form.colorPrimario }}>
                  {form.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-bold text-slate-800 text-sm" style={{ fontFamily: form.fuente }}>{form.nombre}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: form.fuente }}>{form.tituloBienvenida}</h3>
            <p className="text-sm text-slate-500 mb-4" style={{ fontFamily: form.fuente }}>{form.subtituloBienvenida}</p>
            <button className={`px-5 py-2.5 text-sm font-bold text-white ${form.estiloBoton}`} style={{ backgroundColor: form.colorPrimario, fontFamily: form.fuente }}>
              {form.textoCTA}
            </button>
          </div>
        </div>

        <button onClick={guardar}
          className={`py-3.5 rounded-2xl text-white font-bold text-base transition-all ${guardado ? "bg-green-500" : ""}`}
          style={{ backgroundColor: guardado ? "#10b981" : form.colorPrimario }}>
          {guardado ? "✓ Guardado correctamente" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
