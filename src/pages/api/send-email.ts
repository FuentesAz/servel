export const prerender = false;
import type { APIRoute } from "astro";
import { resend } from "../../lib/resend";

export const POST: APIRoute = async ({ request }) => {

    const contentType = request.headers.get("Content-Type");

    if (!contentType || !contentType.includes("multipart/form-data")) {
        return new Response(
            JSON.stringify({ error: `Esperaba form-data pero recibí: ${contentType}` }), 
            { status: 400 }
        );
    }

    const data = await request.formData();
    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const phone = data.get("phone")?.toString().trim();
    const message = data.get("message")?.toString().trim();

    if (!name || !email || !message) {
        return new Response(JSON.stringify({ success: false, error: 'Todos los campos son obligatorios' }), { status: 400 })
    }

    try {
        await resend.emails.send({
            from: import.meta.env.RESEND_FROM,
            to: import.meta.env.CONTACT_TO,
            subject: 'Contacto desde la web',
            text: `Nombre: ${name}\nCorreo: ${email}\nTelefono: ${phone}\nMensaje: ${message}`,
        })

        return new Response(JSON.stringify({ success: true }), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Hubo un error al enviar el correo' }), { status: 500 })
    }
};