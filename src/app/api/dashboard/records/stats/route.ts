import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();

    const patient = await prisma.patient.findFirst({
      where: { ownerId: session.userId },
    });

    if (!patient) {
      return NextResponse.json([], { status: 200 });
    }

    
    const records = await prisma.record.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "asc" },
      take: 15,
    });

    
    const formattedData = records.map((r) => ({
      data: new Date(r.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      systolic: r.systolic,
      diastolic: r.diastolic,
      glucose: r.glucose,
      temperature: r.temperature,
      heart_rate: r.heart_rate,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Erro na API de estatísticas:", error);
    return NextResponse.json({ error: "Erro interno ao processar gráficos." }, { status: 500 });
  }
}