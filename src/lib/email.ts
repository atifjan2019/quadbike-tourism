import nodemailer, { type Transporter } from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM ?? "Quad Bike Tourism <bookings@quadbiketourism.com>";
const adminEmail = process.env.ADMIN_EMAIL ?? "atifjan2019@gmail.com";

let client: Transporter | null = null;
function getClient() {
  if (!host || !user || !pass) return null;
  if (!client) {
    client = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587/2525 (STARTTLS)
      auth: { user, pass },
    });
  }
  return client;
}

type BookingPayload = {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourTitle: string;
  guests: number;
  bookingDate: Date | string;
  bookingTime: string;
  total: number | string;
  notes?: string | null;
};

function bookingEmailHtml(b: BookingPayload, kind: "customer" | "admin") {
  const date =
    typeof b.bookingDate === "string"
      ? b.bookingDate
      : b.bookingDate.toISOString().slice(0, 10);
  const intro =
    kind === "customer"
      ? `<p>Hi ${b.customerName}, thanks for booking with Quad Bike Tourism. Your reference is <b>${b.reference}</b>. We'll confirm shortly.</p>`
      : `<p>New booking received — reference <b>${b.reference}</b>.</p>`;
  return `
  <div style="font-family:Arial,sans-serif;color:#000;line-height:1.5">
    <h2 style="color:#F7C83B">Quad Bike Tourism — Booking ${b.reference}</h2>
    ${intro}
    <table cellspacing="0" cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Tour</b></td><td>${b.tourTitle}</td></tr>
      <tr><td><b>Date</b></td><td>${date}</td></tr>
      <tr><td><b>Time</b></td><td>${b.bookingTime}</td></tr>
      <tr><td><b>Guests</b></td><td>${b.guests}</td></tr>
      <tr><td><b>Total</b></td><td>AED ${b.total}</td></tr>
      <tr><td><b>Customer</b></td><td>${b.customerName} &lt;${b.customerEmail}&gt;</td></tr>
      <tr><td><b>Phone</b></td><td>${b.customerPhone}</td></tr>
      ${b.notes ? `<tr><td><b>Notes</b></td><td>${b.notes}</td></tr>` : ""}
    </table>
    <p style="margin-top:24px">Need help? Reply to this email or WhatsApp us.</p>
  </div>
  `;
}

export async function sendBookingEmails(b: BookingPayload) {
  const r = getClient();
  if (!r) {
    console.warn("[email] SMTP_HOST/SMTP_USER/SMTP_PASS not set — skipping booking emails");
    return { skipped: true };
  }
  await Promise.allSettled([
    r.sendMail({
      from,
      to: b.customerEmail,
      subject: `Booking ${b.reference} — Quad Bike Tourism`,
      html: bookingEmailHtml(b, "customer"),
    }),
    r.sendMail({
      from,
      to: adminEmail,
      subject: `New booking ${b.reference}`,
      html: bookingEmailHtml(b, "admin"),
    }),
  ]);
  return { skipped: false };
}

export async function sendBookingConfirmedEmail(b: BookingPayload) {
  const r = getClient();
  if (!r) return { skipped: true };
  await r.sendMail({
    from,
    to: b.customerEmail,
    subject: `Booking confirmed — ${b.reference}`,
    html: `<div style="font-family:Arial,sans-serif">
      <h2 style="color:#F7C83B">Your booking is confirmed!</h2>
      <p>Hi ${b.customerName}, your booking <b>${b.reference}</b> for ${b.tourTitle} on ${
      typeof b.bookingDate === "string"
        ? b.bookingDate
        : b.bookingDate.toISOString().slice(0, 10)
    } at ${b.bookingTime} is confirmed. We can't wait to ride with you.</p>
    </div>`,
  });
  return { skipped: false };
}
