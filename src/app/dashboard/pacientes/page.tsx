"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Calendar, Activity, X, UserCheck } from "lucide-react";
import { usePatient } from "@/context/PatientContext"; 

export default function PacientesPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newPatient, setNewPatient] = useState({ name: "", age: "", condition: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Extraímos os estados e funções globais do Contexto
  const { selectedPatient, selectPatient } = usePatient();

  const loadPatients = () => {
    setLoading(true);
    setError("");
    fetch("/api/dashboard/records/patients")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do servidor");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setPatients(data);
      })
      .catch((err) => {
        console.error("Erro ao carregar pacientes:", err);
        setError("Não foi possível carregar a lista de pacientes.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Converte a idade para número inteiro antes de despachar para o Prisma
    const payload = {
      ...newPatient,
      age: parseInt(newPatient.age, 10) || null
    };

    try {
      const res = await fetch("/api/dashboard/records/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.ok) {
        setShowModal(false);
        setNewPatient({ name: "", age: "", condition: "" });
        loadPatients(); 
        
        // Se for o único ou primeiro paciente que a pessoa cadastrou, já deixa selecionado automaticamente
        if (patients.length === 0 && responseData) {
          selectPatient({
            id: responseData.id,
            name: responseData.name,
            age: Number(responseData.age),
            condition: responseData.condition || ""
          });
        }
      } else {
        setError(responseData.error || "Erro ao criar paciente no servidor.");
      }
    } catch (err) {
      console.error("Erro detalhado no fetch:", err);
      setError("Erro de comunicação com a API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Meus Idosos Assistidos</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os prontuários e clique em um card para ativá-lo no painel de monitoramento.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all shrink-0"
        >
          <UserPlus className="h-4 w-4" /> Vincular Novo Paciente
        </button>
      </div>

      {error && !showModal && (
        <div className="p-4 rounded-xl text-sm font-semibold border bg-rose-50 text-rose-700 border-rose-200">
          {error}
        </div>
      )}

      {/* Grid de Conteúdo */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm font-medium text-slate-400 bg-white border border-dashed rounded-2xl">
          Mapeando rede de pacientes vinculados...
        </div>
      ) : patients.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">Nenhum paciente cadastrado</h3>
          <p className="text-sm text-slate-400 mt-1">Clique no botão superior para vincular e iniciar os acompanhamentos.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => {
            const isSelected = selectedPatient?.id === patient.id;

            // Safe split para evitar quebras em strings inexistentes ou nulas
            const initials = patient.name
              ? patient.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
              : "ID";

            return (
              <div 
                key={patient.id} 
                onClick={() => selectPatient({
                  id: patient.id,
                  name: patient.name,
                  age: Number(patient.age),
                  condition: patient.condition || ""
                })}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected 
                    ? "border-blue-500 ring-2 ring-blue-500/10 shadow-md shadow-blue-500/5 bg-gradient-to-b from-white to-blue-50/10" 
                    : "border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`h-10 w-10 shrink-0 rounded-full font-bold flex items-center justify-center text-sm ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-800 text-base truncate">{patient.name}</h3>
                        <p className="text-xs text-slate-400">{patient.age} anos</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                        <UserCheck className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold uppercase block text-[9px]">Quadro Clínico / Diagnósticos</span>
                      <span className="text-slate-600 font-medium block truncate mt-0.5">{patient.condition || "Nenhuma comorbidade listada"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Modular de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-800">Novo Vínculo de Idoso</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePatient} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-100 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  placeholder="Ex: Verenice Silva"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Idade</label>
                <input 
                  type="number" 
                  required
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  placeholder="Ex: 78"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Condições Clínicas de Atenção</label>
                <input 
                  type="text" 
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                  placeholder="Ex: Hipertensão, Diabetes Tipo 2"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-3 justify-end text-sm">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="h-11 px-4 font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="h-11 px-5 bg-blue-600 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Cadastrando..." : "Confirmar Vínculo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}