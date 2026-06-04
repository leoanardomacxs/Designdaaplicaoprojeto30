import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name)
      return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });

    
    const user = await prisma.user.create({
      data: { email, password: await hashPassword(password), name, role: "admin" },
    });

    
    const verenice = await prisma.patient.create({
      data: {
        name: "Verenice Silva",
        age: 78,
        status: "Active",
        ownerId: user.id,
      },
    });

    
    await prisma.record.create({
      data: {
        patientId: verenice.id,
        systolic: 120,
        diastolic: 80,
        glucose: 98,
        heart_rate: 72,
        oxygen: 97,
        temperature: 36.4,
        weight: 65.2,
        pain_level: 2,
        pain_location: "Lombar de leve",
        fatigue: false,
        dizziness: false,
        edema: true, 
        mobility: "Precisa de Ajuda",
        support_equipment: "Bengala",
        oriented: true,
        mental_confusion: false,
        appetite: "Normal",
        food_intake: "Total",
        water_intake: "Adequada",
        urine: "Normal",
        feces: "Normal",
        mood: "Estável",
        notes: "Paciente acordou bem disposta. Leve edema nos membros inferiores no fim do dia.",
      },
    });

    
    const token = await signToken({ userId: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set("session", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno ao criar conta e paciente teste." }, { status: 500 });
  }
}