// Este arquivo gerencia a recuperação do último registro de saúde (GET) e a criação de novos registros detalhados de prontuário (POST).
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";


export async function GET(req: NextRequest) {
  try {
    // Garante que só usuários logados acessam
    const session = await requireSession();
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json({ error: "ID do paciente não informado" }, { status: 400 });
    }

    // Pega o registro mais recente desse paciente, validando o dono da sessão
    const record = await prisma.record.findFirst({
      where: { 
        patientId: patientId,
        patient: { ownerId: session.userId } 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(record ? [record] : []);
  } catch (error) {
    console.error("Erro na API de registros (GET):", error);
    return NextResponse.json({ error: "Erro interno ao buscar registros" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();

    if (!body.patientId) {
      return NextResponse.json({ error: "patientId é obrigatório" }, { status: 400 });
    }

    // Trava de segurança: checa se o paciente existe e pertence ao usuário logado
    const patientExists = await prisma.patient.findFirst({
      where: {
        id: body.patientId,
        ownerId: session.userId
      }
    });

    if (!patientExists) {
      return NextResponse.json({ error: "Paciente não encontrado ou acesso negado." }, { status: 403 });
    }

    // Salva o prontuário tratando os tipos de dados (strings dos inputs para Int, Float ou Boolean)
    const newRecord = await prisma.record.create({
      data: {
        patientId: body.patientId,
        
        // Sinais vitais
        systolic: body.systolic ? parseInt(body.systolic) : null,
        diastolic: body.diastolic ? parseInt(body.diastolic) : null,
        glucose: body.glucose ? parseInt(body.glucose) : null,
        heart_rate: body.heart_rate ? parseInt(body.heart_rate) : null,
        oxygen: body.oxygen ? parseInt(body.oxygen) : null,
        temperature: body.temperature ? parseFloat(body.temperature) : null,
        
        // Bem-estar físico e dores
        weight: body.weight ? parseFloat(body.weight) : null,
        pain_level: body.pain_level ? parseInt(body.pain_level) : null,
        pain_location: body.pain_location,
        fatigue: !!body.fatigue,
        dizziness: !!body.dizziness,
        edema: !!body.edema,
        
        // Locomoção e segurança
        mobility: body.mobility,
        recent_falls: !!body.recent_falls,
        difficulty_standing: !!body.difficulty_standing,
        support_equipment: body.support_equipment,
        
        // Estado cognitivo e neurológico
        oriented: !!body.oriented, 
        mental_confusion: !!body.mental_confusion,
        excessive_sleepiness: !!body.excessive_sleepiness,
        speech_alteration: !!body.speech_alteration,
        
        // Alimentação e hidratação
        appetite: body.appetite,
        food_intake: body.food_intake,
        water_intake: body.water_intake,
        difficulty_swallowing: !!body.difficulty_swallowing,
        
        // Eliminações fisiológicas
        urine: body.urine,
        feces: body.feces,
        incontinence: body.incontinence,
        
        // Comportamento e sono
        mood: body.mood,
        activity_interest: !!body.activity_interest,
        sleep_quality: body.sleep_quality,
        
        notes: body.notes,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Erro na API de registros (POST):", error);
    return NextResponse.json({ error: "Erro interno ao salvar dados" }, { status: 500 });
  }
}