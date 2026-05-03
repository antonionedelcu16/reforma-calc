"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#070707", fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0 sticky top-0 h-screen" style={{ backgroundColor: "#0a0a0a", borderRight: "1px solid #141414" }}>

        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #141414" }}>
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", color: "#000", boxShadow: "0 0 20px rgba(251,146,60,0.3)" }}>
              IV
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight" style={{ background: "linear-gradient(90deg, #fb923c, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                INTERVISIÓN
              </div>
              <div className="text-xs" style={{ color: "#3a3a3a" }}>Reforma Calc</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icono, exact }) => {
            const activo = isActive(href, pathname, exact);
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative overflow-hidden"
                style={{
                  backgroundColor: activo ? "#161616" : "transparent",
                  color: activo ? "#f1f5f9" : "#4a4a4a",
                }}>
                {activo && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                    style={{ background: "linear-gradient(180deg, #fb923c, #f97316)" }} />
                )}
                <span className="text-sm w-5 text-center flex-shrink-0"
                  style={{ color: activo ? "#fb923c" : "#2a2a2a" }}>{icono}</span>
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Ver calculadora */}
        <div className="px-3 pb-3" style={{ borderTop: "1px solid #141414", paddingTop: "12px" }}>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group"
            style={{ color: "#3a3a3a" }}>
            <span className="text-sm">↗</span>
            <span className="font-medium group-hover:text-white transition-colors">Ver calculadora</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="rounded-2xl p-4 text-center" style={{ background: "linear-gradient(135deg, #111111, #0f0f0f)", border: "1px solid #1a1a1a" }}>
            <div className="text-xs mb-1" style={{ color: "#3a3a3a" }}>Captación para empresas de</div>
            <div className="text-sm font-bold" style={{ color: "#fb923c" }}>Reformas</div>
            <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
              className="text-xs mt-1 block transition-colors hover:text-white" style={{ color: "#2a2a2a" }}>
              intervision.click
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile header + dropdown */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #141414" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setMenuAbierto(false)}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", color: "#000" }}>
              IV
            </div>
            <div>
              <div className="font-bold text-xs tracking-wider" style={{ background: "linear-gradient(90deg, #fb923c, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                INTERVISIÓN
              </div>
              <div className="text-xs leading-none" style={{ color: "#4a4a4a" }}>{paginaActual?.label}</div>
            </div>
          </Link>
          <button onClick={() => setMenuAbierto(!menuAbierto)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-colors"
            style={{ backgroundColor: menuAbierto ? "#161616" : "transparent" }}>
            <span className="block w-5 h-0.5 transition-all duration-200"
              style={{ backgroundColor: "#fb923c", transform: menuAbierto ? "rotate(45deg) translate(0px, 3px)" : "none" }} />
            <span className="block h-0.5 transition-all duration-200"
              style={{ backgroundColor: "#fb923c", width: menuAbierto ? "0" : "20px", opacity: menuAbierto ? 0 : 1 }} />
            <span className="block w-5 h-0.5 transition-all duration-200"
              style={{ backgroundColor: "#fb923c", transform: menuAbierto ? "rotate(-45deg) translate(0px, -3px)" : "none" }} />
          </button>
        </div>

        {menuAbierto && (
          <div style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid #141414" }}>
            <nav className="px-3 py-3 flex flex-col gap-0.5">
              {NAV.map(({ href, label, icono, exact }) => {
                const activo = isActive(href, pathname, exact);
                return (
                  <Link key={href} href={href} onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                    style={{
                      backgroundColor: activo ? "#161616" : "transparent",
                      color: activo ? "#f1f5f9" : "#5a5a5a",
                      borderLeft: activo ? "2px solid #fb923c" : "2px solid transparent",
                    }}>
                    <span style={{ color: activo ? "#fb923c" : "#3a3a3a" }}>{icono}</span>
                    <span className="font-medium">{label}</span>
                    {activo && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#fb923c" }} />}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 pb-4 flex items-center justify-between" style={{ borderTop: "1px solid #141414", paddingTop: "12px" }}>
              <Link href="/" target="_blank" onClick={() => setMenuAbierto(false)}
                className="text-sm font-medium flex items-center gap-2" style={{ color: "#4a4a4a" }}>
                ↗ Ver calculadora
              </Link>
              <span className="text-xs px-2 py-1 rounded-lg font-semibold" style={{ color: "#fb923c", backgroundColor: "#161616" }}>
                Reforma Calc
              </span>
            </div>
          </div>
        )}
      </div>

      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-14" style={{ backgroundColor: "#0a0a0a" }}>
        {children}
      </main>
    </div>
  );
}
