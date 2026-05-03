"use client";

import { useState } from "react";
import { useConfig } from "../context/ConfigContext";

type Props = {
  onCerrar: () => void;
  resumenHtml: string;
  resumenTexto: string;
  servicio: string;
  zona: string;
  presupuestoBasico: string;
  presupuestoEstandar: string;
  presupuestoPremium: string;
};

function guardarLeadLocal(lead: object) {
  try {
    const leads = JSON.parse(localStorage.getItem("reforma-leads") || "[]");
    leads.unshift({ ...lead, fecha: new Date().toISOString(), id: Date.now() });
    localStorage.setItem("reforma-leads", JSON.stringify(leads.slice(0, 500)));
  } catch {}
}

export default function FormularioContacto({
  onCerrar, resumenHtml, resumenTexto,
  servicio, zona, presupuestoBasico, presupuestoEstandar, presupuestoPremium,
}: Props) {
  const { config } = useConfig();
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  const actualizar = (campo: string, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const enviar = async () => {
    if (!form.nombre || !form.email || !form.telefono) return;
    setEstado("enviando");
    try {
      const payload = {
        ...form,
        resumen: resumenHtml,
        empresaEmail: config.contactEmail,
        empresaNombre: config.nombre,
        empresaTelefono: config.contactTelefono,
        servicio,
        zona,
        presupuestoBasico,
        presupuestoEstandar,
        presupuestoPremium,
        webhookUrl: config.webhookUrl,
        whatsappNumero: config.whatsappNumero,
        airtableToken: config.airtableToken,
        airtableBaseId: config.airtableBaseId,
        airtableTableName: config.airtableTableName,
      };

      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        guardarLeadLocal({ nombre: form.nombre, email: form.email, telefono: form.telefono, mensaje: form.mensaje, servicio, zona, presupuestoEstandar });
        setEstado("ok");
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  };

  const waLink = config.whatsappNumero
    ? `https://wa.me/${config.whatsappNumero.replace(/\s+/g, "")}?text=${encodeURIComponent(`Hola, acabo de calcular mi reforma de ${servicio} en ${zona}. Mi presupuesto estimado es ${presupuestoEstandar}. Me gustaría recibir más información.`)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800">Solicitar presupuesto gratuito</h2>
            <p className="text-xs text-slate-400 mt-0.5">Te contactamos en menos de 24h</p>
          </div>
          <button onClick={onCerrar} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">✕</button>
        </div>

        {estado === "ok" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">¡Solicitud enviada!</h3>
            <p className="text-slate-500 text-sm mb-5">
              <strong>{config.nombre}</strong> recibirá tu consulta y te contactará en menos de 24h.
            </p>
            {waLink && (
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold mb-3 bg-[#25D366] hover:opacity-90 transition-opacity">
                <span>💬</span> También por WhatsApp
              </a>
            )}
            <button onClick={onCerrar} className={`w-full py-3 text-white font-semibold ${config.estiloBoton}`} style={{ backgroundColor: config.colorPrimario }}>
              Cerrar
            </button>
          </div>
        ) : (
          <div className="p-5">
            <div className="bg-slate-50 rounded-xl p-3 mb-5 text-xs text-slate-500 border border-slate-200">
              <span className="font-semibold text-slate-700">Tu consulta: </span>{resumenTexto}
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Nombre *</label>
                <input value={form.nombre} onChange={(e) => actualizar("nombre", e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => actualizar("email", e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Teléfono *</label>
                <input type="tel" value={form.telefono} onChange={(e) => actualizar("telefono", e.target.value)}
                  placeholder="600 000 000"
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Mensaje <span className="text-slate-400 font-normal">(opcional)</span></label>
                <textarea value={form.mensaje} onChange={(e) => actualizar("mensaje", e.target.value)}
                  placeholder="Añade cualquier detalle sobre tu reforma..."
                  rows={3} className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
            </div>

            {estado === "error" && (
              <p className="text-xs text-red-500 mb-3">Error al enviar. Inténtalo de nuevo o contacta directamente.</p>
            )}

            <button onClick={enviar} disabled={!form.nombre || !form.email || !form.telefono || estado === "enviando"}
              className={`w-full py-3 text-white font-semibold transition-opacity disabled:opacity-50 ${config.estiloBoton}`}
              style={{ backgroundColor: config.colorPrimario }}>
              {estado === "enviando" ? "Enviando..." : config.textoCTA}
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">Sin compromiso. No compartimos tus datos con terceros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
