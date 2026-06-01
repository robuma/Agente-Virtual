import { NextResponse } from "next/server";
import { sendDifyChatMessage } from "@/lib/dify";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ error: "Escribe una pregunta para continuar." }, { status: 400 });
    }

    const response = await sendDifyChatMessage({
      query,
      conversationId:
        typeof body.conversationId === "string" ? body.conversationId : undefined,
      inputs:
        body.inputs && typeof body.inputs === "object" ? body.inputs : undefined
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Dify chat route failed", error);
    return NextResponse.json(
      { error: "No pudimos obtener respuesta del agente. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
