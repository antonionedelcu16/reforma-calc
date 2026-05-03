"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icono: "▦" },
  { href: "/admin/leads", label: "Leads", icono: "◎" },
  { href: "/admin/servicios", label: "Servicios y precios", icono: "◈" },
  { href: "/admin/zonas", label: "Zonas", icono: "◉" },
  { href: "/admin/apariencia", label: "Apariencia", icono: "◐" },
  { href: "/admin/integraciones", label: "Integraciones", icono: "◆" },
  { href: "/admin/compartir", label: "Compartir / Embed", icono: "◇" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const paginaActual = NAV.find((n) => n.href === pathname) || NAV.find((n) => pathname.startsWith(n.href) && n.href !== "/admin") || NAV[0];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "#1a1a1a" }}>
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMenuAbierto(false)}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ backgroundColor: "#fb923c" }}>
            IV
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight">Intervisión</div>
            <div className="text-xs" style={{ color: "#4a4a4a" }}>Reforma Calc</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icono }) => {
          const activo = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: activo ? "#1a1a1a" : "transparent",
                color: activo ? "#ffffff" : "#6a6a6a",
              }}>
              <span className="text-base w-5 text-center" style={{ color: activo ? "#fb923c" : "#4a4a4a" }}>{icono}</span>
              <span className="font-medium">{label}</span>
              {activo && <div className="ml-auto w-1 h-1 rounded-full" style={{ backgroundColor: "#fb923c" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Ver calculadora */}
      <div className="px-3 pb-2 border-t pt-3" style={{ borderColor: "#1a1a1a" }}>
        <Link href="/" target="_blank" onClick={() => setMenuAbierto(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group"
          style={{ color: "#4a4a4a" }}>
          <span className="text-base">↗</span>
          <span className="font-medium group-hover:text-white transition-colors">Ver calculadora</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#111111" }}>
          <div className="text-xs mb-1" style={{ color: "#4a4a4a" }}>Sistema de captación para</div>
          <div className="text-xs font-semibold" style={{ color: "#fb923c" }}>Empresas de Reformas</div>
          <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
            className="text-xs mt-1.5 block transition-colors hover:text-white" style={{ color: "#3a3a3a" }}>
            intervision.click
          </a>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col" style={{ backgroundColor: "#0a0a0a" }}>
        <SidebarContent />
      </aside>

      {/* Mobile header + dropdown */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: "#0a0a0a" }}>
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#1a1a1a" }}>
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setMenuAbierto(false)}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-xs font-black" style={{ backgroundColor: "#fb923c" }}>IV</div>
            <div>
              <div className="text-white font-bold text-sm leading-none">Intervisión</div>
              <div className="text-xs leading-none mt-0.5" style={{ color: "#4a4a4a" }}>
                {paginaActual?.label ?? "Admin"}
              </div>
            </div>
          </Link>
          <button onClick={() => setMenuAbierto(!menuAbierto)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: menuAbierto ? "#1a1a1a" : "transparent" }}>
            <span className="block w-5 h-0.5 bg-white transition-all duration-200" style={{ transform: menuAbierto ? "rotate(45deg) translate(0px, 3px)" : "none" }} />
            <span className="block h-0.5 bg-white transition-all duration-200" style={{ width: menuAbierto ? "0" : "20px", opacity: menuAbierto ? 0 : 1 }} />
            <span className="block w-5 h-0.5 bg-white transition-all duration-200" style={{ transform: menuAbierto ? "rotate(-45deg) translate(0px, -3px)" : "none" }} />
          </button>
        </div>

        {/* Dropdown nav */}
        {menuAbierto && (
          <div className="border-b" style={{ backgroundColor: "#0d0d0d", borderColor: "#1a1a1a" }}>
            <nav className="px-3 py-2">
              {NAV.map(({ href, label, icono }) => {
                const activo = pathname === href || (pathname.startsWith(href) && href !== "/admin");
                return (
                  <Link key={href} href={href} onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all"
                    style={{
                      backgroundColor: activo ? "#1a1a1a" : "transparent",
                      color: activo ? "#ffffff" : "#6a6a6a",
                    }}>
                    <span className="text-base w-5 text-center" style={{ color: activo ? "#fb923c" : "#4a4a4a" }}>{icono}</span>
                    <span className="font-medium">{label}</span>
                    {activo && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#fb923c" }} />}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 pb-3 border-t pt-2 flex items-center justify-between" style={{ borderColor: "#1a1a1a" }}>
              <Link href="/" target="_blank" onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                style={{ color: "#4a4a4a" }}>
                <span>↗</span>
                <span className="font-medium">Ver calculadora</span>
              </Link>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ color: "#fb923c", backgroundColor: "#1a1a1a" }}>Reforma Calc</span>
            </div>
          </div>
        )}
      </div>

      {/* Tap outside to close */}
      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-40" style={{ top: "0" }} onClick={() => setMenuAbierto(false)} />
      )}

      {/* Main */}
      <main className="flex-1 bg-slate-50 overflow-auto lg:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
