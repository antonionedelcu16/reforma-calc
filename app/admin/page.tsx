"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { SERVICIOS, EXTRAS } from "../data/services";

const card = { backgroundColor: "#111111", border: "1px solid #1a1a1a" };
const cardHover = "hover:border-orange-500/30 transition-all";

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
    { label: "Leads totales", valor: leadsCount, href: "/admin/leads", icono: "👥", color: "#fb923c", sub: "solicitudes recibidas" },
    { label: "Servicios activos", valor: config.serviciosActivos.length, href: "/admin/servicios", icono: "🔧", color: "#60a5fa", sub: `de ${SERVICIOS.length} disponibles` },
    { label: "Zonas activas", valor: config.regionesActivas.length + config.zonas.length, href: "/admin/zonas", icono: "📍", color: "#34d399", sub: "en tu calculadora" },
    { label: "Extras activos", valor: config.extrasActivos.length, href: "/admin/servicios", icono: "➕", color: "#a78bfa", sub: `de ${EXTRAS.length} disponibles` },
  ];

  const integracionesActivas = [
    config.contactEmail && { nombre: "Email", color: "#60a5fa" },
    config.webhookUrl && { nombre: "GoHighLevel", color: "#fb923c" },
    config.whatsappNumero && { nombre: "WhatsApp", color: "#34d399" },
    config.airtableToken && { nombre: "Airtable", color: "#a78bfa" },
  ].filter(Boolean) as { nombre: string; color: string }[];

  const acciones = [
    { href: "/admin/apariencia", label: "Personalizar apariencia", sub: "Logo, colores y textos", icono: "🎨", color: "#fb923c" },
    { href: "/admin/zonas", label: "Gestionar zonas", sub: "CCAA y zonas propias", icono: "📍", color: "#34d399" },
    { href: "/admin/servicios", label: "Ajustar precios", sub: "Servicios y extras", icono: "🔧", color: "#60a5fa" },
    { href: "/admin/integraciones", label: "Conectar CRM", sub: "GHL, Airtable, WhatsApp", icono: "⚡", color: "#a78bfa" },
    { href: "/admin/compartir", label: "Publicar calculadora", sub: "Link directo o embed", icono: "🚀", color: "#f59e0b" },
    { href: "/admin/leads", label: "Ver leads", sub: "Gestionar solicitudes", icono: "👥", color: "#fb923c" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8 pt-2">
        <div className="flex items-center gap-4 mb-1">
          {config.logo ? (
            <img src={config.logo} alt={config.nombre} className="h-10 object-contain" />
          ) : (
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${config.colorPrimario}, ${config.colorPrimario}cc)`, boxShadow: `0 0 24px ${config.colorPrimario}40` }}>
              {config.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{config.nombre}</h1>
            <p className="text-sm" style={{ color: "#4a4a4a" }}>Panel de control · Reforma Calc <span style={{ color: "#fb923c" }}>by Intervisión</span></p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, valor, href, icono, color, sub }) => (
          <Link key={label} href={href}
            className={`rounded-2xl p-4 sm:p-5 ${cardHover} group`}
            style={card}>
            <div className="flex items-start justify-between mb-3">
              <div className="text-xl">{icono}</div>
              <div className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: color + "15", color }}>
                →
              </div>
            </div>
            <div className="text-3xl font-black mb-1" style={{ color }}>{valor}</div>
            <div className="text-xs font-semibold text-white mb-0.5">{label}</div>
            <div className="text-xs hidden sm:block" style={{ color: "#3a3a3a" }}>{sub}</div>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Acciones rápidas */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-sm">Acciones rápidas</h2>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#1a1a1a", color: "#fb923c" }}>
              {acciones.length} opciones
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {acciones.map(({ href, label, sub, icono, color }) => (
              <Link key={href} href={href}
                className={`rounded-xl p-3.5 ${cardHover} group flex flex-col gap-1`}
                style={{ backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a" }}>
                <span className="text-lg">{icono}</span>
                <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">{label}</div>
                <div className="text-xs leading-tight" style={{ color: "#3a3a3a" }}>{sub}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Estado del sistema */}
        <div className="flex flex-col gap-4">

          {/* Calculadora preview link */}
          <div className="rounded-2xl p-5 flex flex-col" style={card}>
            <h2 className="font-bold text-white text-sm mb-1">Tu calculadora</h2>
            <p className="text-xs mb-4" style={{ color: "#3a3a3a" }}>Comparte con tus clientes</p>
            <div className="rounded-xl p-3 mb-3 flex items-center gap-2 overflow-hidden" style={{ backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a" }}>
              <span className="text-xs" style={{ color: "#3a3a3a" }}>/calc/</span>
              <span className="text-xs font-bold text-white truncate">{config.slug}</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <Link href={`/calc/${config.slug}`} target="_blank"
                className="flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all"
                style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", color: "#000" }}>
                Abrir ↗
              </Link>
              <Link href="/admin/compartir"
                className="flex-1 text-center py-2 text-xs font-semibold rounded-xl transition-all"
                style={{ backgroundColor: "#161616", color: "#6a6a6a", border: "1px solid #222" }}>
                Embed
              </Link>
            </div>
          </div>

          {/* Integraciones */}
          <div className="rounded-2xl p-5 flex-1" style={card}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white text-sm">Integraciones</h2>
              <Link href="/admin/integraciones"
                className="text-xs font-semibold transition-colors hover:text-orange-300"
                style={{ color: "#fb923c" }}>
                Configurar →
              </Link>
            </div>
            {integracionesActivas.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {integracionesActivas.map((i) => (
                  <div key={i.nombre} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: i.color }} />
                    <span style={{ color: "#8a8a8a" }}>{i.nombre}</span>
                    <span className="ml-auto text-xs" style={{ color: i.color }}>Activo</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-xs mb-2" style={{ color: "#3a3a3a" }}>Sin integraciones</p>
                <Link href="/admin/integraciones"
                  className="text-xs font-semibold underline"
                  style={{ color: "#fb923c" }}>
                  Conectar ahora
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner Intervisión */}
      <div className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: "linear-gradient(135deg, #111111 0%, #0f0f0f 100%)", border: "1px solid #1a1a1a", position: "relative", overflow: "hidden" }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #fb923c, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-black font-black text-xs"
              style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>IV</div>
            <span className="text-xs font-bold" style={{ color: "#fb923c" }}>INTERVISIÓN</span>
          </div>
          <div className="text-white font-bold text-sm sm:text-base mb-0.5">¿Quieres captar más clientes de reformas?</div>
          <div className="text-xs" style={{ color: "#4a4a4a" }}>Sistema CRC completo · Estrategia, captación y conversión</div>
        </div>
        <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
          className="relative px-5 py-2.5 rounded-xl text-black text-sm font-black transition-all hover:opacity-90 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>
          Más info →
        </a>
      </div>
    </div>
  );
}
