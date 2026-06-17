// Este arquivo processa os dados de saúde dos últimos 30 registros para gerar um relatório resumido com médias e ocorrências.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

// Função principal que calcula estatísticas, agrega intercorrências e extrai notas médicas
export async function GET(req: NextRequest) {
  try {
    // Verifica a sessão do usuário
    const session = await requireSession();

    // Obtém o patientId a partir dos parâmetros da URL (?patientId=...)
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    // Se nenhum patientId for enviado na URL, retorna um erro de requisição inválida
    if (!patientId) {
      return NextResponse.json(
        { error: "O parâmetro patientId é obrigatório." },
        { status: 400 }
      );
    }

    // Busca o paciente específico e valida se ele pertence ao usuário logado
    const patient = await prisma.patient.findFirst({
      where: { 
        id: patientId,
        ownerId: session.userId 
      },
    });

    // Retorna erro caso o paciente não exista ou não pertença ao usuário
    if (!patient) {
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    }

    // Busca até os últimos 30 registros do paciente, ordenados pela data mais recente
    const records = await prisma.record.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // Retorna estado vazio se não houver registros
    if (records.length === 0) {
      return NextResponse.json({ empty: true }, { status: 200 });
    }

    // Filtra e isola os valores de cada métrica para cálculo
    const systolics = records.map(r => r.systolic).filter(Boolean) as number[];
    const diastolics = records.map(r => r.diastolic).filter(Boolean) as number[];
    const glucoses = records.map(r => r.glucose).filter(Boolean) as number[];
    const temps = records.map(r => r.temperature).filter(Boolean) as number[];

    // Calcula a média arredondada das métricas de saúde
    const avgSystolic = systolics.length ? Math.round(systolics.reduce((a, b) => a + b, 0) / systolics.length) : null;
    const avgDiastolic = diastolics.length ? Math.round(diastolics.reduce((a, b) => a + b, 0) / diastolics.length) : null;
    const avgGlucose = glucoses.length ? Math.round(glucoses.reduce((a, b) => a + b, 0) / glucoses.length) : null;
    const avgTemp = temps.length ? Number((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)) : null;

    // Conta o total de ocorrências específicas (quedas, confusão e edema)
    const totalFalls = records.filter(r => r.recent_falls).length;
    const totalConfusion = records.filter(r => r.mental_confusion).length;
    const totalEdema = records.filter(r => r.edema).length;

    // Extrai e formata as 5 anotações mais recentes que contenham texto
    const medicalNotes = records
      .map(r => ({ date: r.createdAt, text: r.notes }))
      .filter(n => n.text && n.text.trim().length > 0)
      .slice(0, 5); 

    // Retorna o relatório consolidado com médias, contagem de eventos e notas
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
    // Loga o erro no servidor e retorna status 500
    console.error("Erro na API de relatório médico:", error);
    return NextResponse.json({ error: "Erro interno ao gerar relatório." }, { status: 500 });
  }
}