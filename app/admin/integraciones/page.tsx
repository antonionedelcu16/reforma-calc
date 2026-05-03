"use client";

import { useState } from "react";
import { useConfig } from "../../context/ConfigContext";

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
        body: JSON.stringify({
          test: true,
          first_name: "Test",
          email: "test@reformacalc.com",
          phone: "+34600000000",
          source: "Test desde Reforma Calc - Intervisión",
        }),
      });
      setTesteando("ghl-ok");
    } catch {
      setTesteando("ghl-error");
    }
    setTimeout(() => setTesteando(null), 3000);
  };

  const testearAirtable = async () => {
    if (!form.airtableToken || !form.airtableBaseId) return;
    setTesteando("airtable");
    try {
      const res = await fetch(`/api/test-airtable?token=${form.airtableToken}&baseId=${form.airtableBaseId}&table=${form.airtableTableName}`);
      setTesteando(res.ok ? "airtable-ok" : "airtable-error");
    } catch {
      setTesteando("airtable-error");
    }
    setTimeout(() => setTesteando(null), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Integraciones</h1>
        <p className="text-slate-500 mt-1 text-sm">Conecta tu calculadora con tus herramientas de ventas</p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Email */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">✉️</div>
              <div>
                <div className="font-bold text-slate-800">Email</div>
                <div className="text-xs text-slate-400">Notificación automática por email</div>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${config.contactEmail ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
              {config.contactEmail ? "✓ Activo" : "Sin configurar"}
            </span>
          </div>
          <div className="text-sm text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
            Los leads llegan a <strong className="text-slate-700">{config.contactEmail || "—"}</strong> con todos los datos del cliente.
            Cámbialo en <a href="/admin/apariencia" className="text-orange-500 hover:underline">Apariencia</a>.
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">💬</div>
              <div>
                <div className="font-bold text-slate-800">WhatsApp</div>
                <div className="text-xs text-slate-400">Botón de contacto directo para el cliente</div>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${form.whatsappNumero ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
              {form.whatsappNumero ? "✓ Activo" : "No configurado"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Cuando el cliente envíe el formulario, verá un botón para contactar directamente por WhatsApp. Incluye formato internacional sin +.
          </p>
          <div className="mb-3">
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Número WhatsApp Business (ej: 34600000000)</label>
            <input value={form.whatsappNumero} onChange={(e) => setForm((f) => ({ ...f, whatsappNumero: e.target.value }))}
              placeholder="34600000000"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>
          {form.whatsappNumero && (
            <a href={`https://wa.me/${form.whatsappNumero}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-green-600 hover:underline mb-3">
              <span>💬</span> Probar enlace wa.me/{form.whatsappNumero}
            </a>
          )}
          <button onClick={() => guardar("whatsapp")}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors">
            {guardado === "whatsapp" ? "✓ Guardado" : "Guardar"}
          </button>
        </div>

        {/* GoHighLevel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl flex-shrink-0">⚡</div>
              <div>
                <div className="font-bold text-slate-800">GoHighLevel</div>
                <div className="text-xs text-slate-400">Envía leads directamente a tu CRM</div>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${form.webhookUrl ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
              {form.webhookUrl ? "✓ Activo" : "No configurado"}
            </span>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-xs text-orange-700">
            <strong>Cómo obtener el webhook:</strong> En GHL → Configuración → Webhooks → Crear webhook → Copia la URL y pégala aquí.
          </div>
          <div className="mb-3">
            <label className="text-xs font-medium text-slate-500 block mb-1.5">URL del webhook de GoHighLevel</label>
            <input value={form.webhookUrl} onChange={(e) => setForm((f) => ({ ...f, webhookUrl: e.target.value }))}
              placeholder="https://services.leadconnectorhq.com/hooks/..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => guardar("ghl")}
              className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors">
              {guardado === "ghl" ? "✓ Guardado" : "Guardar"}
            </button>
            {form.webhookUrl && (
              <button onClick={testearWebhook} disabled={!!testeando}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl hover:border-orange-300 hover:text-orange-500 transition-colors disabled:opacity-50">
                {testeando === "ghl" ? "Enviando..." : testeando === "ghl-ok" ? "✓ Enviado" : testeando === "ghl-error" ? "✗ Error" : "Enviar test"}
              </button>
            )}
          </div>
        </div>

        {/* Airtable */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl flex-shrink-0">📊</div>
              <div>
                <div className="font-bold text-slate-800">Airtable</div>
                <div className="text-xs text-slate-400">Guarda cada lead en una tabla</div>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${form.airtableToken && form.airtableBaseId ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
              {form.airtableToken && form.airtableBaseId ? "✓ Activo" : "No configurado"}
            </span>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4 text-xs text-purple-700">
            <strong>Cómo configurarlo:</strong> Airtable → tu cuenta → Developer Hub → Personal access token → permisos <em>data.records:write</em>.
            El Base ID está en la URL: airtable.com/<strong>appXXXXXXX</strong>/...
          </div>
          <div className="flex flex-col gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">Personal Access Token</label>
              <input type="password" value={form.airtableToken} onChange={(e) => setForm((f) => ({ ...f, airtableToken: e.target.value }))}
                placeholder="patXXXXXX..."
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">Base ID</label>
                <input value={form.airtableBaseId} onChange={(e) => setForm((f) => ({ ...f, airtableBaseId: e.target.value }))}
                  placeholder="appXXXXXXXXXXXXXX"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1.5">Nombre de la tabla</label>
                <input value={form.airtableTableName} onChange={(e) => setForm((f) => ({ ...f, airtableTableName: e.target.value }))}
                  placeholder="Leads"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
              </div>
            </div>
          </div>
          <button onClick={() => guardar("airtable")}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-colors">
            {guardado === "airtable" ? "✓ Guardado" : "Guardar"}
          </button>
        </div>

      </div>
    </div>
  );
}
