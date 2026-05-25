import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateBookingReference } from "@/lib/utils";
import { sendBookingEmails } from "@/lib/email";

const Body = z.object({
  // Either a tourId/slug must be provided
  tourId: z.string().optional(),
  tourSlug: z.string().optional(),
  // …or the legacy "activity" field from the homepage form (we map by category name)
  activity: z.string().optional(),
  variationId: z.string().optional(),
  customerName: z.string().min(1).default("Guest"),
  customerEmail: z.string().email().default("guest@example.com"),
  customerPhone: z.string().default(""),
  guests: z.coerce.number().int().min(1).max(99).default(1),
  bookingDate: z.string().min(1), // YYYY-MM-DD
  bookingTime: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Resolve tour: prefer tourId, then tourSlug, then activity → first published tour in matching category
  let tour = null as Awaited<ReturnType<typeof prisma.tour.findFirst>> | null;
  if (data.tourId) {
    tour = await prisma.tour.findUnique({ where: { id: data.tourId } });
  } else if (data.tourSlug) {
    tour = await prisma.tour.findUnique({ where: { slug: data.tourSlug } });
  } else if (data.activity) {
    const cat = await prisma.category.findFirst({
      where: { name: { equals: data.activity, mode: "insensitive" } },
    });
    if (cat) {
      tour = await prisma.tour.findFirst({
        where: { categoryId: cat.id, status: "PUBLISHED" },
        orderBy: { createdAt: "asc" },
      });
    }
  }
  if (!tour) {
    return NextResponse.json(
      { ok: false, error: "No matching tour for this booking. Set tourId, tourSlug, or activity." },
      { status: 404 }
    );
  }

  // Pricing — base on variation if provided, else tour.priceFrom; multiply by guests.
  let unit = Number(tour.priceFrom);
  if (data.variationId) {
    const v = await prisma.variation.findUnique({ where: { id: data.variationId } });
    if (v) unit = Number(v.price);
  }
  const total = unit * data.guests;
  const reference = generateBookingReference();

  const booking = await prisma.booking.create({
    data: {
      reference,
      tourId: tour.id,
      variationId: data.variationId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      guests: data.guests,
      bookingDate: new Date(data.bookingDate),
      bookingTime: data.bookingTime,
      notes: data.notes,
      total,
      status: "PENDING",
    },
  });

  // Fire emails (no-op if RESEND_API_KEY missing)
  await sendBookingEmails({
    reference: booking.reference,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    tourTitle: tour.title,
    guests: booking.guests,
    bookingDate: booking.bookingDate,
    bookingTime: booking.bookingTime,
    total: String(booking.total),
    notes: booking.notes,
  });

  return NextResponse.json({ ok: true, reference: booking.reference });
}
