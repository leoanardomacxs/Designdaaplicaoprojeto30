import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

// Função principal que processa a requisição GET para gerar alertas de saúde
export async function GET(req: NextRequest) {
  try {
    // Verifica se o usuário está logado
    const session = await requireSession();
    
    // Captura o ID do paciente enviado na URL
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    // Valida se o ID do paciente foi enviado
    if (!patientId) {
      return NextResponse.json({ error: "ID do paciente não informado." }, { status: 400 });
    }

    // Busca o paciente no banco garantindo que ele pertence ao usuário logado
    const patient = await prisma.patient.findFirst({
      where: { 
        id: patientId,
        ownerId: session.userId 
      },
    });

    // Retorna erro se o paciente não existir
    if (!patient) {
      return NextResponse.json({ error: "Paciente não encontrado." }, { status: 404 });
    }

    // Busca o último registro de saúde do paciente, ordenado pela data mais recente
    const latest = await prisma.record.findFirst({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    });

    // Retorna lista vazia se não houver registros
    if (!latest) {
      return NextResponse.json([], { status: 200 });
    }

    // Inicializa lista para armazenar alertas gerados
    const alerts = [];

    // Verifica pressão arterial e adiciona alerta se estiver fora da faixa
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

    // Verifica glicemia e adiciona alerta se estiver alta ou baixa
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

    // Verifica temperatura corporal e adiciona alerta se houver febre
    if (latest.temperature && latest.temperature >= 37.8) {
      alerts.push({
        id: "febre",
        type: "critical",
        title: "Estado Febril / Hipertermia",
        description: `Temperatura corporal em ${latest.temperature} °C. Monitore possíveis focos de infecção.`,
      });
    }

    // Verifica nível de oxigênio e adiciona alerta se estiver baixo
    if (latest.oxygen && latest.oxygen < 94) {
      alerts.push({
        id: "oxigenio_baixo",
        type: "critical",
        title: "Baixa Saturação de Oxigênio (SpO₂)",
        description: `Saturação em ${latest.oxygen}%. Se persistir abaixo de 92%, avalie necessidade de oxigênio/socorro médico.`,
      });
    }

    // Verifica se houve queda recente registrada
    if (latest.recent_falls) {
      alerts.push({
        id: "queda_recente",
        type: "critical",
        title: "Registro de Queda nas Últimas 24h",
        description: "Atenção total! Uma queda foi reportada no último plantão. Avalie dores latentes ou traumas ocultos.",
      });
    }

    // Verifica sinais de confusão mental
    if (latest.mental_confusion) {
      alerts.push({
        id: "confusao_mental",
        type: "warning",
        title: "Sinal de Confusão Mental",
        description: "Paciente apresentou desorientação ou esquecimento incomum no último registro.",
      });
    }

    // Envia a lista final de alertas encontrada
    return NextResponse.json(alerts, { status: 200 });
  } catch (error) {
    // Retorna erro caso ocorra falha na execução
    console.error("Erro na API de alertas:", error);
    return NextResponse.json({ error: "Erro interno ao processar alertas." }, { status: 500 });
  }
}