//Rota de cadastro
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    //Validação de campos obrigatórios
    if (!email || !password || !name)
      return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });

    //Verifica se o usuário já existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });

    //Cria apenas o usuário no banco com a senha criptografada
    const user = await prisma.user.create({
      data: { email, password: await hashPassword(password), name, role: "admin" },
    });

    //Cria o token de sessão (JWT)
    const token = await signToken({ userId: user.id, email: user.email });
    
    //Salva a sessão no cookie seguro do navegador
    const cookieStore = await cookies();
    cookieStore.set("session", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });

    //Retorna a resposta de sucesso com os dados do usuário criado
    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (error) {
    //caso o banco de dados falhe
    return NextResponse.json({ error: "Erro interno ao criar a conta." }, { status: 500 });
  }
}