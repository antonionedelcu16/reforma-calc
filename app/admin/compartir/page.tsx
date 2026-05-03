"use client";

import { useState } from "react";
import { useConfig, toSlug } from "../../context/ConfigContext";

const card = { backgroundColor: "#111111", border: "1px solid #1a1a1a" };

export default function CompartirAdmin() {
  const { config, updateConfig } = useConfig();
  const [copiado, setCopiado] = useState<string | null>(null);
  const [editandoSlug, setEditandoSlug] = useState(false);
  const [slugTemp, setSlugTemp] = useState(config.slug);

  const base = typeof window !== "undefined" ? window.location.origin : "https://tudominio.com";
  const urlDirecta = `${base}/calc/${config.slug}`;
  const iframeCode = `<iframe\n  src="${urlDirecta}"\n  width="100%"\n  height="750"\n  frameborder="0"\n  style="border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);"\n  title="Calculadora de reformas - ${config.nombre}"\n></iframe>`;

  const copiar = async (texto: string, id: string) => {
    await navigator.clipboard.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const guardarSlug = () => {
    const clean = toSlug(slugTemp) || toSlug(config.nombre);
    updateConfig({ slug: clean });
    setSlugTemp(clean);
    setEditandoSlug(false);
  };

  const plataformas = [
    { nombre: "WordPress", icono: "🔵", pasos: "Edita la página → Bloque «HTML personalizado» → Pega el código" },
    { nombre: "Wix", icono: "⚫", pasos: "Editor → Añadir → Embed → HTML personalizado" },
    { nombre: "Squarespace", icono: "🟤", pasos: "Editar sección → + → Embed → Pega el código" },
    { nombre: "Webflow", icono: "🔷", pasos: "Añade elemento «Embed» → Pega el código" },
    { nombre: "HTML puro", icono: "🟠", pasos: "Pega el código donde quieras en tu archivo .html" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Compartir calculadora</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>Comparte tu calculadora o incrústala en tu web</p>
      </div>

      {/* URL slug */}
      <div className="rounded-2xl p-5 sm:p-6 mb-4" style={card}>
        <h2 className="font-bold text-white mb-0.5">Tu URL única</h2>
        <p className="text-xs mb-4" style={{ color: "#3a3a3a" }}>Esta es la dirección de tu calculadora. Personalízala.</p>

        <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-3 overflow-hidden" style={{ backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e" }}>
          <span className="text-xs flex-shrink-0 hidden sm:inline" style={{ color: "#3a3a3a" }}>{base}/calc/</span>
          <span className="text-xs flex-shrink-0 sm:hidden" style={{ color: "#3a3a3a" }}>/calc/</span>
          {editandoSlug ? (
            <input
              value={slugTemp}
              onChange={(e) => setSlugTemp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && guardarSlug()}
              className="flex-1 bg-transparent text-sm font-bold text-white outline-none min-w-0"
              style={{ borderBottom: "1px solid #fb923c" }}
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm font-bold text-white truncate">{config.slug}</span>
          )}
          {editandoSlug ? (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={guardarSlug} className="text-xs font-black hover:opacity-80" style={{ color: "#fb923c" }}>Guardar</button>
              <button onClick={() => { setEditandoSlug(false); setSlugTemp(config.slug); }} className="text-xs" style={{ color: "#4a4a4a" }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setEditandoSlug(true)} className="text-xs font-semibold hover:text-orange-400 transition-colors flex-shrink-0" style={{ color: "#4a4a4a" }}>
              Editar
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => copiar(urlDirecta, "url")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{ backgroundColor: "#1a1a1a", color: copiado === "url" ? "#34d399" : "#8a8a8a", border: "1px solid #222" }}>
            {copiado === "url" ? "✓ Copiado" : "📋 Copiar link"}
          </button>
          <a href={urlDirecta} target="_blank" rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 text-center"
            style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", color: "#000" }}>
            Abrir ↗
          </a>
        </div>
      </div>

      {/* Embed */}
      <div className="rounded-2xl p-5 sm:p-6 mb-4" style={card}>
        <h2 className="font-bold text-white mb-0.5">Incrustar en tu web</h2>
        <p className="text-xs mb-4" style={{ color: "#3a3a3a" }}>Pega este código HTML en cualquier página de tu web</p>

        <div className="rounded-xl p-4 mb-3 relative" style={{ backgroundColor: "#080808", border: "1px solid #1e1e1e" }}>
          <pre className="text-xs font-mono whitespace-pre overflow-x-auto pr-16" style={{ color: "#6a6a6a" }}>{iframeCode}</pre>
          <button onClick={() => copiar(iframeCode, "iframe")}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: copiado === "iframe" ? "#34d39920" : "#1a1a1a",
              color: copiado === "iframe" ? "#34d399" : "#6a6a6a",
              border: "1px solid #222",
            }}>
            {copiado === "iframe" ? "✓" : "Copiar"}
          </button>
        </div>

        <div className="rounded-xl p-3 text-xs" style={{ backgroundColor: "#0f1a2e", border: "1px solid #1a3a5a" }}>
          <span style={{ color: "#60a5fa" }}>
            💡 En WordPress, Wix, Squarespace o Webflow: añade un bloque de <strong>HTML personalizado</strong> y pega el código.
          </span>
        </div>
      </div>

      {/* Preview - solo desktop */}
      <div className="hidden sm:block rounded-2xl p-6 mb-4" style={card}>
        <h2 className="font-bold text-white mb-4">Vista previa del widget</h2>
        <div className="rounded-2xl overflow-hidden" style={{ height: 500, border: "1px solid #1e1e1e" }}>
          <iframe src={`/calc/${config.slug}`} width="100%" height="100%" title="Preview" className="border-0" />
        </div>
      </div>

      {/* Mobile: enlace en vez de iframe */}
      <div className="sm:hidden rounded-2xl p-5 mb-4" style={card}>
        <h2 className="font-bold text-white mb-3">Ver calculadora</h2>
        <a href={urlDirecta} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
          style={{ background: "linear-gradient(135deg, #fb923c22, #fb923c33)", color: "#fb923c", border: "1px solid #fb923c30" }}>
          👁 Abrir calculadora ↗
        </a>
      </div>

      {/* Instrucciones */}
      <div className="rounded-2xl p-5 sm:p-6" style={card}>
        <h2 className="font-bold text-white mb-4">Cómo instalarlo en tu web</h2>
        <div className="flex flex-col gap-2">
          {plataformas.map(({ nombre, icono, pasos }) => (
            <div key={nombre} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a" }}>
              <span className="text-xl flex-shrink-0">{icono}</span>
              <div>
                <div className="font-bold text-white text-sm">{nombre}</div>
                <div className="text-xs mt-0.5" style={{ color: "#4a4a4a" }}>{pasos}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
