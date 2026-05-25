import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // TODO: persist to database / send to booking provider / email confirmation.
  console.log("[booking] received:", payload);

  return NextResponse.json({ ok: true });
}
