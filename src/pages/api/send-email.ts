export const prerender = false;
import type { APIRoute } from "astro";
import { resend } from "../../lib/resend";

export const POST: APIRoute = async ({ request }) => {

    const contentType = request.headers.get("Content-Type");
    let name, email, phone, message;

    // Detectar si es JSON o Form Data
    if (contentType?.includes("application/json")) {
        const body = await request.json();
        name = body.name;
        email = body.email;
        phone = body.phone;
        message = body.message;
    } else if (contentType?.includes("multipart/form-data")) {
        const data = await request.formData();
        name = data.get("name")?.toString();
        email = data.get("email")?.toString();
        phone = data.get("phone")?.toString();
        message = data.get("message")?.toString();
    } else {
        return new Response(JSON.stringify({ error: "Formato no soportado" }), { status: 400 });
    }

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
        console.error('Error al enviar correo:', error);
    }
};