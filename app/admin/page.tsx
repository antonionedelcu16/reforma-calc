"use client";

import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { SERVICIOS, EXTRAS } from "../data/services";

export default function AdminDashboard() {
  const { config } = useConfig();

  const stats = [
    { label: "Servicios activos", valor: config.serviciosActivos.length, total: SERVICIOS.length, href: "/admin/servicios", icono: "🔧", color: "bg-blue-50 text-blue-600" },
    { label: "Zonas configuradas", valor: config.zonas.length, total: null, href: "/admin/zonas", icono: "📍", color: "bg-green-50 text-green-600" },
    { label: "Extras disponibles", valor: config.extrasActivos.length, total: EXTRAS.length, href: "/admin/servicios", icono: "➕", color: "bg-purple-50 text-purple-600" },
  ];

  const acciones = [
    { href: "/admin/servicios", label: "Servicios y precios", desc: "Activa servicios y personaliza precios por nivel", icono: "🔧" },
    { href: "/admin/zonas", label: "Zonas de trabajo", desc: "Define tus zonas y ajuste de precios", icono: "📍" },
    { href: "/admin/apariencia", label: "Apariencia y contacto", desc: "Logo, colores, email y teléfono", icono: "🎨" },
  ];

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido 👋</h1>
        <p className="text-slate-500 mt-1">Configura tu calculadora y compártela con tus clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, valor, total, href, icono, color }) => (
          <Link key={label} href={href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${color}`}>
              {icono}
            </div>
            <div className="text-3xl font-extrabold text-slate-800">
              {valor}
              {total !== null && <span className="text-slate-300 text-xl font-normal">/{total}</span>}
            </div>
            <div className="text-sm text-slate-500 mt-1 flex items-center justify-between">
              {label}
              <span className="text-xs text-slate-300 group-hover:text-orange-400 transition-colors">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Acciones */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Configuración</h2>
        <div className="grid grid-cols-1 gap-3">
          {acciones.map(({ href, label, desc, icono }) => (
            <Link key={href} href={href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-orange-200 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                {icono}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{label}</div>
                <div className="text-sm text-slate-400 mt-0.5">{desc}</div>
              </div>
              <span className="text-slate-300 group-hover:text-orange-400 transition-colors text-xl">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Link calculadora */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-bold text-slate-800">🔗 Tu link de calculadora</h2>
            <p className="text-sm text-slate-500 mt-0.5">Comparte este enlace en tu web, WhatsApp o redes sociales</p>
          </div>
          <Link href="/" target="_blank" className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors px-3 py-1.5 bg-white rounded-lg border border-orange-200">
            Abrir ↗
          </Link>
        </div>
        <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-4 py-3">
          <span className="text-sm text-slate-500 flex-1 font-mono truncate">
            localhost:3000
          </span>
          <button
            onClick={() => navigator.clipboard.writeText("http://localhost:3000")}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex-shrink-0"
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  );
}
