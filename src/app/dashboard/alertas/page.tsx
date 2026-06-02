"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, BellRing, Info, Users } from "lucide-react";
// 1. Importa o hook do contexto de pacientes que você já usa nas outras telas
import { usePatient } from "@/context/PatientContext"; 

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Extrai o paciente selecionado no painel geral
  const { selectedPatient } = usePatient();

  useEffect(() => {
    // Se não houver nenhum paciente selecionado no monitoramento, não faz o fetch
    if (!selectedPatient?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    // 3. Faz o fetch apontando para a rota correta do dashboard passando o ID via Query Params (?patientId=...)
    fetch(`/api/dashboard/records/alerts?patientId=${selectedPatient.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar triagem de alertas");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          setAlerts([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar alertas:", err);
        setError("Não foi possível processar a triagem de alertas clínicos.");
      })
      .finally(() => setLoading(false));
  }, [selectedPatient?.id]); // Executa novamente sempre que o ID do paciente ativo mudar

  // Estado caso o usuário acesse a aba sem ter ativado nenhum paciente antes
  if (!selectedPatient) {
    return (
      <div className="max-w-4xl mx-auto rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-700">Nenhum idoso selecionado</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Por favor, acesse a aba <strong>"Pacientes"</strong> e clique sobre um card para ativar o monitoramento clínico e ver os alertas.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800">Central de Alertas Clínicos</h1>
        {/* 4. Nome dinâmico trocado de "Verenice" para o paciente selecionado no contexto */}
        <p className="text-sm text-slate-500 mt-1">
          Triagem automática dos parâmetros de segurança de:{" "}
          <strong className="text-blue-600">{selectedPatient.name}</strong>
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-semibold border bg-rose-50 text-rose-700 border-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm font-medium text-slate-400 bg-white border border-dashed rounded-2xl">
          Processando triagem de sinais vitais...
        </div>
      ) : alerts.length === 0 ? (
        /* Caso tudo esteja perfeito e sem alterações graves */
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-14 w-14 text-emerald-500 mb-3" />
          <h3 className="text-lg font-bold text-emerald-800">Nenhum Alerta Crítico Ativo</h3>
          <p className="text-sm text-emerald-600 max-w-md mx-auto mt-1">
            Todos os sinais vitais, parâmetros metabólicos e eventos do último registro diário de <strong>{selectedPatient.name}</strong> estão dentro das metas de segurança estabelecidas.
          </p>
        </div>
      ) : (
        /* Listagem de Alertas Gerados */
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
            <BellRing className="h-4 w-4 animate-bounce" /> Atenção cuidador: Existem {alerts.length} inconformidades ativas no prontuário!
          </div>

          <div className="grid gap-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-5 rounded-2xl border shadow-sm flex gap-4 items-start transition-all ${
                  alert.type === "critical" 
                    ? "bg-rose-50/60 border-rose-200/80 hover:bg-rose-50" 
                    : "bg-amber-50/60 border-amber-200/80 hover:bg-amber-50"
                }`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  alert.type === "critical" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${alert.type === "critical" ? "text-rose-900" : "text-amber-900"}`}>
                    {alert.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${alert.type === "critical" ? "text-rose-700" : "text-amber-700"}`}>
                    {alert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-slate-500 text-xs flex gap-2 items-center">
            <Info className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Estes alertas são gerados automaticamente baseados no último registro inserido e não substituem o diagnóstico ou conduta de um médico ou enfermeiro regulador.</span>
          </div>
        </div>
      )}
    </div>
  );
}