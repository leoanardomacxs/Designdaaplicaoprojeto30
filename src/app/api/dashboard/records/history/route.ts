import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();

    // Encontra o paciente da Verenice atrelado ao usuário
    const patient = await prisma.patient.findFirst({
      where: { ownerId: session.userId },
    });

    if (!patient) {
      return NextResponse.json([], { status: 200 });
    }

    // Busca todos os registros em ordem cronológica invertida
    const history = await prisma.record.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro interno ao carregar histórico." }, { status: 500 });
  }
}