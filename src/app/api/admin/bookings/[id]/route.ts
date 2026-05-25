import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendBookingConfirmedEmail } from "@/lib/email";

const Body = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { tour: true },
  });
  if (!booking) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, booking });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const prev = await prisma.booking.findUnique({ where: { id }, include: { tour: true } });
  if (!prev) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const booking = await prisma.booking.update({
    where: { id },
    data: parsed.data,
    include: { tour: true },
  });

  // Fire confirmation email when moving PENDING → CONFIRMED
  if (parsed.data.status === "CONFIRMED" && prev.status !== "CONFIRMED") {
    await sendBookingConfirmedEmail({
      reference: booking.reference,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      tourTitle: booking.tour.title,
      guests: booking.guests,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      total: String(booking.total),
      notes: booking.notes,
    });
  }
  return NextResponse.json({ ok: true, booking });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
