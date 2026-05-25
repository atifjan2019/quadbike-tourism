import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: Request) {
  const json = (await request.json()) as Record<string, unknown>;
  await Promise.all(
    Object.entries(json).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
