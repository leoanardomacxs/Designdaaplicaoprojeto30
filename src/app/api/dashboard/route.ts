import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await requireSession();

    // Pega o patientId que vem na URL (ex: /api/dashboard/records?patientId=clxyz...)
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    // Condição base: garantir que o paciente pertença ao usuário logado
    const whereCondition: any = {
      patient: {
        ownerId: session.userId,
      },
    };

    // SE o front-end passar o ID do paciente selecionado, filtramos especificamente por ele
    if (patientId) {
      whereCondition.patientId = patientId;
    }

    const records = await prisma.record.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc", // Traz sempre do mais recente para o mais antigo
      },
    });

    return NextResponse.json(records);
  } catch (error: any) {
    if (error.message === "Não autenticado.") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Erro no GET records:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}