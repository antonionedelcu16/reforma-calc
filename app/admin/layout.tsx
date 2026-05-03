"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar oscuro — estilo Intervisión */}
      <aside className="w-64 flex flex-col" style={{ backgroundColor: "#0a0a0a" }}>

        {/* Logo Intervisión */}
        <div className="px-6 py-6 border-b" style={{ borderColor: "#1a1a1a" }}>
          <Link href="/admin" className="flex items-center gap-3">
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
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group"
                style={{
                  backgroundColor: activo ? "#1a1a1a" : "transparent",
                  color: activo ? "#ffffff" : "#6a6a6a",
                }}>
                <span className="text-base w-5 text-center transition-colors"
                  style={{ color: activo ? "#fb923c" : "#4a4a4a" }}>
                  {icono}
                </span>
                <span className="font-medium">{label}</span>
                {activo && <div className="ml-auto w-1 h-1 rounded-full" style={{ backgroundColor: "#fb923c" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Ver calculadora */}
        <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "#1a1a1a" }}>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group"
            style={{ color: "#4a4a4a" }}>
            <span className="text-base">↗</span>
            <span className="font-medium group-hover:text-white transition-colors">Ver calculadora</span>
          </Link>
        </div>

        {/* Footer Intervisión */}
        <div className="px-5 pb-5">
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: "#111111" }}>
            <div className="text-xs mb-1" style={{ color: "#4a4a4a" }}>Sistema de captación para</div>
            <div className="text-xs font-semibold" style={{ color: "#fb923c" }}>Empresas de Reformas</div>
            <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
              className="text-xs mt-1.5 block transition-colors hover:text-white"
              style={{ color: "#3a3a3a" }}>
              intervision.click
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-slate-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
