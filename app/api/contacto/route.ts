import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type LeadPayload = {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  resumen: string;
  empresaEmail: string;
  empresaNombre: string;
  empresaTelefono: string;
  servicio: string;
  zona: string;
  presupuestoBasico: string;
  presupuestoEstandar: string;
  presupuestoPremium: string;
  // Integraciones
  webhookUrl?: string;
  whatsappNumero?: string;
  airtableToken?: string;
  airtableBaseId?: string;
  airtableTableName?: string;
};

async function enviarEmail(data: LeadPayload) {
  const waLink = data.empresaTelefono
    ? `https://wa.me/${data.empresaTelefono.replace(/\s+/g, "")}?text=${encodeURIComponent(`Hola, tengo una consulta de reforma de ${data.nombre}`)}`
    : null;

  await resend.emails.send({
    from: "Reforma Calc <onboarding@resend.dev>",
    to: data.empresaEmail || "onboarding@resend.dev",
    subject: `🏠 Nueva solicitud de presupuesto — ${data.nombre}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: #1e293b; padding: 28px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🏠 Nueva solicitud de presupuesto</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 14px;">${data.empresaNombre}</p>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-top: none; padding: 28px; border-radius: 0 0 16px 16px;">

          <h2 style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">👤 Datos del cliente</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f8fafc; border-radius: 8px; overflow: hidden;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; width: 100px; font-weight: 600;">Nombre</td>
              <td style="padding: 10px 14px; font-weight: 700; color: #1e293b; font-size: 14px;">${data.nombre}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; font-weight: 600;">Email</td>
              <td style="padding: 10px 14px; font-size: 14px;"><a href="mailto:${data.email}" style="color: #fb923c; font-weight: 600;">${data.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; font-weight: 600;">Teléfono</td>
              <td style="padding: 10px 14px; font-size: 14px;"><a href="tel:${data.telefono}" style="color: #fb923c; font-weight: 600;">${data.telefono}</a></td>
            </tr>
            ${data.mensaje ? `<tr><td style="padding: 10px 14px; color: #64748b; font-size: 13px; font-weight: 600; vertical-align: top;">Mensaje</td><td style="padding: 10px 14px; font-size: 14px; color: #1e293b;">${data.mensaje}</td></tr>` : ""}
          </table>

          <h2 style="color: #1e293b; font-size: 16px; margin: 0 0 16px;">📋 Presupuesto consultado</h2>
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #fb923c;">
            <div style="font-size: 13px; color: #475569; margin-bottom: 8px;"><strong>Servicio:</strong> ${data.servicio}</div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 8px;"><strong>Zona:</strong> ${data.zona}</div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px;">
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; flex: 1; min-width: 120px;">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Básico</div>
                <div style="font-size: 15px; font-weight: 700; color: #1e293b; margin-top: 2px;">${data.presupuestoBasico}</div>
              </div>
              <div style="background: #fff7ed; border: 2px solid #fb923c; border-radius: 8px; padding: 10px 14px; flex: 1; min-width: 120px;">
                <div style="font-size: 11px; color: #fb923c; text-transform: uppercase; font-weight: 700;">★ Estándar</div>
                <div style="font-size: 15px; font-weight: 700; color: #fb923c; margin-top: 2px;">${data.presupuestoEstandar}</div>
              </div>
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; flex: 1; min-width: 120px;">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Premium</div>
                <div style="font-size: 15px; font-weight: 700; color: #1e293b; margin-top: 2px;">${data.presupuestoPremium}</div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="mailto:${data.email}" style="flex: 1; min-width: 120px; background: #fb923c; color: white; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center;">
              ✉️ Responder por email
            </a>
            <a href="tel:${data.telefono}" style="flex: 1; min-width: 120px; background: #1e293b; color: white; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center;">
              📞 Llamar ahora
            </a>
            ${waLink ? `<a href="${waLink}" style="flex: 1; min-width: 120px; background: #25D366; color: white; text-decoration: none; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center;">💬 WhatsApp</a>` : ""}
          </div>

          <p style="margin-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">
            Lead recibido el ${new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} · Powered by <a href="https://intervision.click" style="color: #94a3b8;">Intervisión</a>
          </p>
        </div>
      </div>
    `,
  });
}

async function enviarGoHighLevel(webhookUrl: string, data: LeadPayload) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: data.nombre.split(" ")[0],
      last_name: data.nombre.split(" ").slice(1).join(" "),
      email: data.email,
      phone: data.telefono,
      source: "Calculadora Reformas - Intervisión",
      tags: ["calculadora-reformas", data.servicio.toLowerCase().replace(/\s+/g, "-")],
      custom_fields: {
        servicio: data.servicio,
        zona: data.zona,
        presupuesto_basico: data.presupuestoBasico,
        presupuesto_estandar: data.presupuestoEstandar,
        presupuesto_premium: data.presupuestoPremium,
        mensaje: data.mensaje,
      },
    }),
  });
}

async function enviarAirtable(token: string, baseId: string, tableName: string, data: LeadPayload) {
  await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [{
        fields: {
          Nombre: data.nombre,
          Email: data.email,
          Teléfono: data.telefono,
          Servicio: data.servicio,
          Zona: data.zona,
          "Presupuesto básico": data.presupuestoBasico,
          "Presupuesto estándar": data.presupuestoEstandar,
          "Presupuesto premium": data.presupuestoPremium,
          Mensaje: data.mensaje,
          Empresa: data.empresaNombre,
          Fecha: new Date().toISOString(),
          Estado: "Nuevo",
        },
      }],
    }),
  });
}

export async function POST(req: NextRequest) {
  const body: LeadPayload = await req.json();

  if (!body.nombre || !body.email || !body.telefono) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const resultados: Record<string, "ok" | "error"> = {};

  // Email (siempre)
  try {
    await enviarEmail(body);
    resultados.email = "ok";
  } catch (e) {
    console.error("Email error:", e);
    resultados.email = "error";
  }

  // GoHighLevel
  if (body.webhookUrl) {
    try {
      await enviarGoHighLevel(body.webhookUrl, body);
      resultados.ghl = "ok";
    } catch (e) {
      console.error("GHL error:", e);
      resultados.ghl = "error";
    }
  }

  // Airtable
  if (body.airtableToken && body.airtableBaseId) {
    try {
      await enviarAirtable(body.airtableToken, body.airtableBaseId, body.airtableTableName || "Leads", body);
      resultados.airtable = "ok";
    } catch (e) {
      console.error("Airtable error:", e);
      resultados.airtable = "error";
    }
  }

  const hayExito = resultados.email === "ok";
  return NextResponse.json({ ok: hayExito, resultados }, { status: hayExito ? 200 : 500 });
}
