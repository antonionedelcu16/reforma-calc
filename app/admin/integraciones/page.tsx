"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";

const card = { backgroundColor: "#111111", border: "1px solid #1a1a1a" };
const inputStyle = { backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e", color: "#f1f5f9" };

export default function IntegracionesAdmin() {
  const { config, updateConfig } = useConfig();
  const [guardado, setGuardado] = useState<string | null>(null);
  const [testeando, setTesteando] = useState<string | null>(null);
  const [form, setForm] = useState({
    webhookUrl: config.webhookUrl,
    whatsappNumero: config.whatsappNumero,
    airtableToken: config.airtableToken,
    airtableBaseId: config.airtableBaseId,
    airtableTableName: config.airtableTableName,
  });

  const guardar = (seccion: string) => {
    updateConfig(form);
    setGuardado(seccion);
    setTimeout(() => setGuardado(null), 2500);
  };

  const testearWebhook = async () => {
    if (!form.webhookUrl) return;
    setTesteando("ghl");
    try {
      await fetch(form.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, first_name: "Test", email: "test@reformacalc.com", phone: "+34600000000", source: "Test desde Reforma Calc - Intervisión" }),
      });
      setTesteando("ghl-ok");
    } catch {
      setTesteando("ghl-error");
    }
    setTimeout(() => setTesteando(null), 3000);
  };

  const Badge = ({ activo }: { activo: boolean }) => (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
      style={{ backgroundColor: activo ? "#34d39915" : "#1a1a1a", color: activo ? "#34d399" : "#3a3a3a" }}>
      {activo ? "● Activo" : "○ Inactivo"}
    </span>
  );

  const SaveBtn = ({ seccion, color = "#fb923c" }: { seccion: string; color?: string }) => (
    <button onClick={() => guardar(seccion)}
      className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-80"
      style={{ background: guardado === seccion ? "linear-gradient(135deg, #10b981, #059669)" : `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#000" }}>
      {guardado === seccion ? "✓ Guardado" : "Guardar"}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Integraciones</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a4a4a" }}>Conecta tu calculadora con tus herramientas de ventas</p>
      </div>

      <div className="flex flex-col gap-4">

        {/* Email */}
        <div className="rounded-2xl p-5 sm:p-6" style={card}>
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: "#0f1a2e" }}>✉️</div>
              <div>
                <div className="font-bold text-white">Email</div>
                <div className="text-xs" style={{ color: "#3a3a3a" }}>Notificación automática por email</div>
              </div>
            </div>
            <Badge activo={!!config.contactEmail} />
          </div>
          <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e" }}>
            <span style={{ color: "#4a4a4a" }}>Los leads llegan a </span>
            <strong className="text-white">{config.contactEmail || "—"}</strong>
            <span style={{ color: "#4a4a4a" }}> con todos los datos.</span>
            {" "}<a href="/admin/apariencia" className="hover:underline" style={{ color: "#fb923c" }}>Cambiar →</a>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="rounded-2xl p-5 sm:p-6" style={card}>
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: "#0f2a1a" }}>💬</div>
              <div>
                <div className="font-bold text-white">WhatsApp</div>
                <div className="text-xs" style={{ color: "#3a3a3a" }}>Botón de contacto directo para el cliente</div>
              </div>
            </div>
            <Badge activo={!!form.whatsappNumero} />
          </div>
          <p className="text-xs mb-3" style={{ color: "#3a3a3a" }}>
            Tras enviar el formulario, el cliente verá un botón para contactarte por WhatsApp. Formato internacional sin +.
          </p>
          <div className="mb-3">
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Número (ej: 34600000000)</label>
            <input value={form.whatsappNumero} onChange={(e) => setForm((f) => ({ ...f, whatsappNumero: e.target.value }))}
              placeholder="34600000000" className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
          </div>
          {form.whatsappNumero && (
            <a href={`https://wa.me/${form.whatsappNumero}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs mb-3 hover:underline" style={{ color: "#34d399" }}>
              💬 Probar enlace →
            </a>
          )}
          <SaveBtn seccion="whatsapp" color="#34d399" />
        </div>

        {/* GoHighLevel */}
        <div className="rounded-2xl p-5 sm:p-6" style={card}>
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: "#1a1000" }}>⚡</div>
              <div>
                <div className="font-bold text-white">GoHighLevel</div>
                <div className="text-xs" style={{ color: "#3a3a3a" }}>Envía leads directamente a tu CRM</div>
              </div>
            </div>
            <Badge activo={!!form.webhookUrl} />
          </div>
          <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#1a1000", border: "1px solid #3a2200" }}>
            <span style={{ color: "#f59e0b" }}>
              <strong>Cómo obtenerlo:</strong> GHL → Configuración → Webhooks → Crear webhook → Copia la URL.
            </span>
          </div>
          <div className="mb-3">
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>URL del webhook</label>
            <input value={form.webhookUrl} onChange={(e) => setForm((f) => ({ ...f, webhookUrl: e.target.value }))}
              placeholder="https://services.leadconnectorhq.com/hooks/..."
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <SaveBtn seccion="ghl" color="#fb923c" />
            {form.webhookUrl && (
              <button onClick={testearWebhook} disabled={!!testeando}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-40"
                style={{ backgroundColor: "#1a1a1a", color: "#6a6a6a", border: "1px solid #222" }}>
                {testeando === "ghl" ? "Enviando..." : testeando === "ghl-ok" ? "✓ Enviado" : testeando === "ghl-error" ? "✗ Error" : "Test"}
              </button>
            )}
          </div>
        </div>

        {/* Airtable */}
        <div className="rounded-2xl p-5 sm:p-6" style={card}>
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: "#1a0f2e" }}>📊</div>
              <div>
                <div className="font-bold text-white">Airtable</div>
                <div className="text-xs" style={{ color: "#3a3a3a" }}>Guarda cada lead en una tabla automáticamente</div>
              </div>
            </div>
            <Badge activo={!!(form.airtableToken && form.airtableBaseId)} />
          </div>
          <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#1a0f2e", border: "1px solid #2e1a4a" }}>
            <span style={{ color: "#a78bfa" }}>
              <strong>Cómo configurarlo:</strong> Airtable → Developer Hub → Personal access token → permisos <em>data.records:write</em>.
              El Base ID está en la URL: airtable.com/<strong>appXXX</strong>/...
            </span>
          </div>
          <div className="flex flex-col gap-3 mb-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Personal Access Token</label>
              <input type="password" value={form.airtableToken} onChange={(e) => setForm((f) => ({ ...f, airtableToken: e.target.value }))}
                placeholder="patXXXXXX..." className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Base ID</label>
                <input value={form.airtableBaseId} onChange={(e) => setForm((f) => ({ ...f, airtableBaseId: e.target.value }))}
                  placeholder="appXXXXXXXXXXXXXX" className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "#4a4a4a" }}>Nombre de la tabla</label>
                <input value={form.airtableTableName} onChange={(e) => setForm((f) => ({ ...f, airtableTableName: e.target.value }))}
                  placeholder="Leads" className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={inputStyle} />
              </div>
            </div>
          </div>
          <SaveBtn seccion="airtable" color="#a78bfa" />
        </div>

      </div>
    </div>
  );
}
