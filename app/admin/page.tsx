"use client";

import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { SERVICIOS, EXTRAS } from "../data/services";

export default function AdminDashboard() {
  const { config } = useConfig();

  const stats = [
    { label: "Servicios activos", valor: config.serviciosActivos.length, total: SERVICIOS.length, href: "/admin/servicios", icono: "🔧" },
    { label: "Zonas configuradas", valor: config.zonas.length, total: null, href: "/admin/zonas", icono: "📍" },
    { label: "Extras disponibles", valor: config.extrasActivos.length, total: EXTRAS.length, href: "/admin/servicios", icono: "➕" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Bienvenido al panel</h1>
        <p className="text-slate-500 mt-1">Configura tu calculadora personalizada para tus clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, valor, total, href, icono }) => (
          <Link key={label} href={href} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-300 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{icono}</span>
              <span className="text-xs text-slate-400 group-hover:text-orange-500 transition-colors">Configurar →</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {valor}
              {total !== null && <span className="text-slate-400 text-xl font-normal">/{total}</span>}
            </div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-700 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/admin/servicios", label: "Activar o desactivar servicios", desc: "Elige qué reformas ofreces", icono: "🔧" },
            { href: "/admin/zonas", label: "Gestionar zonas de trabajo", desc: "Define tus zonas y precios", icono: "📍" },
            { href: "/admin/apariencia", label: "Personalizar apariencia", desc: "Logo, colores y contacto", icono: "🎨" },
            { href: "/", label: "Ver calculadora de clientes", desc: "Así lo ven tus clientes", icono: "👁️" },
          ].map(({ href, label, desc, icono }) => (
            <Link key={href} href={href} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
              <span className="text-2xl">{icono}</span>
              <div>
                <div className="text-sm font-semibold text-slate-700">{label}</div>
                <div className="text-xs text-slate-400">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Link compartible */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
        <h2 className="font-semibold text-slate-700 mb-2">🔗 Tu link de calculadora</h2>
        <p className="text-sm text-slate-500 mb-3">Comparte este enlace con tus clientes o incrústalo en tu web</p>
        <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-lg px-4 py-2.5">
          <span className="text-sm text-slate-600 flex-1 font-mono">localhost:3000/calc/{config.nombre.toLowerCase().replace(/\s+/g, "-")}</span>
          <button className="text-xs font-semibold text-orange-500 hover:text-orange-600">Copiar</button>
        </div>
      </div>
    </div>
  );
}
