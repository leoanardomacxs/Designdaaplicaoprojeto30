"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Calendar, Activity, X, UserCheck, Trash2 } from "lucide-react";
import { usePatient } from "@/context/PatientContext"; 

export default function PacientesPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newPatient, setNewPatient] = useState({ name: "", age: "", condition: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.")) return;

    try {
      const res = await fetch(`/api/dashboard/records/patients/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadPatients();
      } else {
        alert("Erro ao excluir paciente.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

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

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = `${window.location.origin}/share/${patient.id}`;
                      navigator.clipboard.writeText(url);
                      alert("Link de visualização copiado com sucesso!");
                    }}
                    className="flex-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    🔗 Copiar Link
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(patient.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-800">Novo Vínculo de Idoso</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleCreatePatient} className="p-6 space-y-4">
              {error && <div className="p-3 text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-100 rounded-xl">{error}</div>}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nome Completo</label>
                <input required type="text" value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Idade</label>
                <input required type="number" value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Condições Clínicas</label>
                <input type="text" value={newPatient.condition} onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})} className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <div className="pt-2 border-t border-slate-100 flex gap-3 justify-end text-sm">
                <button type="button" onClick={() => setShowModal(false)} className="h-11 px-4 font-semibold text-slate-500 hover:bg-slate-50 rounded-xl">Cancelar</button>
                <button type="submit" disabled={submitting} className="h-11 px-5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50">{submitting ? "Cadastrando..." : "Confirmar Vínculo"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}