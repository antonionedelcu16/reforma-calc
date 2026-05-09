"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useConfig } from "../../context/ConfigContext";

type Lead = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  zona: string;
  presupuesto_estandar: string;
  presupuesto_basico: string;
  presupuesto_premium: string;
  mensaje: string | null;
  created_at: string;
};

const card = { backgroundColor: "#101e35", border: "1px solid #1a2e4a" };

export default function LeadsAdmin() {
  const supabase = createClient();
  const { currentCalcId } = useConfig();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentCalcId) return;
    setLoading(true);
    supabase
      .from("leads")
      .select("*")
      .eq("calculator_id", currentCalcId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLeads(data ?? []);
        setLoading(false);
      });
  }, [currentCalcId]);

  const eliminar = async (id: string) => {
    await supabase.from("leads").delete().eq("id", id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const exportarCSV = () => {
    const cols = ["Nombre", "Email", "Teléfono", "Servicio", "Zona", "Presupuesto Estándar", "Mensaje", "Fecha"];
    const rows = leads.map((l) => [
      l.nombre, l.email, l.telefono, l.servicio, l.zona, l.presupuesto_estandar,
      l.mensaje || "", new Date(l.created_at).toLocaleDateString("es-ES"),
    ]);
    const csv = [cols, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads-reforma-calc.csv"; a.click();
  };

  const leadsFiltrados = leads.filter((l) =>
    [l.nombre, l.email, l.servicio, l.zona].some((v) => (v ?? "").toLowerCase().includes(filtro.toLowerCase()))
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

      <div className="flex items-start justify-between mb-6 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Leads</h1>
          <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>
            <span style={{ color: "#3b82f6" }}>{leads.length}</span> solicitudes de presupuesto
          </p>
        </div>
        {leads.length > 0 && (
          <button onClick={exportarCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 flex items-center gap-2"
            style={{ backgroundColor: "#161616", color: "#3b82f6", border: "1px solid #222" }}>
            ⬇ Exportar CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="rounded-2xl p-16 text-center" style={card}>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>Cargando leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={card}>
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-bold text-white text-lg mb-2">Aún no hay leads</h3>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>
            Cuando un cliente complete el formulario de tu calculadora, aparecerá aquí.
          </p>
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
              <div key={lead.id} className="rounded-2xl p-4 sm:p-5 transition-all hover:border-blue-500/20" style={card}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-black flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #3b82f622, #3b82f644)", color: "#3b82f6" }}>
                      {(lead.nombre ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm">{lead.nombre}</div>
                      <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-3 mt-0.5">
                        <a href={`mailto:${lead.email}`} className="text-xs hover:text-blue-400 transition-colors truncate max-w-[200px]"
                          style={{ color: "#5a5a5a" }}>✉ {lead.email}</a>
                        <a href={`tel:${lead.telefono}`} className="text-xs hover:text-blue-400 transition-colors"
                          style={{ color: "#5a5a5a" }}>📞 {lead.telefono}</a>
                      </div>
                      {lead.mensaje && (
                        <p className="text-xs mt-1 italic" style={{ color: "#3a3a3a" }}>"{lead.mensaje}"</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs" style={{ color: "#3a3a3a" }}>{formatFecha(lead.created_at)}</div>
                    <button onClick={() => eliminar(lead.id)}
                      className="text-xs mt-1 transition-colors hover:text-red-400" style={{ color: "#2a2a2a" }}>
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid #1a1a1a" }}>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a" }}>
                    {lead.servicio}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a" }}>
                    📍 {lead.zona}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}>
                    {lead.presupuesto_estandar}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <a href={`mailto:${lead.email}?subject=Tu presupuesto de reforma&body=Hola ${lead.nombre},`}
                      className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:opacity-80"
                      style={{ backgroundColor: "#1a1a1a", color: "#8a8a8a", border: "1px solid #222" }}>
                      ✉ <span className="hidden sm:inline">Responder</span>
                    </a>
                    <a href={`tel:${lead.telefono}`}
                      className="text-xs px-3 py-1.5 rounded-xl font-bold transition-all hover:opacity-80"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff" }}>
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
