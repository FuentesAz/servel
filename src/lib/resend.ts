import { Resend } from "resend";

const apikey = import.meta.env.RESEND_API_KEY;

if (!apikey) {
  console.error("ERROR: La API Key no se cargó desde .env");
}

export const resend = new Resend(apikey);