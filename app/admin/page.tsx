"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { SERVICIOS, EXTRAS } from "../data/services";

export default function AdminDashboard() {
  const { config } = useConfig();
  const [leadsCount, setLeadsCount] = useState(0);

  useEffect(() => {
    try {
      const leads = JSON.parse(localStorage.getItem("reforma-leads") || "[]");
      setLeadsCount(leads.length);
    } catch {}
  }, []);

  const stats = [
    { label: "Leads recibidos", valor: leadsCount, href: "/admin/leads", icono: "👥", sub: "solicitudes de presupuesto" },
    { label: "Servicios activos", valor: config.serviciosActivos.length, total: SERVICIOS.length, href: "/admin/servicios", icono: "🔧", sub: `de ${SERVICIOS.length} disponibles` },
    { label: "Zonas configuradas", valor: config.regionesActivas.length + config.zonas.length, href: "/admin/zonas", icono: "📍", sub: "en tu calculadora" },
    { label: "Extras activos", valor: config.extrasActivos.length, total: EXTRAS.length, href: "/admin/servicios", icono: "➕", sub: `de ${EXTRAS.length} disponibles` },
  ];

  const integracionesActivas = [
    config.contactEmail && "Email",
    config.webhookUrl && "GoHighLevel",
    config.whatsappNumero && "WhatsApp",
    config.airtableToken && "Airtable",
  ].filter(Boolean);

  return (
    <div className="p-4 sm:p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          {config.logo ? (
            <img src={config.logo} alt={config.nombre} className="h-10 object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: config.colorPrimario }}>
              {config.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{config.nombre}</h1>
            <p className="text-slate-400 text-xs sm:text-sm">Panel de control · Reforma Calc by Intervisión</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map(({ label, valor, href, icono, sub }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:shadow-md hover:border-slate-300 transition-all group">
            <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{icono}</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-0.5">{valor}</div>
            <div className="text-xs font-semibold text-slate-700 leading-tight">{label}</div>
            <div className="text-xs text-slate-400 mt-0.5 leading-tight hidden sm:block">{sub}</div>
            <div className="mt-2 sm:mt-3 text-xs text-slate-300 group-hover:text-orange-400 transition-colors">Configurar →</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">

        {/* Calculadora preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
          <h2 className="font-bold text-slate-800 mb-1">Tu calculadora</h2>
          <p className="text-xs text-slate-400 mb-4">Así la ven tus clientes ahora mismo</p>
          <div className="rounded-xl overflow-hidden border border-slate-100 mb-4" style={{ height: 200 }}>
            <iframe src={`/calc/${config.slug}`} width="100%" height="100%" className="border-0 scale-75 origin-top-left" style={{ width: "133%", height: "133%" }} />
          </div>
          <div className="flex gap-2">
            <Link href={`/calc/${config.slug}`} target="_blank"
              className="flex-1 text-center py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-colors">
              Abrir ↗
            </Link>
            <Link href="/admin/compartir"
              className="flex-1 text-center py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:border-orange-300 hover:text-orange-500 transition-colors">
              Compartir / Embed
            </Link>
          </div>
        </div>

        {/* Integraciones + acciones */}
        <div className="flex flex-col gap-4">

          {/* Integraciones estado */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">Integraciones</h2>
              <Link href="/admin/integraciones" className="text-xs text-orange-500 hover:underline">Configurar</Link>
            </div>
            {integracionesActivas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {integracionesActivas.map((i) => (
                  <span key={i as string} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-semibold border border-green-200">
                    ✓ {i}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Sin integraciones activas.</p>
            )}
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
            <h2 className="font-bold text-slate-800 mb-3">Acceso rápido</h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/admin/apariencia", label: "Cambiar logo o colores", icono: "🎨" },
                { href: "/admin/zonas", label: "Gestionar zonas CCAA", icono: "📍" },
                { href: "/admin/servicios", label: "Editar precios", icono: "🔧" },
                { href: "/admin/leads", label: "Ver leads recibidos", icono: "👥" },
              ].map(({ href, label, icono }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 py-2 text-sm text-slate-600 hover:text-orange-500 transition-colors group">
                  <span>{icono}</span>
                  <span className="group-hover:underline">{label}</span>
                  <span className="ml-auto text-slate-300 group-hover:text-orange-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Banner Intervisión */}
      <div className="rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:justify-between" style={{ backgroundColor: "#0a0a0a" }}>
        <div>
          <div className="text-white font-bold mb-1">¿Necesitas ayuda para captar más clientes?</div>
          <div className="text-sm" style={{ color: "#6a6a6a" }}>Intervisión · Sistema CRC para empresas de reformas</div>
        </div>
        <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl text-black text-sm font-bold transition-opacity hover:opacity-90 flex-shrink-0 self-start sm:self-auto"
          style={{ backgroundColor: "#fb923c" }}>
          Ver más →
        </a>
      </div>
    </div>
  );
}
