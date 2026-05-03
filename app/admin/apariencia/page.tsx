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
const card = { backgroundColor: "#111111", border: "1px solid #1a1a1a" };
const inputStyle = { backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e", color: "#f1f5f9" };

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
    reader.onload = (ev) => updateConfig({ logo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const Section = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
    <div className="rounded-2xl p-5 sm:p-6" style={card}>
      <h2 className="font-bold text-white mb-0.5">{title}</h2>
      {sub && <p className="text-xs mb-4" style={{ color: "#3a3a3a" }}>{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Apariencia</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>Personaliza cómo ven tu calculadora tus clientes</p>
      </div>

      <div className="flex flex-col gap-4">

        {/* Logo */}
        <Section title="Logo de tu empresa" sub="Se mostrará en la cabecera de la calculadora">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ backgroundColor: "#0f0f0f", border: "1px dashed #2a2a2a" }}>
              {config.logo ? (
                <img src={config.logo} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl">🏢</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => fileRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", color: "#000" }}>
                {config.logo ? "Cambiar logo" : "Subir logo"}
              </button>
              {config.logo && (
                <button onClick={() => updateConfig({ logo: null })}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ backgroundColor: "#1a1a1a", color: "#f87171", border: "1px solid #222" }}>
                  Eliminar
                </button>
              )}
              <p className="text-xs" style={{ color: "#3a3a3a" }}>PNG o SVG recomendado</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={subirLogo} className="hidden" />
        </Section>

        {/* Datos empresa */}
        <Section title="Datos de empresa">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Nombre de la empresa</label>
              <input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Email de contacto</label>
                <input type="email" value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Teléfono</label>
                <input type="tel" value={form.contactTelefono} onChange={(e) => setForm((f) => ({ ...f, contactTelefono: e.target.value }))}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
              </div>
            </div>
          </div>
        </Section>

        {/* Textos */}
        <Section title="Textos de la calculadora">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Título principal</label>
              <input value={form.tituloBienvenida} onChange={(e) => setForm((f) => ({ ...f, tituloBienvenida: e.target.value }))}
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Subtítulo</label>
              <textarea value={form.subtituloBienvenida} onChange={(e) => setForm((f) => ({ ...f, subtituloBienvenida: e.target.value }))}
                rows={2} className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Texto del botón principal</label>
              <input value={form.textoCTA} onChange={(e) => setForm((f) => ({ ...f, textoCTA: e.target.value }))}
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section title="Color principal" sub="Botones, selecciones y acentos de la calculadora">
          <div className="flex flex-wrap gap-3 mb-4">
            {COLORES.map((hex) => (
              <button key={hex} onClick={() => setForm((f) => ({ ...f, colorPrimario: hex }))}
                className="w-10 h-10 rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: hex, boxShadow: form.colorPrimario === hex ? `0 0 0 3px #0a0a0a, 0 0 0 5px ${hex}` : "none" }} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ backgroundColor: form.colorPrimario }} />
            <input value={form.colorPrimario} onChange={(e) => setForm((f) => ({ ...f, colorPrimario: e.target.value }))}
              placeholder="#fb923c" className="rounded-xl px-3 py-2 text-sm font-mono focus:outline-none w-32"
              style={inputStyle} />
          </div>
        </Section>

        {/* Fuente */}
        <Section title="Tipografía">
          <div className="grid grid-cols-2 gap-2.5">
            {FUENTES.map((f) => (
              <button key={f} onClick={() => setForm((prev) => ({ ...prev, fuente: f }))}
                className="p-3.5 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: "#0f0f0f",
                  border: form.fuente === f ? `1px solid ${form.colorPrimario}60` : "1px solid #1e1e1e",
                  boxShadow: form.fuente === f ? `0 0 12px ${form.colorPrimario}20` : "none",
                }}>
                <div className="text-xs mb-1" style={{ color: "#3a3a3a" }}>Fuente</div>
                <div className="font-bold text-white text-sm" style={{ fontFamily: f }}>{f}</div>
                <div className="text-xs mt-0.5" style={{ fontFamily: f, color: "#4a4a4a" }}>Reforma integral</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Estilo botón */}
        <Section title="Estilo de botones">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {BOTONES.map(({ valor, label }) => (
              <button key={valor} onClick={() => setForm((f) => ({ ...f, estiloBoton: valor }))}
                className="flex flex-col items-center gap-2.5 p-3.5 rounded-xl transition-all"
                style={{
                  backgroundColor: "#0f0f0f",
                  border: form.estiloBoton === valor ? `1px solid ${form.colorPrimario}60` : "1px solid #1e1e1e",
                }}>
                <div className={`px-3 py-1.5 text-xs font-black text-white ${valor}`}
                  style={{ backgroundColor: form.colorPrimario }}>
                  Botón
                </div>
                <span className="text-xs" style={{ color: form.estiloBoton === valor ? form.colorPrimario : "#4a4a4a" }}>{label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Preview */}
        <Section title="Vista previa">
          <div className="rounded-xl p-5" style={{ backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e" }}>
            <div className="flex items-center gap-2 mb-4">
              {config.logo ? (
                <img src={config.logo} alt="Logo" className="h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                  style={{ backgroundColor: form.colorPrimario }}>
                  {form.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-bold text-white text-sm" style={{ fontFamily: form.fuente }}>{form.nombre}</span>
            </div>
            <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: form.fuente }}>{form.tituloBienvenida}</h3>
            <p className="text-sm mb-4" style={{ fontFamily: form.fuente, color: "#6a6a6a" }}>{form.subtituloBienvenida}</p>
            <button className={`px-5 py-2.5 text-sm font-black text-white ${form.estiloBoton}`}
              style={{ backgroundColor: form.colorPrimario, fontFamily: form.fuente }}>
              {form.textoCTA}
            </button>
          </div>
        </Section>

        <button onClick={guardar}
          className="py-4 rounded-2xl font-black text-base transition-all hover:opacity-90"
          style={{ background: guardado ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #fb923c, #f97316)", color: "#000" }}>
          {guardado ? "✓ Guardado correctamente" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
