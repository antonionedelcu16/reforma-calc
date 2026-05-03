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
    <div className="p-4 sm:p-8">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Leads recibidos</h1>
          <p className="text-slate-500 mt-1 text-sm">{leads.length} solicitudes en total</p>
        </div>
        {leads.length > 0 && (
          <button onClick={exportarCSV}
            className="px-3 sm:px-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors flex-shrink-0">
            ⬇️ CSV
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-slate-700 text-lg mb-2">Aún no hay leads</h3>
          <p className="text-slate-400 text-sm">Cuando un cliente complete el formulario de tu calculadora, aparecerá aquí.</p>
        </div>
      ) : (
        <>
          <input value={filtro} onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por nombre, email, servicio o zona..."
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 mb-4 bg-white" />

          <div className="flex flex-col gap-3">
            {leadsFiltrados.map((lead) => (
              <div key={lead.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center text-base font-bold text-orange-500 flex-shrink-0">
                      {lead.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-sm sm:text-base">{lead.nombre}</div>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-0.5 sm:gap-3 mt-1">
                        <a href={`mailto:${lead.email}`} className="text-xs text-slate-500 hover:text-orange-500 transition-colors truncate max-w-[200px]">✉️ {lead.email}</a>
                        <a href={`tel:${lead.telefono}`} className="text-xs text-slate-500 hover:text-orange-500 transition-colors">📞 {lead.telefono}</a>
                      </div>
                      {lead.mensaje && <p className="text-xs text-slate-400 mt-1.5 italic">"{lead.mensaje}"</p>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-400">{formatFecha(lead.fecha)}</div>
                    <button onClick={() => eliminar(lead.id)} className="text-xs text-slate-300 hover:text-red-400 transition-colors mt-1">Eliminar</button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{lead.servicio}</span>
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">📍 {lead.zona}</span>
                  <span className="text-xs px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full font-semibold">{lead.presupuestoEstandar}</span>
                  <div className="ml-auto flex gap-2">
                    <a href={`mailto:${lead.email}?subject=Tu presupuesto de reforma&body=Hola ${lead.nombre},...`}
                      className="text-xs px-3 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                      ✉️ <span className="hidden sm:inline">Responder</span>
                    </a>
                    <a href={`tel:${lead.telefono}`}
                      className="text-xs px-3 py-1 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors">
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
