"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { SERVICIOS, EXTRAS } from "../data/services";

const IV_BLUE = "#2563eb";
const IV_BLUE_BRIGHT = "#3b82f6";
const IV_BG = "#070d1a";
const IV_SURFACE = "#0c1525";
const IV_CARD = "#101e35";
const IV_BORDER = "#1a2e4a";

const card = { backgroundColor: IV_CARD, border: `1px solid ${IV_BORDER}` };

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
    { label: "LEADS TOTALES", valor: leadsCount, href: "/admin/leads", sub: "solicitudes de presupuesto", color: IV_BLUE_BRIGHT },
    { label: "SERVICIOS ACTIVOS", valor: config.serviciosActivos.length, href: "/admin/servicios", sub: `de ${SERVICIOS.length} disponibles`, color: "#60a5fa" },
    { label: "ZONAS ACTIVAS", valor: config.regionesActivas.length + config.zonas.length, href: "/admin/zonas", sub: "en tu calculadora", color: "#93c5fd" },
    { label: "EXTRAS ACTIVOS", valor: config.extrasActivos.length, href: "/admin/servicios", sub: `de ${EXTRAS.length} opcionales`, color: "#bfdbfe" },
  ];

  const integraciones = [
    { nombre: "Email", activo: !!config.contactEmail, color: "#60a5fa", href: "/admin/apariencia" },
    { nombre: "GoHighLevel", activo: !!config.webhookUrl, color: IV_BLUE_BRIGHT, href: "/admin/integraciones" },
    { nombre: "WhatsApp", activo: !!config.whatsappNumero, color: "#34d399", href: "/admin/integraciones" },
    { nombre: "Airtable", activo: !!config.airtableToken, color: "#a78bfa", href: "/admin/integraciones" },
  ];

  const acciones = [
    { href: "/admin/apariencia", label: "Personalizar", sub: "Logo, colores y textos", icono: "🎨" },
    { href: "/admin/zonas", label: "Zonas CCAA", sub: "Configura tu zona", icono: "📍" },
    { href: "/admin/servicios", label: "Precios", sub: "Servicios y extras", icono: "🔧" },
    { href: "/admin/integraciones", label: "Integraciones", sub: "CRM y automatización", icono: "⚡" },
    { href: "/admin/compartir", label: "Publicar", sub: "Link y embed web", icono: "🚀" },
    { href: "/admin/leads", label: "Ver leads", sub: "Gestionar clientes", icono: "👥" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* Hero header */}
      <div className="mb-8 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{ backgroundColor: `${IV_BLUE}22`, color: IV_BLUE_BRIGHT, border: `1px solid ${IV_BLUE}44`, fontFamily: "Inter" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: IV_BLUE_BRIGHT }} />
          Panel de Control
        </div>
        <div className="flex items-center gap-4 mb-2">
          {config.logo ? (
            <img src={config.logo} alt={config.nombre} className="h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${config.colorPrimario}, ${config.colorPrimario}aa)`, boxShadow: `0 0 20px ${config.colorPrimario}40` }}>
              {config.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {config.nombre}
            </h1>
            <p className="text-sm" style={{ color: "#3a6090", fontFamily: "Inter" }}>
              Reforma Calc · <span style={{ color: IV_BLUE_BRIGHT }}>by Intervisión</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats — estilo landing Intervisión */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        style={{ borderRadius: "20px", padding: "1px", background: `linear-gradient(135deg, ${IV_BORDER}, transparent)` }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 col-span-2 lg:col-span-4 rounded-[19px] p-3 sm:p-4"
          style={{ backgroundColor: IV_CARD }}>
          {stats.map(({ label, valor, href, sub, color }, i) => (
            <Link key={label} href={href} className="group">
              <div className="text-3xl sm:text-4xl font-black mb-0.5" style={{ color, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {valor}<span className="text-lg" style={{ color: `${color}80` }}>+</span>
              </div>
              <div className="text-xs font-bold tracking-widest uppercase mb-0.5"
                style={{ color: "#ffffff", fontFamily: "Inter", fontSize: "10px", letterSpacing: "0.1em" }}>
                {label}
              </div>
              <div className="text-xs" style={{ color: "#2a4060", fontFamily: "Inter" }}>{sub}</div>
              {i < stats.length - 1 && <div className="hidden lg:block absolute right-0 top-1/4 bottom-1/4 w-px" style={{ backgroundColor: IV_BORDER }} />}
            </Link>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Acciones */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-white text-sm uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", letterSpacing: "0.12em" }}>
              ACCIONES RÁPIDAS
            </h2>
            <span className="text-xs px-2 py-1 rounded-lg font-bold" style={{ backgroundColor: `${IV_BLUE}22`, color: IV_BLUE_BRIGHT }}>
              {acciones.length} opciones
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {acciones.map(({ href, label, sub, icono }) => (
              <Link key={href} href={href}
                className="group rounded-xl p-3.5 transition-all"
                style={{ backgroundColor: IV_SURFACE, border: `1px solid ${IV_BORDER}` }}>
                <div className="text-xl mb-2">{icono}</div>
                <div className="text-xs font-black text-white uppercase group-hover:text-blue-400 transition-colors"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
                  {label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#2a4060", fontFamily: "Inter" }}>{sub}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Status panel */}
        <div className="flex flex-col gap-3">

          {/* URL calculadora */}
          <div className="rounded-2xl p-5" style={card}>
            <h2 className="font-black text-white text-xs uppercase tracking-widest mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}>
              TU CALCULADORA
            </h2>
            <div className="rounded-xl p-3 mb-3 flex items-center gap-2 overflow-hidden"
              style={{ backgroundColor: IV_SURFACE, border: `1px solid ${IV_BORDER}` }}>
              <span className="text-xs" style={{ color: "#2a4060" }}>/calc/</span>
              <span className="text-xs font-bold text-white truncate">{config.slug}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/calc/${config.slug}`} target="_blank"
                className="flex-1 text-center py-2.5 text-xs font-black rounded-xl transition-all hover:opacity-80 uppercase"
                style={{ background: `linear-gradient(135deg, ${IV_BLUE}, ${IV_BLUE_BRIGHT})`, color: "white", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
                Abrir ↗
              </Link>
              <Link href="/admin/compartir"
                className="flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-all uppercase"
                style={{ backgroundColor: IV_SURFACE, color: "#4a6080", border: `1px solid ${IV_BORDER}`, fontFamily: "'Barlow Condensed', sans-serif" }}>
                Embed
              </Link>
            </div>
          </div>

          {/* Integraciones */}
          <div className="rounded-2xl p-5 flex-1" style={card}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-white text-xs uppercase tracking-widest"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}>
                INTEGRACIONES
              </h2>
              <Link href="/admin/integraciones"
                className="text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ color: IV_BLUE_BRIGHT, fontFamily: "Inter" }}>
                Configurar →
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {integraciones.map(({ nombre, activo, color, href }) => (
                <Link key={nombre} href={href} className="flex items-center gap-2 group">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: activo ? color : "#1a2e4a" }} />
                  <span className="text-xs font-medium flex-1" style={{ color: activo ? "#8ab0d0" : "#2a4060", fontFamily: "Inter" }}>{nombre}</span>
                  <span className="text-xs font-bold" style={{ color: activo ? color : "#1a3a5a", fontFamily: "Inter" }}>
                    {activo ? "Activo" : "—"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-2xl p-5 sm:p-6 overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${IV_CARD} 0%, ${IV_SURFACE} 100%)`, border: `1px solid ${IV_BORDER}` }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${IV_BLUE_BRIGHT}, transparent)` }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img src="/intervision-logo.svg" alt="IV" className="w-10 h-10 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-black text-white mb-0.5 uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", letterSpacing: "0.05em" }}>
              ¿NECESITAS CAPTAR MÁS CLIENTES DE REFORMAS?
            </div>
            <div className="text-xs" style={{ color: "#3a6090", fontFamily: "Inter" }}>
              Sistema CRC · Captación · Retención · Conversión
            </div>
          </div>
          <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-black text-sm uppercase transition-all hover:opacity-80 flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${IV_BLUE}, ${IV_BLUE_BRIGHT})`, color: "white", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
            Más info →
          </a>
        </div>
      </div>

    </div>
  );
}
