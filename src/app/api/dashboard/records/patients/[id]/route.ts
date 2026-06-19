// Este arquivo gerencia as operações de busca detalhada (GET) e exclusão (DELETE) de um paciente específico pelo seu ID.
//Gerencia um paciente por vez 
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

// Função para buscar os dados de um paciente e seu histórico de registros
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Valida se o usuário está autenticado
    const session = await requireSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Extrai o ID da URL
    const { id } = await params;

    // Busca o paciente no banco, garantindo que ele pertence ao usuário logado, incluindo seus registros
    const patient = await prisma.patient.findUnique({
      where: { 
        id: id,
        ownerId: session.userId 
      },
      include: { 
        records: { 
          orderBy: { createdAt: "desc" } 
        } 
      }
    });

    // Retorna erro se o paciente não for encontrado
    if (!patient) {
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    }

    // Retorna os dados do paciente e seus registros
    return NextResponse.json(patient);
  } catch (error) {
    // Loga erro e retorna falha interna
    console.error("Erro no GET do paciente:", error);
    return NextResponse.json({ error: "Erro ao buscar paciente" }, { status: 500 });
  }
}

// Função para remover um paciente do banco de dados
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Valida se o usuário está autenticado
    const session = await requireSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Extrai o ID da URL
    const { id } = await params;

    // Deleta o paciente validando que pertence ao usuário logado
    await prisma.patient.delete({
      where: { 
        id: id,
        ownerId: session.userId 
      },
    });

    // Retorna confirmação de sucesso
    return NextResponse.json({ message: "Paciente excluído com sucesso" });
  } catch (error) {
    // Loga erro e retorna falha interna
    console.error("Erro ao excluir paciente:", error);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}