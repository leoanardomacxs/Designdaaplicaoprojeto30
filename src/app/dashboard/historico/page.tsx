"use client";

import React, { useEffect, useState } from "react";
import { Calendar, HeartPulse, Droplets, Thermometer, Wind, Activity, Smile, MessageSquare, Users } from "lucide-react";

import { usePatient } from "@/context/PatientContext";

export default function HistoricoPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const { selectedPatient } = usePatient();

  useEffect(() => {
    
    if (!selectedPatient?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

   
    fetch(`/api/dashboard/records/history?patientId=${selectedPatient.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar o histórico clínico");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar histórico:", err);
        setError("Não foi possível processar a linha do tempo médica.");
      })
      .finally(() => setLoading(false));
  }, [selectedPatient?.id]); 

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

 
  if (!selectedPatient) {
    return (
      <div className="max-w-6xl mx-auto rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-700">Nenhum idoso selecionado</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Por favor, acesse a aba <strong>"Pacientes"</strong> e selecione um prontuário para visualizar a linha do tempo clínica.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-800">Histórico de Prontuário</h1>
        {/* 4. Nome dinâmico mapeado diretamente do contexto */}
        <p className="text-sm text-slate-500 mt-1">
          Linha do tempo completa das evoluções diárias de: <strong className="text-blue-600">{selectedPatient.name}</strong>
        </p>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-xl text-sm font-semibold border bg-rose-50 text-rose-700 border-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm font-medium text-slate-400 bg-white border border-dashed rounded-2xl">
          Carregando linha do tempo clínica...
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">Nenhum registro no histórico</h3>
          <p className="text-sm text-slate-400 mt-1">
            Preencha a aba <strong>"Registro Diário"</strong> para popular a tabela de evolução clínica deste paciente.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Data / Hora</th>
                  <th className="py-4 px-4">P.A.</th>
                  <th className="py-4 px-4">Glicemia</th>
                  <th className="py-4 px-4">Temp.</th>
                  <th className="py-4 px-4">Freq. Cardíaca</th>
                  <th className="py-4 px-4">SpO₂</th>
                  <th className="py-4 px-4">Humor</th>
                  <th className="py-4 px-6">Evolução / Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-700 whitespace-nowrap">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {record.systolic && record.diastolic ? (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                          <HeartPulse className="h-3.5 w-3.5 text-blue-500" /> {record.systolic}/{record.diastolic}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {record.glucose ? (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                          <Droplets className="h-3.5 w-3.5 text-emerald-500" /> {record.glucose} <span className="text-[10px] text-slate-400">mg/dL</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {record.temperature ? (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                          <Thermometer className="h-3.5 w-3.5 text-amber-500" /> {record.temperature}°C
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {record.heart_rate ? (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                          <Activity className="h-3.5 w-3.5 text-rose-500" /> {record.heart_rate} <span className="text-[10px] text-slate-400">bpm</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {record.oxygen ? (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                          <Wind className="h-3.5 w-3.5 text-cyan-500" /> {record.oxygen}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {record.mood ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          <Smile className="h-3.5 w-3.5 text-emerald-500" /> {record.mood}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-xs text-slate-500 italic" title={record.notes}>
                      {record.notes ? (
                        <span className="flex items-start gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{record.notes}</span>
                        </span>
                      ) : "Nenhuma nota inserida"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}