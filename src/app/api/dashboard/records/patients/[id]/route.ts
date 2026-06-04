// src/app/api/dashboard/records/patients/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Deleta apenas se o paciente pertencer ao usuário logado (Segurança!)
    await prisma.patient.delete({
      where: { 
        id: id,
        ownerId: session.userId 
      },
    });

    return NextResponse.json({ message: "Paciente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir:", error);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}