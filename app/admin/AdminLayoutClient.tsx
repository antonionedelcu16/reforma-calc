"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ConfigProvider, useConfig } from "../context/ConfigContext";
import { createClient } from "../../lib/supabase/client";

const IV_BLUE = "#2563eb";
const IV_BLUE_BRIGHT = "#3b82f6";
const IV_BG = "#070d1a";
const IV_SURFACE = "#0c1525";
const IV_CARD = "#101e35";
const IV_BORDER = "#1a2e4a";

const NAV = [
  { href: "/admin", label: "Dashboard", icono: "▦", exact: true },
  { href: "/admin/calculadoras", label: "Calculadoras", icono: "◧" },
  { href: "/admin/leads", label: "Leads", icono: "◎" },
  { href: "/admin/servicios", label: "Servicios y precios", icono: "◈" },
  { href: "/admin/zonas", label: "Zonas", icono: "◉" },
  { href: "/admin/apariencia", label: "Apariencia", icono: "◐" },
  { href: "/admin/integraciones", label: "Integraciones", icono: "◆" },
  { href: "/admin/compartir", label: "Compartir / Embed", icono: "◇" },
];

const isActive = (href: string, pathname: string, exact?: boolean) =>
  exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV.map((n) => {
        const activo = isActive(n.href, pathname, n.exact);
        return (
          <Link key={n.href} href={n.href} onClick={onNavigate}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
            style={{
              backgroundColor: activo ? IV_CARD : "transparent",
              color: activo ? "#ffffff" : "#4a6080",
              borderLeft: activo ? `3px solid ${IV_BLUE_BRIGHT}` : "3px solid transparent",
            }}>
            <span className="text-sm w-4 text-center flex-shrink-0" style={{ color: activo ? IV_BLUE_BRIGHT : "#2a4060" }}>{n.icono}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: activo ? 700 : 500 }}>{n.label}</span>
            {activo && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: IV_BLUE_BRIGHT }} />}
          </Link>
        );
      })}
    </>
  );
}

function CalcSelector({ mobile }: { mobile?: boolean }) {
  const { calculators, currentCalcId, selectCalc, loading } = useConfig();
  const [open, setOpen] = useState(false);
  const current = calculators.find((c) => c.id === currentCalcId);

  if (loading || calculators.length === 0) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
        style={{ backgroundColor: IV_CARD, border: `1px solid ${IV_BORDER}`, color: "#f1f5f9" }}>
        <span className="text-base flex-shrink-0">🧮</span>
        <span className="flex-1 text-left text-xs font-bold truncate">{current?.nombre ?? "Calculadora"}</span>
        <span className="text-xs flex-shrink-0" style={{ color: "#2a4060" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
          style={{ backgroundColor: IV_SURFACE, border: `1px solid ${IV_BORDER}` }}>
          {calculators.map((c) => (
            <button key={c.id} onClick={() => { selectCalc(c.id); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs transition-all hover:opacity-80"
              style={{
                backgroundColor: c.id === currentCalcId ? IV_CARD : "transparent",
                color: c.id === currentCalcId ? "#fff" : "#4a6080",
                borderLeft: c.id === currentCalcId ? `2px solid ${IV_BLUE_BRIGHT}` : "2px solid transparent",
              }}>
              <span>{c.id === currentCalcId ? "●" : "○"}</span>
              <span className="truncate">{c.nombre}</span>
            </button>
          ))}
          <div style={{ borderTop: `1px solid ${IV_BORDER}` }}>
            <Link href="/admin/calculadoras" onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-xs transition-all hover:opacity-80"
              style={{ color: IV_BLUE_BRIGHT }}>
              <span>+</span> Gestionar calculadoras
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function LogoutBtn() {
  const router = useRouter();
  const supabase = createClient();
  const { userEmail } = useConfig();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-xs truncate max-w-[140px]" style={{ color: "#2a4060" }}>{userEmail}</span>
      <button onClick={logout} className="text-xs font-semibold hover:opacity-80 transition-opacity flex-shrink-0" style={{ color: "#4a6080" }}>
        Salir
      </button>
    </div>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const paginaActual = NAV.find((n) => isActive(n.href, pathname, n.exact)) ?? NAV[0];

  const LogoMarca = ({ size = "lg" }: { size?: "sm" | "lg" }) => (
    <div className={`flex items-center gap-${size === "lg" ? "3" : "2"}`}>
      <img src="/intervision-logo.svg" alt="Intervisión" className={size === "lg" ? "w-10 h-10" : "w-8 h-8"} />
      <div>
        <div className={`font-black tracking-widest uppercase ${size === "lg" ? "text-base" : "text-sm"}`}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#ffffff", letterSpacing: "0.12em" }}>
          INTERVISIÓN
        </div>
        <div className="text-xs" style={{ color: IV_BLUE }}>Reforma Calc</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: IV_BG, fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0 sticky top-0 h-screen"
        style={{ backgroundColor: IV_SURFACE, borderRight: `1px solid ${IV_BORDER}` }}>

        <div className="px-5 py-5" style={{ borderBottom: `1px solid ${IV_BORDER}` }}>
          <Link href="/admin"><LogoMarca /></Link>
        </div>

        {/* Calculator selector */}
        <div className="px-3 py-3" style={{ borderBottom: `1px solid ${IV_BORDER}` }}>
          <CalcSelector />
        </div>

        <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
          <AdminNav />
        </nav>

        <div className="px-2 pb-2" style={{ borderTop: `1px solid ${IV_BORDER}`, paddingTop: "10px" }}>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group"
            style={{ color: "#2a4060" }}>
            <span>↗</span>
            <span className="group-hover:text-white transition-colors">Ver calculadora</span>
          </Link>
        </div>

        <div className="px-2 pb-2" style={{ borderTop: `1px solid ${IV_BORDER}`, paddingTop: "6px" }}>
          <LogoutBtn />
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${IV_CARD}, ${IV_BG})`, border: `1px solid ${IV_BORDER}` }}>
            <div className="text-xs mb-2" style={{ color: "#2a4060" }}>Sistema CRC para empresas de reformas</div>
            <a href="https://intervision.click" target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold hover:opacity-80 transition-opacity"
              style={{ color: IV_BLUE_BRIGHT }}>
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
            <div className="px-3 py-3" style={{ borderBottom: `1px solid ${IV_BORDER}` }}>
              <CalcSelector mobile />
            </div>
            <div className="px-2 py-3 flex flex-col gap-0.5">
              <AdminNav onNavigate={() => setMenuAbierto(false)} />
            </div>
            <div className="px-4 pb-4 flex items-center justify-between" style={{ borderTop: `1px solid ${IV_BORDER}`, paddingTop: "12px" }}>
              <Link href="/" target="_blank" onClick={() => setMenuAbierto(false)}
                className="text-sm font-medium" style={{ color: "#2a4060" }}>
                ↗ Ver calculadora
              </Link>
              <LogoutBtn />
            </div>
          </div>
        )}
      </div>

      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
      )}

      <main className="flex-1 overflow-auto lg:pt-0 pt-14" style={{ backgroundColor: IV_BG }}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ConfigProvider>
  );
}
