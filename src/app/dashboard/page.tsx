"use client";

import { useState, useEffect } from "react";
import { 
  HeartPulse, Droplets, Thermometer, Activity, Wind, Smile, Plus, AlertCircle, ShieldCheck, UserCheck 
} from "lucide-react";
import Link from "next/link";
import { usePatient } from "@/context/PatientContext";

function Stat({ icon: Icon, label, value, unit, tone = "primary" }: any) {
  const tones: Record<string, string> = {
    primary: "text-blue-600 bg-blue-50 border-blue-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    info: "text-cyan-600 bg-cyan-50 border-cyan-100",
    destructive: "text-rose-600 bg-rose-50 border-rose-100",
  };

  return (
    <div className={`rounded-2xl border p-5 bg-white shadow-sm transition hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone] || tones.primary}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="font-display text-2xl font-bold text-slate-800 mt-1">
        {value} {unit && <span className="ml-0.5 text-xs font-semibold text-slate-400">{unit}</span>}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedPatient } = usePatient();

  useEffect(() => {
    if (!selectedPatient?.id) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Certifique-se de que a rota abaixo existe no seu backend
    fetch(`/api/dashboard/records?patientId=${selectedPatient.id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Erro ${res.status}: Falha ao buscar registros`);
        }
        return res.json();
      })
      .then((data) => {
        // Se sua API retorna um array direto ou um objeto com a chave records
        setRecords(Array.isArray(data) ? data : (data.records || []));
      })
      .catch((err) => {
        console.error("DEBUG ERRO DASHBOARD:", err);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [selectedPatient?.id]);

  const latest = records[0];

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-blue-500/10">
            {selectedPatient ? selectedPatient.name.substring(0, 2).toUpperCase() : "??"}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-800">
              {selectedPatient ? selectedPatient.name : "Selecione um paciente"}
            </h1>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block h-2 w-2 rounded-full ${selectedPatient ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></span>
              {selectedPatient ? `${selectedPatient.age} anos • ${selectedPatient.condition || "Sem quadro clínico"}` : "Nenhum paciente ativo"}
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/registro" 
          className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          <Plus className="mr-1.5 h-4 w-4 stroke-[3]" /> Novo registro
        </Link>
      </div>

      {!selectedPatient ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">Nenhum paciente selecionado</h3>
        </div>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center text-sm font-medium text-slate-400 bg-white border border-dashed rounded-2xl">
          Carregando dados...
        </div>
      ) : !latest ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">Nenhum histórico encontrado</h3>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <Stat icon={HeartPulse} label="Pressão" value={latest.systolic ? `${latest.systolic}/${latest.diastolic}` : "N/A"} unit="mmHg" tone="primary" />
            <Stat icon={Droplets} label="Glicemia" value={latest.glucose || "N/A"} unit="mg/dL" tone="success" />
            <Stat icon={Thermometer} label="Temperatura" value={latest.temperature || "N/A"} unit="°C" tone="warning" />
            <Stat icon={Activity} label="Frequência" value={latest.heart_rate || "N/A"} unit="bpm" tone="destructive" />
            <Stat icon={Wind} label="Saturação" value={latest.oxygen || "N/A"} unit="%" tone="info" />
            <Stat icon={Smile} label="Humor" value={latest.mood || "N/A"} tone="success" />
          </div>
          {/* ... restante do seu layout de cards abaixo ... */}
        </div>
      )}
    </div>
  );
}