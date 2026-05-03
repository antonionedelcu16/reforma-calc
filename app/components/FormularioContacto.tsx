"use client";

import { useState } from "react";
import { useConfig } from "../context/ConfigContext";

type Props = {
  onCerrar: () => void;
  resumenHtml: string;
  resumenTexto: string;
};

export default function FormularioContacto({ onCerrar, resumenHtml, resumenTexto }: Props) {
  const { config } = useConfig();
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  const actualizar = (campo: string, valor: string) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const enviar = async () => {
    if (!form.nombre || !form.email || !form.telefono) return;
    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          resumen: resumenHtml,
          empresaEmail: config.contactEmail,
          empresaNombre: config.nombre,
        }),
      });
      setEstado(res.ok ? "ok" : "error");
    } catch {
      setEstado("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        {/* Header */}
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
            <p className="text-slate-500 text-sm mb-6">
              Hemos enviado tu consulta a <strong>{config.nombre}</strong>. Te contactarán en menos de 24 horas.
            </p>
            <button onClick={onCerrar} className="w-full py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: config.colorPrimario }}>
              Cerrar
            </button>
          </div>
        ) : (
          <div className="p-5">
            {/* Resumen */}
            <div className="bg-slate-50 rounded-xl p-3 mb-5 text-xs text-slate-500 border border-slate-200">
              <span className="font-semibold text-slate-700">Tu consulta: </span>{resumenTexto}
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Nombre *</label>
                <input
                  value={form.nombre}
                  onChange={(e) => actualizar("nombre", e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => actualizar("email", e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Teléfono *</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => actualizar("telefono", e.target.value)}
                  placeholder="600 000 000"
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Mensaje <span className="text-slate-400 font-normal">(opcional)</span></label>
                <textarea
                  value={form.mensaje}
                  onChange={(e) => actualizar("mensaje", e.target.value)}
                  placeholder="Añade cualquier detalle adicional sobre tu reforma..."
                  rows={3}
                  className="w-full border-2 border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
                />
              </div>
            </div>

            {estado === "error" && (
              <p className="text-xs text-red-500 mb-3">Error al enviar. Inténtalo de nuevo o llama al {config.contactTelefono}.</p>
            )}

            <button
              onClick={enviar}
              disabled={!form.nombre || !form.email || !form.telefono || estado === "enviando"}
              className="w-full py-3 rounded-xl text-white font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: config.colorPrimario }}
            >
              {estado === "enviando" ? "Enviando..." : "Enviar solicitud →"}
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">Sin compromiso. Tus datos no se compartirán con terceros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
