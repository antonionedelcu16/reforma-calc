import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, email, telefono, mensaje, resumen, empresaEmail, empresaNombre } = body;

  if (!nombre || !email || !telefono) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Reforma Calc <onboarding@resend.dev>",
      to: empresaEmail || "onboarding@resend.dev",
      subject: `Nueva solicitud de presupuesto de ${nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #fb923c; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Nueva solicitud de presupuesto</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">${empresaNombre}</p>
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">

            <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 16px;">Datos del cliente</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Nombre</td><td style="padding: 8px 0; font-weight: 600; color: #1e293b; font-size: 14px;">${nombre}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #fb923c;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Teléfono</td><td style="padding: 8px 0; font-size: 14px;"><a href="tel:${telefono}" style="color: #fb923c;">${telefono}</a></td></tr>
              ${mensaje ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Mensaje</td><td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${mensaje}</td></tr>` : ""}
            </table>

            <h2 style="color: #1e293b; font-size: 16px; margin-bottom: 16px; border-top: 1px solid #f1f5f9; padding-top: 16px;">Presupuesto consultado</h2>
            <div style="background: #f8fafc; border-radius: 8px; padding: 16px; font-size: 14px; color: #475569;">
              ${resumen}
            </div>

            <div style="margin-top: 24px; padding: 16px; background: #fff7ed; border-radius: 8px; border: 1px solid #fed7aa;">
              <p style="margin: 0; font-size: 13px; color: #9a3412;">Este cliente ha solicitado presupuesto a través de tu calculadora. Contáctale en menos de 24h.</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 });
  }
}
