// Este arquivo gerencia a recuperação de todo o histórico de registros de saúde de um paciente específico.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

// Função principal que busca e retorna o histórico de registros do banco de dados
export async function GET(req: NextRequest) {
  try {
    // Verifica a autenticação do usuário
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

    // Retorna uma lista vazia caso o paciente não seja encontrado ou não pertença ao usuário
    if (!patient) {
      return NextResponse.json([], { status: 200 });
    }

    // Busca todos os registros do paciente específico, ordenados do mais recente para o mais antigo
    const history = await prisma.record.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    });

    // Retorna o histórico encontrado como JSON
    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    // Registra o erro no console e retorna uma resposta de falha (500)
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro interno ao carregar histórico." }, { status: 500 });
  }
}