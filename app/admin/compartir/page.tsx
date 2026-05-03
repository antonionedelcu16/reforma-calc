"use client";

import { useState } from "react";
import { useConfig, toSlug } from "../../context/ConfigContext";

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

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Compartir calculadora</h1>
        <p className="text-slate-500 mt-1">Comparte tu calculadora o incrústala directamente en tu web</p>
      </div>

      {/* URL slug */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
        <h2 className="font-bold text-slate-800 mb-1">Tu URL única</h2>
        <p className="text-xs text-slate-400 mb-4">Esta es la dirección de tu calculadora. Puedes personalizarla.</p>

        <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 mb-3">
          <span className="text-sm text-slate-400 flex-shrink-0">{base}/calc/</span>
          {editandoSlug ? (
            <input
              value={slugTemp}
              onChange={(e) => setSlugTemp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && guardarSlug()}
              className="flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none border-b-2 border-orange-400"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm font-semibold text-slate-800">{config.slug}</span>
          )}
          {editandoSlug ? (
            <div className="flex gap-2">
              <button onClick={guardarSlug} className="text-xs font-bold text-orange-500 hover:text-orange-600">Guardar</button>
              <button onClick={() => { setEditandoSlug(false); setSlugTemp(config.slug); }} className="text-xs text-slate-400 hover:text-slate-600">Cancelar</button>
            </div>
          ) : (
            <button onClick={() => setEditandoSlug(true)} className="text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors">Editar</button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => copiar(urlDirecta, "url")}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-500 transition-colors"
          >
            {copiado === "url" ? "✓ Copiado" : "📋 Copiar link"}
          </button>
          <a
            href={urlDirecta}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-500 transition-colors text-center"
          >
            👁️ Abrir en nueva pestaña ↗
          </a>
        </div>
      </div>

      {/* Embed iframe */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
        <h2 className="font-bold text-slate-800 mb-1">Incrustar en tu web</h2>
        <p className="text-xs text-slate-400 mb-4">Pega este código HTML donde quieras mostrar la calculadora en tu sitio web</p>

        <div className="bg-slate-900 rounded-xl p-4 mb-3 relative group">
          <pre className="text-xs text-slate-300 font-mono whitespace-pre overflow-x-auto">{iframeCode}</pre>
          <button
            onClick={() => copiar(iframeCode, "iframe")}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-slate-700 text-slate-300 hover:bg-orange-500 hover:text-white"
          >
            {copiado === "iframe" ? "✓ Copiado" : "Copiar código"}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
          💡 <strong>¿Cómo usarlo?</strong> En tu web WordPress, Wix o cualquier CMS, añade un bloque de <strong>HTML personalizado</strong> y pega el código. La calculadora aparecerá directamente en tu página.
        </div>
      </div>

      {/* Preview iframe */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
        <h2 className="font-bold text-slate-800 mb-4">Vista previa del widget</h2>
        <div className="rounded-xl overflow-hidden border border-slate-200" style={{ height: 500 }}>
          <iframe
            src={`/calc/${config.slug}`}
            width="100%"
            height="100%"
            title="Preview calculadora"
            className="border-0"
          />
        </div>
      </div>

      {/* Instrucciones por plataforma */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">Cómo instalarlo en tu web</h2>
        <div className="flex flex-col gap-3">
          {[
            { plataforma: "WordPress", icono: "🔵", pasos: "Edita la página → Añade bloque «HTML personalizado» → Pega el código" },
            { plataforma: "Wix", icono: "⚫", pasos: "Editor → Añadir elementos → Embed → HTML personalizado → Pega el código" },
            { plataforma: "Squarespace", icono: "🟤", pasos: "Editar sección → + → Embed → Pega el código" },
            { plataforma: "Webflow", icono: "🔷", pasos: "Añade elemento «Embed» → Pega el código" },
            { plataforma: "HTML puro", icono: "🟠", pasos: "Pega el código donde quieras mostrarlo en tu archivo .html" },
          ].map(({ plataforma, icono, pasos }) => (
            <div key={plataforma} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xl flex-shrink-0">{icono}</span>
              <div>
                <div className="font-semibold text-slate-800 text-sm">{plataforma}</div>
                <div className="text-xs text-slate-500 mt-0.5">{pasos}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
