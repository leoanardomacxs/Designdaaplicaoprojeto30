//recebe os dados, busca no banco, valida, cria a sessão e retorna os dados
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password)))
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });

    const token = await signToken({ userId: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set("session", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch {
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}