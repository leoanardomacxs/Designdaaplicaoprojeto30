import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();

    // 1. Encontra o paciente padrão do usuário logado (Verenice)
    const patient = await prisma.patient.findFirst({
      where: { ownerId: session.userId },
    });

    if (!patient) {
      return NextResponse.json({ error: "Nenhum paciente encontrado para este cuidador." }, { status: 404 });
    }

    // 2. Salva o registro completo com todos os dados clínicos passados pelo front
    const newRecord = await prisma.record.create({
      data: {
        patientId: patient.id,
        
        // Sinais Vitais
        systolic: body.systolic ? parseInt(body.systolic) : null,
        diastolic: body.diastolic ? parseInt(body.diastolic) : null,
        glucose: body.glucose ? parseInt(body.glucose) : null,
        heart_rate: body.heart_rate ? parseInt(body.heart_rate) : null,
        oxygen: body.oxygen ? parseInt(body.oxygen) : null,
        temperature: body.temperature ? parseFloat(body.temperature) : null,

        // Estado Físico Geral
        weight: body.weight ? parseFloat(body.weight) : null,
        pain_level: body.pain_level ? parseInt(body.pain_level) : null,
        pain_location: body.pain_location || null,
        fatigue: body.fatigue === true,
        dizziness: body.dizziness === true,
        edema: body.edema === true,

        // Mobilidade
        mobility: body.mobility || "Independente",
        recent_falls: body.recent_falls === true,
        difficulty_standing: body.difficulty_standing === true,
        support_equipment: body.support_equipment || "Nenhum",

        // Estado Mental
        oriented: body.oriented !== false, // default true
        mental_confusion: body.mental_confusion === true,
        excessive_sleepiness: body.excessive_sleepiness === true,
        speech_alteration: body.speech_alteration === true,

        // Alimentação e Hidratação
        appetite: body.appetite || "Normal",
        food_intake: body.food_intake || "Total",
        water_intake: body.water_intake || "Adequada",
        difficulty_swallowing: body.difficulty_swallowing === true,

        // Eliminação
        urine: body.urine || "Normal",
        feces: body.feces || "Normal",
        incontinence: body.incontinence || "Nenhuma",

        // Humor e Bem-estar
        mood: body.mood || "Estável",
        activity_interest: body.activity_interest !== false, // default true
        sleep_quality: body.sleep_quality || "Normal",

        notes: body.notes || null,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao salvar registro:", error);
    return NextResponse.json({ error: "Erro interno ao salvar dados clínicos." }, { status: 500 });
  }
}