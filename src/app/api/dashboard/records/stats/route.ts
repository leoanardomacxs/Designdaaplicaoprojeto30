// Este arquivo processa os dados históricos de saúde para fornecer as informações necessárias para a exibição de gráficos.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

// Função principal que busca registros, formata as datas e organiza os dados para o frontend
export async function GET(req: NextRequest) {
  try {
    // Valida a sessão do usuário
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

    // Retorna array vazio se não houver paciente vinculado ou se não pertencer ao usuário
    if (!patient) {
      return NextResponse.json([], { status: 200 });
    }

    // Busca os 15 registros MAIS RECENTES do paciente no banco de dados
    const records = await prisma.record.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" }, // 'desc' garante que pegamos as últimas medições inseridas
      take: 15,
    });

    // Inverte a ordem do array para que o gráfico exiba os dados do mais antigo para o mais recente (ordem cronológica de leitura)
    const chronologicalRecords = records.reverse();

    // Formata os dados invertidos para o formato esperado pelos componentes de gráfico (ex: formato de data simplificado)
    const formattedData = chronologicalRecords.map((r) => ({
      data: new Date(r.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      systolic: r.systolic,
      diastolic: r.diastolic,
      glucose: r.glucose,
      temperature: r.temperature,
      heart_rate: r.heart_rate,
    }));

    // Retorna os dados prontos para visualização gráfica
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    // Loga erro e retorna falha interna
    console.error("Erro na API de estatísticas:", error);
    return NextResponse.json({ error: "Erro interno ao processar gráficos." }, { status: 500 });
  }
}