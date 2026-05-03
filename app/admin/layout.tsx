"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icono: "📊" },
  { href: "/admin/leads", label: "Leads", icono: "👥" },
  { href: "/admin/servicios", label: "Servicios y precios", icono: "🔧" },
  { href: "/admin/zonas", label: "Zonas", icono: "📍" },
  { href: "/admin/apariencia", label: "Apariencia", icono: "🎨" },
  { href: "/admin/integraciones", label: "Integraciones", icono: "⚡" },
  { href: "/admin/compartir", label: "Compartir / Embed", icono: "🔗" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              R
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">Reforma Calc</div>
              <div className="text-xs text-slate-400">Panel de administración</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ href, label, icono }) => {
            const activo = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activo
                    ? "bg-orange-50 text-orange-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className="text-base">{icono}</span>
                {label}
                {activo && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-600 transition-all"
          >
            <span>👁️</span>
            Ver calculadora
            <span className="ml-auto text-xs text-slate-300">↗</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
