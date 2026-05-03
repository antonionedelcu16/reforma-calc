"use client";

import { useState, useEffect } from "react";

type Lead = {
  id: number;
  fecha: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  zona: string;
  presupuestoEstandar: string;
  mensaje?: string;
};

const card = { backgroundColor: "#101e35", border: "1px solid #1a2e4a" };

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("reforma-leads") || "[]");
      setLeads(stored);
    } catch {}
  }, []);

  const eliminar = (id: number) => {
    const nuevos = leads.filter((l) => l.id !== id);
    setLeads(nuevos);
    localStorage.setItem("reforma-leads", JSON.stringify(nuevos));
  };

  const exportarCSV = () => {
    const cols = ["Nombre", "Email", "Teléfono", "Servicio", "Zona", "Presupuesto Estándar", "Mensaje", "Fecha"];
    const rows = leads.map((l) => [l.nombre, l.email, l.telefono, l.servicio, l.zona, l.presupuestoEstandar, l.mensaje || "", new Date(l.fecha).toLocaleDateString("es-ES")]);
    const csv = [cols, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads-reforma-calc.csv"; a.click();
  };

  const leadsFiltrados = leads.filter((l) =>
    [l.nombre, l.email, l.servicio, l.zona].some((v) => v.toLowerCase().includes(filtro.toLowerCase()))
  );

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    const ahora = new Date();
    const diff = Math.floor((ahora.getTime() - d.getTime()) / 1000 / 60);
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Leads</h1>
          <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>
            <span style={{ color: "#fb923c" }}>{leads.length}</span> solicitudes de presupuesto
          </p>
        </div>
        {leads.length > 0 && (
          <button onClick={exportarCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 flex items-center gap-2"
            style={{ backgroundColor: "#161616", color: "#fb923c", border: "1px solid #222" }}>
            ⬇ Exportar CSV
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={card}>
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-white text-lg mb-2">Aún no hay leads</h3>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>Cuando un cliente complete el formulario de tu calculadora, aparecerá aquí.</p>
        </div>
      ) : (
        <>
          <div className="relative mb-4">
            <input value={filtro} onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar por nombre, email, servicio o zona..."
              className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none text-white"
              style={{ backgroundColor: "#111111", border: "1px solid #1e1e1e", color: "#f1f5f9" }} />
          </div>

          <div className="flex flex-col gap-3">
            {leadsFiltrados.map((lead) => (
              <div key={lead.id} className="rounded-2xl p-4 sm:p-5 transition-all hover:border-orange-500/20"
                style={card}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-black flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #fb923c22, #fb923c44)", color: "#fb923c" }}>
                      {lead.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm">{lead.nombre}</div>
                      <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-3 mt-0.5">
                        <a href={`mailto:${lead.email}`} className="text-xs hover:text-orange-400 transition-colors truncate max-w-[200px]" style={{ color: "#5a5a5a" }}>
                          ✉ {lead.email}
                        </a>
                        <a href={`tel:${lead.telefono}`} className="text-xs hover:text-orange-400 transition-colors" style={{ color: "#5a5a5a" }}>
                          📞 {lead.telefono}
                        </a>
                      </div>
                      {lead.mensaje && (
                        <p className="text-xs mt-1 italic" style={{ color: "#3a3a3a" }}>"{lead.mensaje}"</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs" style={{ color: "#3a3a3a" }}>{formatFecha(lead.fecha)}</div>
                    <button onClick={() => eliminar(lead.id)}
                      className="text-xs mt-1 transition-colors hover:text-red-400"
                      style={{ color: "#2a2a2a" }}>
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid #1a1a1a" }}>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a" }}>
                    {lead.servicio}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a" }}>
                    📍 {lead.zona}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ backgroundColor: "#fb923c15", color: "#fb923c" }}>
                    {lead.presupuestoEstandar}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <a href={`mailto:${lead.email}?subject=Tu presupuesto de reforma&body=Hola ${lead.nombre},`}
                      className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:opacity-80"
                      style={{ backgroundColor: "#1a1a1a", color: "#8a8a8a", border: "1px solid #222" }}>
                      ✉ <span className="hidden sm:inline">Responder</span>
                    </a>
                    <a href={`tel:${lead.telefono}`}
                      className="text-xs px-3 py-1.5 rounded-xl font-bold transition-all hover:opacity-80"
                      style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", color: "#000" }}>
                      📞 <span className="hidden sm:inline">Llamar</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
