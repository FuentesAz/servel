import { Resend } from "resend";

const apikey = import.meta.env.RESEND_API_KEY;

export const resend = new Resend(apikey);