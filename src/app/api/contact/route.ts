import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const Body = z.object({
  topic: z.string().min(1).max(100),
  phone: z.string().min(5).max(40),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(600),
});

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM ?? "Quad Bike Tourism <bookings@quadbiketourism.com>";
const adminEmail = process.env.ADMIN_EMAIL ?? "info@quadbiketourism.com";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const m = parsed.data;

  if (apiKey) {
    const client = new Resend(apiKey);
    const html = `
      <div style="font-family:Arial,sans-serif;color:#000;line-height:1.5">
        <h2 style="color:#F7C83B">New contact message</h2>
        <p><b>Topic:</b> ${m.topic}</p>
        <p><b>Name:</b> ${m.name}</p>
        <p><b>Email:</b> ${m.email}</p>
        <p><b>Phone:</b> ${m.phone}</p>
        <p><b>Subject:</b> ${m.subject}</p>
        <p><b>Message:</b></p>
        <p style="white-space:pre-wrap">${m.message.replace(/</g, "&lt;")}</p>
      </div>`;
    try {
      await client.emails.send({
        from,
        to: adminEmail,
        replyTo: m.email,
        subject: `[Contact] ${m.subject}`,
        html,
      });
    } catch (e) {
      console.error("[contact] email send failed", e);
    }
  } else {
    console.warn("[contact] RESEND_API_KEY not set — message logged only", m);
  }

  return NextResponse.json({ ok: true });
}
