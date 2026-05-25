import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");

  const tours = await prisma.tour.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category: { slug: category } } : {}),
      ...(featured === "1" ? { featured: true } : {}),
    },
    include: { category: true, variations: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ ok: true, tours });
}
