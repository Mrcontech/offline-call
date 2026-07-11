import { env } from "../config/env.js";
import { logger } from "./logger.js";

/**
 * Send a transactional email via Resend (https://resend.com).
 * No-op (returns false) when RESEND_API_KEY isn't configured, so the app keeps
 * working without email in dev / before the key is added on the server.
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    logger.warn({ to }, "RESEND_API_KEY not set — skipping email");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: env.MAIL_FROM, to, subject, html }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.warn({ status: res.status, body }, "Resend email failed");
      return false;
    }
    return true;
  } catch (err) {
    logger.warn({ err }, "Resend email error");
    return false;
  }
}
