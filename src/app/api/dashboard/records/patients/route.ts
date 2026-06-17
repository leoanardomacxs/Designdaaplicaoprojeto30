// Este arquivo gerencia a criação de novos pacientes (POST) e a listagem de todos os pacientes do usuário logado (GET).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth"; 

// Função para cadastrar um novo paciente no banco de dados
export async function POST(req: Request) {
  try {
    // Valida a sessão do usuário
    const session = await requireSession();

    // Verifica se o usuário está autenticado
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado. Faça login novamente." }, { status: 401 });
    }

    // Obtém os dados enviados no corpo da requisição
    const body = await req.json();

    // Valida se os campos obrigatórios foram preenchidos
    if (!body.name || !body.age) {
      return NextResponse.json({ error: "Nome e idade são obrigatórios." }, { status: 400 });
    }

    // Cria o novo paciente no banco de dados associando ao ID do usuário
    const newPatient = await prisma.patient.create({
      data: {
        name: body.name,
        age: parseInt(body.age),
        condition: body.condition || "", 
        status: "Active",
        ownerId: session.userId, 
      },
    });

    // Retorna o paciente criado com status 201 (criado com sucesso)
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error: any) {
    // Loga erro e trata possíveis falhas de autenticação ou banco
    console.error("ERRO NO POST:", error);
    
    if (error.message === "Não autenticado.") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno ao salvar paciente." }, { status: 500 });
  }
}

// Função para listar todos os pacientes do usuário com o registro mais recente de cada um
export async function GET() {
  try {
    // Valida a sessão do usuário
    const session = await requireSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Busca todos os pacientes do dono da sessão, incluindo o último registro de cada
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

    // Retorna a lista de pacientes
    return NextResponse.json(patients, { status: 200 });
  } catch (error: any) {
    // Loga erro e retorna falha caso a listagem falhe
    console.error("ERRO NO GET:", error);
    if (error.message === "Não autenticado.") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro ao listar pacientes." }, { status: 500 });
  }
}