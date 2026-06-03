import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    
    // 1. Captura o ID do paciente que vem da URL
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "ID do paciente não informado." }, { status: 400 });
    }

    // 2. Busca o paciente específico garantindo que ele pertence ao usuário logado
    const patient = await prisma.patient.findFirst({
      where: { 
        id: patientId,
        ownerId: session.userId 
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Paciente não encontrado." }, { status: 404 });
    }

    // Pega o registro mais recente para triagem
    const latest = await prisma.record.findFirst({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json([], { status: 200 });
    }

    const alerts = [];

    // 1. Triagem de Pressão Arterial
    if (latest.systolic && latest.systolic >= 140) {
      alerts.push({
        id: "pa_alta",
        type: "critical",
        title: "Hipertensão Detectada (P.A. Alta)",
        description: `A pressão sistólica está em ${latest.systolic} mmHg. Monitore sintomas de dor de cabeça ou nuca.`,
      });
    } else if (latest.systolic && latest.systolic <= 90) {
      alerts.push({
        id: "pa_baixa",
        type: "warning",
        title: "Hipotensão Detectada (P.A. Baixa)",
        description: `A pressão sistólica está em ${latest.systolic} mmHg. Risco de tontura ao levantar.`,
      });
    }

    // 2. Triagem de Glicemia
    if (latest.glucose && latest.glucose >= 180) {
      alerts.push({
        id: "glicemia_alta",
        type: "critical",
        title: "Hiperglicemia Severa",
        description: `Glicemia em ${latest.glucose} mg/dL. Verifique a administração de insulina/medicação conforme orientação médica.`,
      });
    } else if (latest.glucose && latest.glucose <= 70) {
      alerts.push({
        id: "glicemia_baixa",
        type: "critical",
        title: "Hipoglicemia (Alerta de Emergência)",
        description: `Glicemia perigosamente baixa em ${latest.glucose} mg/dL. Ofereça carboidrato de rápida absorção imediatamente.`,
      });
    }

    // 3. Triagem de Temperatura
    if (latest.temperature && latest.temperature >= 37.8) {
      alerts.push({
        id: "febre",
        type: "critical",
        title: "Estado Febril / Hipertermia",
        description: `Temperatura corporal em ${latest.temperature} °C. Monitore possíveis focos de infecção.`,
      });
    }

    // 4. Triagem de Saturação de Oxigênio
    if (latest.oxygen && latest.oxygen < 94) {
      alerts.push({
        id: "oxigenio_baixo",
        type: "critical",
        title: "Baixa Saturação de Oxigênio (SpO₂)",
        description: `Saturação em ${latest.oxygen}%. Se persistir abaixo de 92%, avalie necessidade de oxigênio/socorro médico.`,
      });
    }

    // 5. Triagem de Eventos Críticos (Quedas / Confusão)
    if (latest.recent_falls) {
      alerts.push({
        id: "queda_recente",
        type: "critical",
        title: "Registro de Queda nas Últimas 24h",
        description: "Atenção total! Uma queda foi reportada no último plantão. Avalie dores latentes ou traumas ocultos.",
      });
    }

    if (latest.mental_confusion) {
      alerts.push({
        id: "confusao_mental",
        type: "warning",
        title: "Sinal de Confusão Mental",
        description: "Paciente apresentou desorientação ou esquecimento incomum no último registro.",
      });
    }

    return NextResponse.json(alerts, { status: 200 });
  } catch (error) {
    console.error("Erro na API de alertas:", error);
    return NextResponse.json({ error: "Erro interno ao processar alertas." }, { status: 500 });
  }
}