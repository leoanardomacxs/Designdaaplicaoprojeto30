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
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    }

    
    const records = await prisma.record.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    if (records.length === 0) {
      return NextResponse.json({ empty: true }, { status: 200 });
    }

    
    const systolics = records.map(r => r.systolic).filter(Boolean) as number[];
    const diastolics = records.map(r => r.diastolic).filter(Boolean) as number[];
    const glucoses = records.map(r => r.glucose).filter(Boolean) as number[];
    const temps = records.map(r => r.temperature).filter(Boolean) as number[];

    const avgSystolic = systolics.length ? Math.round(systolics.reduce((a, b) => a + b, 0) / systolics.length) : null;
    const avgDiastolic = diastolics.length ? Math.round(diastolics.reduce((a, b) => a + b, 0) / diastolics.length) : null;
    const avgGlucose = glucoses.length ? Math.round(glucoses.reduce((a, b) => a + b, 0) / glucoses.length) : null;
    const avgTemp = temps.length ? Number((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)) : null;

    
    const totalFalls = records.filter(r => r.recent_falls).length;
    const totalConfusion = records.filter(r => r.mental_confusion).length;
    const totalEdema = records.filter(r => r.edema).length;

    
    const medicalNotes = records
      .map(r => ({ date: r.createdAt, text: r.notes }))
      .filter(n => n.text && n.text.trim().length > 0)
      .slice(0, 5); 

    return NextResponse.json({
      empty: false,
      periodDays: records.length,
      patientName: patient.name,
      metrics: {
        avgBloodPressure: avgSystolic && avgDiastolic ? `${avgSystolic}/${avgDiastolic}` : "N/A",
        avgGlucose: avgGlucose || "N/A",
        avgTemperature: avgTemp ? `${avgTemp} °C` : "N/A",
      },
      intercurrences: {
        falls: totalFalls,
        confusion: totalConfusion,
        edema: totalEdema,
      },
      recentNotes: medicalNotes,
    }, { status: 200 });

  } catch (error) {
    console.error("Erro na API de relatório médico:", error);
    return NextResponse.json({ error: "Erro interno ao gerar relatório." }, { status: 500 });
  }
}