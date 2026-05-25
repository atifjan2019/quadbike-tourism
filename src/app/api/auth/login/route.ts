import { NextResponse } from "next/server";
import { z } from "zod";
import { getPasscode, setSessionCookie, signSession } from "@/lib/auth";

const Body = z.object({ passcode: z.string().min(4).max(20) });

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
  if (parsed.data.passcode !== getPasscode()) {
    return NextResponse.json({ ok: false, error: "Wrong passcode" }, { status: 401 });
  }
  const token = await signSession();
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
