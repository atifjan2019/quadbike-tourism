import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q");
  const bookings = await prisma.booking.findMany({
    where: {
      ...(status ? { status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" } : {}),
      ...(q
        ? {
            OR: [
              { reference: { contains: q, mode: "insensitive" } },
              { customerName: { contains: q, mode: "insensitive" } },
              { customerEmail: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { tour: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, bookings });
}
