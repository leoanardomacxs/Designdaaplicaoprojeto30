import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Activity, Heart, Thermometer, Droplets, Calendar, User, Info } from "lucide-react";

export default async function PublicPatientView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { records: { orderBy: { createdAt: 'desc' } } }
  });

  if (!patient) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header do Paciente */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 text-white p-3 rounded-2xl"><User size={24} /></div>
              <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
            </div>
            <p className="text-slate-500 font-medium">Idade: {patient.age} anos • Status: {patient.status || 'Em monitoramento'}</p>
            <div className="mt-4 inline-block bg-blue-50 px-4 py-1.5 rounded-full text-sm font-semibold text-blue-700">
              Condição: {patient.condition || "Sem condições registradas"}
            </div>
          </div>
        </div>

        {/* Histórico Detalhado */}
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="text-blue-600" /> Histórico de Monitoramento
        </h2>

        <div className="grid gap-6">
          {patient.records.length > 0 ? (
            patient.records.map((record) => (
              <div key={record.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold">
                    <Calendar size={16} /> {new Date(record.createdAt).toLocaleString()}
                  </div>
                </div>
                
                {/* Sinais Vitais */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Pressão</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Heart className="text-rose-500" size={16} /> {record.systolic ? `${record.systolic}/${record.diastolic}` : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Glicemia</p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{record.glucose || "--"} <span className="text-xs text-slate-400">mg/dL</span></p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Temperatura</p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{record.temperature || "--"} <span className="text-xs text-slate-400">°C</span></p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Saturação</p>
                    <p className="text-lg font-bold text-slate-800 mt-0.5">{record.oxygen || "--"} <span className="text-xs text-slate-400">%</span></p>
                  </div>
                </div>

                {/* Detalhes Clínicos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div className="text-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Mobilidade</p>
                    <p className="font-semibold text-slate-700">{record.mobility}</p>
                    <p className="text-xs text-slate-500">Apoio: {record.support_equipment}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Mental / Humor</p>
                    <p className="font-semibold text-slate-700">{record.oriented ? "Orientado" : "Confuso"}</p>
                    <p className="text-xs text-slate-500">Humor: {record.mood}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Nutrição</p>
                    <p className="font-semibold text-slate-700">Apetite: {record.appetite}</p>
                    <p className="text-xs text-slate-500">Ingestão: {record.food_intake}</p>
                  </div>
                </div>

                {/* Notas */}
                {record.notes && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Info size={12} /> Observações do Cuidador
                    </p>
                    <p className="text-sm text-slate-600 italic">{record.notes}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
              <p className="text-slate-400">Nenhum registro encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}