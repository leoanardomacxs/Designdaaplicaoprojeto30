import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth"; 

export async function POST(req: Request) {
  try {
    
    const session = await requireSession();

    
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    const body = await req.json();

    if (!body.name || !body.age) {
      return NextResponse.json({ error: "Nome e idade são obrigatórios." }, { status: 400 });
    }

    
    const newPatient = await prisma.patient.create({
      data: {
        name: body.name,
        age: parseInt(body.age),
        condition: body.condition || "", 
        status: "Active",
        ownerId: session.userId, 
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error: any) {
    console.error("ERRO NO POST:", error);
    
    if (error.message === "Não autenticado.") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno ao salvar paciente." }, { status: 500 });
  }
}

export async function GET() {
  try {
    
    const session = await requireSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    
    const patients = await prisma.patient.findMany({
      where: {
        ownerId: session.userId, 
      },
      include: {
        records: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients, { status: 200 });
  } catch (error: any) {
    console.error("ERRO NO GET:", error);
    if (error.message === "Não autenticado.") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro ao listar pacientes." }, { status: 500 });
  }
}