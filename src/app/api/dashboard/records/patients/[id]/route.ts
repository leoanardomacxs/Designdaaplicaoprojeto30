import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

// Função para buscar um paciente específico pelo ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

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

    if (!patient) {
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Erro no GET do paciente:", error);
    return NextResponse.json({ error: "Erro ao buscar paciente" }, { status: 500 });
  }
}

// Função para excluir um paciente
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.patient.delete({
      where: { 
        id: id,
        ownerId: session.userId 
      },
    });

    return NextResponse.json({ message: "Paciente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}