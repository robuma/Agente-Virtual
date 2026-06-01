import { NextResponse } from "next/server";
import { createLiveAvatarSessionToken } from "@/lib/heygen";

export async function POST() {
  try {
    const response = await createLiveAvatarSessionToken();
    return NextResponse.json(response);
  } catch (error) {
    console.error("LiveAvatar session route failed", error);
    return NextResponse.json(
      { error: "No pudimos iniciar la sesión de avatar. Revisa la configuración." },
      { status: 500 }
    );
  }
}
