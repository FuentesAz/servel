export const prerender = false;
import type { APIRoute } from "astro";
import { resend } from "../../lib/resend";


const sanitize = (value?: string | null) =>
  value?.trim().replace(/[<>]/g, "") || "";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("Content-Type");

  let name = "";
  let email = "";
  let phone = "";
  let message = "";


  // Detectar si es JSON o Form Data
  if (contentType?.includes("application/json")) {
    const body = await request.json();
    name = sanitize(body.name);
    email = sanitize(body.email);
    phone = sanitize(body.phone);
    message = sanitize(body.message);
  }
  else if (contentType?.includes("multipart/form-data")) {
    const data = await request.formData();
    name = sanitize(data.get("name")?.toString());
    email = sanitize(data.get("email")?.toString());
    phone = sanitize(data.get("phone")?.toString());
    message = sanitize(data.get("message")?.toString());
  } else {
    return new Response(JSON.stringify({ error: "Formato no soportado" }), { status: 400 });
  }

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ success: false, error: 'Todos los campos son obligatorios' }), { status: 400 })
  }

  try {
    const { error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM,
      to: [import.meta.env.CONTACT_TO],
      replyTo: email,
      subject: 'Contacto desde la web',
      text: `Nombre: ${name}\nCorreo: ${email}\nTelefono: ${phone}\nMensaje: ${message}`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
      
      <div style="background: #2563eb; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0;">
          Nuevo mensaje desde el sitio web
        </h2>
      </div>

      <div style="padding: 25px; color: #333;">
        
        <p style="margin-bottom: 10px;">
          <strong>Nombre:</strong><br/>
          ${name}
        </p>

        <p style="margin-bottom: 10px;">
          <strong>Email:</strong><br/>
          ${email}
        </p>

        <p style="margin-bottom: 10px;">
          <strong>Mensaje:</strong>
        </p>

        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
          ${message}
        </div>

        <div style="margin-top: 25px; text-align: center;">
          <a href="mailto:${email}" 
             style="background: #2563eb; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Responder al usuario
          </a>
        </div>

      </div>

      <div style="background: #f4f6f8; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        Este mensaje fue enviado desde el formulario de tu sitio web.
      </div>

    </div>
  </div>
`,
    })

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 422 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error("Error inesperado:", error);
    return new Response(JSON.stringify({ success: false, error: 'Error interno' }), { status: 500 })
  }
};