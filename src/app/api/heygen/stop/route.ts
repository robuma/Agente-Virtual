import { NextResponse } from "next/server";
import { stopLiveAvatarSession } from "@/lib/heygen";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionToken = typeof body.sessionToken === "string" ? body.sessionToken : "";

    await stopLiveAvatarSession(sessionToken);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("LiveAvatar stop route failed", error);
    return NextResponse.json(
      { error: "No pudimos detener la sesión de avatar." },
      { status: 500 }
    );
  }
}
