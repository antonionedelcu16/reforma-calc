"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const IV_BLUE = "#2563eb";
const IV_BLUE_BRIGHT = "#3b82f6";
const IV_BG = "#070d1a";
const IV_SURFACE = "#0c1525";
const IV_CARD = "#101e35";
const IV_BORDER = "#1a2e4a";

const NAV = [
  { href: "/admin", label: "Dashboard", icono: "▦", exact: true },
  { href: "/admin/leads", label: "Leads", icono: "◎" },
  { href: "/admin/servicios", label: "Servicios y precios", icono: "◈" },
  { href: "/admin/zonas", label: "Zonas", icono: "◉" },
  { href: "/admin/apariencia", label: "Apariencia", icono: "◐" },
  { href: "/admin/integraciones", label: "Integraciones", icono: "◆" },
  { href: "/admin/compartir", label: "Compartir / Embed", icono: "◇" },
];

const isActive = (href: string, pathname: string, exact?: boolean) =>
  exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const paginaActual = NAV.find((n) => isActive(n.href, pathname, n.exact)) ?? NAV[0];

  const LogoMarca = ({ size = "lg" }: { size?: "sm" | "lg" }) => (
    <div className={`flex items-center gap-${size === "lg" ? "3" : "2"}`}>
      <img src="/intervision-logo.svg" alt="Intervisión"
        className={size === "lg" ? "w-10 h-10" : "w-8 h-8"} />
      <div>
        <div
          className={`font-black tracking-widest uppercase ${size === "lg" ? "text-base" : "text-sm"}`}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#ffffff", letterSpacing: "0.12em" }}>
          INTERVISIÓN
        </div>
        <div className="text-xs" style={{ color: "#2563eb", fontFamily: "Inter, sans-serif" }}>
          Reforma Calc
        </div>
      </div>
    </div>
  );

  const NavItem = ({ href, label, icono, exact, onClick }: { href: string; label: string; icono: string; exact?: boolean; onClick?: () => void }) => {
    const activo = isActive(href, pathname, exact);
    return (
      <Link href={href} onClick={onClick}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all relative"
        style={{
          backgroundColor: activo ? IV_CARD : "transparent",
          color: activo ? "#ffffff" : "#4a6080",
          borderLeft: activo ? `3px solid ${IV_BLUE_BRIGHT}` : "3px solid transparent",
        }}>
        <span className="text-sm w-4 text-center flex-shrink-0" style={{ color: activo ? IV_BLUE_BRIGHT : "#2a4060" }}>{icono}</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: activo ? 700 : 500 }}>{label}</span>
        {activo && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: IV_BLUE_BRIGHT }} />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: IV_BG, fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0 sticky top-0 h-screen"
        style={{ backgroundColor: IV_SURFACE, borderRight: `1px solid ${IV_BORDER}` }}>

        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: `1px solid ${IV_BORDER}` }}>
          <Link href="/admin">
            <LogoMarca />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map((n) => <NavItem key={n.href} {...n} />)}
        </nav>

        {/* Ver calculadora */}
        <div className="px-2 pb-2" style={{ borderTop: `1px solid ${IV_BORDER}`, paddingTop: "10px" }}>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group"
            style={{ color: "#2a4060" }}>
            <span>↗</span>
            <span className="group-hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Ver calculadora
            </span>
          </Link>
        </div>

        {/* Footer brand */}
        <div className="px-4 pb-4">
          <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${IV_CARD}, ${IV_BG})`, border: `1px solid ${IV_BORDER}` }}>
            <div className="text-xs mb-2" style={{ color: "#2a4060", fontFamily: "Inter" }}>
              Sistema CRC para empresas de reformas
            </div>
            <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold hover:opacity-80 transition-opacity"
              style={{ color: IV_BLUE_BRIGHT, fontFamily: "Inter" }}>
              intervision.click →
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile header + dropdown */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: IV_SURFACE, borderBottom: `1px solid ${IV_BORDER}` }}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" onClick={() => setMenuAbierto(false)}>
            <LogoMarca size="sm" />
          </Link>
          <button onClick={() => setMenuAbierto(!menuAbierto)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-colors"
            style={{ backgroundColor: menuAbierto ? IV_CARD : "transparent" }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-0.5 transition-all duration-200"
                style={{
                  backgroundColor: IV_BLUE_BRIGHT,
                  width: i === 1 ? (menuAbierto ? "0" : "20px") : "20px",
                  opacity: i === 1 && menuAbierto ? 0 : 1,
                  transform: i === 0 && menuAbierto ? "rotate(45deg) translate(0px, 3px)" : i === 2 && menuAbierto ? "rotate(-45deg) translate(0px, -3px)" : "none",
                }} />
            ))}
          </button>
        </div>

        {menuAbierto && (
          <div style={{ backgroundColor: IV_SURFACE, borderTop: `1px solid ${IV_BORDER}` }}>
            <div className="px-2 py-3 flex flex-col gap-0.5">
              {NAV.map((n) => <NavItem key={n.href} {...n} onClick={() => setMenuAbierto(false)} />)}
            </div>
            <div className="px-4 pb-4 flex items-center justify-between" style={{ borderTop: `1px solid ${IV_BORDER}`, paddingTop: "12px" }}>
              <Link href="/" target="_blank" onClick={() => setMenuAbierto(false)}
                className="text-sm font-medium" style={{ color: "#2a4060" }}>
                ↗ Ver calculadora
              </Link>
              <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: IV_BLUE_BRIGHT, backgroundColor: IV_CARD }}>
                Reforma Calc
              </span>
            </div>
          </div>
        )}
      </div>

      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-14" style={{ backgroundColor: IV_BG }}>
        {children}
      </main>
    </div>
  );
}
