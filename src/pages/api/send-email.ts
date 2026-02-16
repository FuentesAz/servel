export const prerender = false;
import type { APIRoute } from "astro";
import { resend } from "../../lib/resend";

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") || "";
  console.log("🚀 API /api/send-email HIT");


  if (!contentType.includes("application/json")) {
    return new Response(
      JSON.stringify({ error: `Esperaba JSON pero recibí: ${contentType}` }),
      { status: 400 }
    );
  }

  const body = await request.json();

  const nombre = body.nombre?.trim();
  const email = body.email?.trim();
  const telefono = body.telefono?.trim();
  const mensaje = body.mensaje?.trim();

  if (!nombre || !email || !mensaje) {
    return new Response(
      JSON.stringify({ success: false, error: "Todos los campos son obligatorios" }),
      { status: 400 }
    );
  }

  await resend.emails.send({
    from: import.meta.env.RESEND_FROM,
    to: import.meta.env.CONTACT_TO,
    subject: "Contacto desde la web",
    text: `Nombre: ${nombre}
Correo: ${email}
Teléfono: ${telefono || "No proporcionado"}
Mensaje: ${mensaje}`,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
