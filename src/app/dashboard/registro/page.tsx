"use client";

import { usePatient } from "@/context/PatientContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, ShieldAlert, Brain, Utensils, Construction, Smile, Save, Users } from "lucide-react";

export default function RegistroDiarioPage() {
  const { selectedPatient } = usePatient(); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  
  const [formData, setFormData] = useState({
    
    systolic: "", diastolic: "", glucose: "", heart_rate: "", oxygen: "", temperature: "",
    
    weight: "", pain_level: "0", pain_location: "", fatigue: false, dizziness: false, edema: false,
    
    mobility: "Independente", recent_falls: false, difficulty_standing: false, support_equipment: "Nenhum",
    
    oriented: true, mental_confusion: false, excessive_sleepiness: false, speech_alteration: false,
    
    appetite: "Normal", food_intake: "Total", water_intake: "Adequada", difficulty_swallowing: false,
    
    urine: "Normal", feces: "Normal", incontinence: "Nenhuma",
    
    mood: "Estável", activity_interest: true, sleep_quality: "Normal",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedPatient) {
    setMessage({ type: "error", text: "Selecione um paciente na aba 'Pacientes' antes de registrar." });
    return;
  }

  
  
  const requiredFields = {
    systolic: "Pressão Sistólica",
    diastolic: "Pressão Diastólica",
    glucose: "Glicemia",
    heart_rate: "Frequência Cardíaca",
    oxygen: "Saturação de Oxigênio",
    temperature: "Temperatura Corporal",
    weight: "Peso Atual"
  };

  
  const missingFields = Object.entries(requiredFields)
    .filter(([key]) => formData[key as keyof typeof formData] === "")
    .map(([, label]) => label);

  
  if (missingFields.length > 0) {
    setMessage({ 
      type: "error", 
      text: `Preencha todos os campos obrigatórios: ${missingFields.join(", ")}.` 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    return;
  }

  setLoading(true);
  setMessage({ type: "", text: "" });

  
  const processedData = {
    ...formData,
    patientId: selectedPatient.id,
    systolic: parseInt(formData.systolic, 10),
    diastolic: parseInt(formData.diastolic, 10),
    glucose: parseInt(formData.glucose, 10),
    heart_rate: parseInt(formData.heart_rate, 10),
    oxygen: parseInt(formData.oxygen, 10),
    temperature: parseFloat(formData.temperature),
    weight: parseFloat(formData.weight),
    pain_level: parseInt(formData.pain_level, 10),
  };

  try {
    const res = await fetch("/api/dashboard/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(processedData),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "Evolução clínica salva com sucesso!" });
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      const err = await res.json();
      setMessage({ type: "error", text: err.error || "Erro ao salvar dados." });
    }
  } catch (error) {
    setMessage({ type: "error", text: "Erro de conexão." });
  } finally {
    setLoading(false);
  }
};

  
  if (!selectedPatient) {
    return (
      <div className="max-w-6xl mx-auto rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-700">Nenhum idoso selecionado</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Por favor, acesse a aba <strong>"Pacientes"</strong> e selecione um prontuário antes de criar uma evolução clínica diária.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-800">Evolução de Registro Diário</h1>
        <p className="text-sm text-slate-500 mt-1">
          Lançando dados de monitoramento para: <strong className="text-blue-600">{selectedPatient.name}</strong>
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. SINAIS VITAIS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <HeartPulse className="h-4 w-4 text-blue-600" /> 1. Sinais Vitais (Base do Acompanhamento)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Pressão Sistólica (mmHg)</label>
              <input type="number" name="systolic" placeholder="Ex: 120" value={formData.systolic} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Pressão Diastólica (mmHg)</label>
              <input type="number" name="diastolic" placeholder="Ex: 80" value={formData.diastolic} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Glicemia (mg/dL)</label>
              <input type="number" name="glucose" placeholder="Ex: 95" value={formData.glucose} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Frequência Cardíaca (bpm)</label>
              <input type="number" name="heart_rate" placeholder="Ex: 72" value={formData.heart_rate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Saturação de Oxigênio (%)</label>
              <input type="number" name="oxygen" placeholder="Ex: 98" value={formData.oxygen} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Temperatura Corporal (°C)</label>
              <input type="number" step="0.1" name="temperature" placeholder="Ex: 36.5" value={formData.temperature} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* 2. ESTADO FÍSICO GERAL */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" /> 2. Estado Físico Geral e Queixas
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Peso Atual (kg)</label>
              <input type="number" step="0.1" name="weight" placeholder="Ex: 65.4" value={formData.weight} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nível de Dor (0 a 10)</label>
              <select name="pain_level" value={formData.pain_level} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                {[...Array(11)].map((_, i) => <option key={i} value={i}>{i} - {i === 0 ? "Sem dor" : i <= 4 ? "Leve" : i <= 8 ? "Moderada" : "Intensa"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Local da Dor (se houver)</label>
              <input type="text" name="pain_location" placeholder="Ex: Joelho direito" value={formData.pain_location} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="fatigue" checked={formData.fatigue} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Cansaço / Fadiga fora do normal
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="dizziness" checked={formData.dizziness} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Tontura ou Fraqueza perceptível
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="edema" checked={formData.edema} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Inchaço (Edema) em pernas ou pés
            </label>
          </div>
        </div>

        {/* 3. MOBILIDADE E SEGURANÇA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Construction className="h-4 w-4 text-slate-600" /> 3. Mobilidade e Segurança de Locomoção
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Capacidade de andar</label>
              <select name="mobility" value={formData.mobility} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                <option value="Independente">Anda sozinho(a) (Independente)</option>
                <option value="Precisa de Ajuda">Precisa de auxílio / apoio de cuidador</option>
                <option value="Acamado">Acamado / Cadeirante total</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Equipamento de Apoio Utilizado</label>
              <select name="support_equipment" value={formData.support_equipment} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                <option value="Nenhum">Nenhum apoio</option>
                <option value="Bengala">Bengala</option>
                <option value="Andador">Andador</option>
                <option value="Cadeira de Rodas">Cadeira de rodas</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <label className="flex items-center gap-2 text-sm font-medium text-red-600 cursor-pointer">
              <input type="checkbox" name="recent_falls" checked={formData.recent_falls} onChange={handleChange} className="h-4 w-4 rounded text-red-600" /> Quedas ou quase quedas recentes!
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="difficulty_standing" checked={formData.difficulty_standing} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Dificuldade severa para levantar ou sentar
            </label>
          </div>
        </div>

        {/* 4. ESTADO MENTAL E NEUROLÓGICO */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Brain className="h-4 w-4 text-purple-600" /> 4. Estado Mental e Cognitivo
          </h3>
          <div className="flex flex-wrap gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="oriented" checked={formData.oriented} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Está bem orientado (Sabe onde está e que dia é hoje)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer">
              <input type="checkbox" name="mental_confusion" checked={formData.mental_confusion} onChange={handleChange} className="h-4 w-4 rounded text-amber-600" /> Confusão mental ou esquecimentos anormais
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="excessive_sleepiness" checked={formData.excessive_sleepiness} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Sonolência excessiva ou agitação motora
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-red-600 cursor-pointer">
              <input type="checkbox" name="speech_alteration" checked={formData.speech_alteration} onChange={handleChange} className="h-4 w-4 rounded text-red-600" /> Alteração repentina na fala ou fraqueza súbita
            </label>
          </div>
        </div>

        {/* 5 e 6. NUTRIÇÃO E ELIMINAÇÕES */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Utensils className="h-4 w-4 text-emerald-600" /> 5. Alimentação e Hidratação
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Apetite</label>
                <select name="appetite" value={formData.appetite} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Normal">Normal</option>
                  <option value="Reduzido">Reduzido</option>
                  <option value="Ausente">Ausente</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Quantidade de comida aceita</label>
                <select name="food_intake" value={formData.food_intake} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Total">Comeu tudo (Total)</option>
                  <option value="Parcial">Comeu metade (Parcial)</option>
                  <option value="Pouco">Rejeitou quase tudo (Pouco)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Ingestão hídrica (Água)</label>
                <select name="water_intake" value={formData.water_intake} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Adequada">Adequada / Boa hidratação</option>
                  <option value="Baixa">Baixa (Bebeu pouca água)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer pt-1">
                <input type="checkbox" name="difficulty_swallowing" checked={formData.difficulty_swallowing} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Dificuldade/engasgos ao engolir
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <HeartPulse className="h-4 w-4 text-cyan-600" /> 6. Eliminações Fisiológicas
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Urina</label>
                <select name="urine" value={formData.urine} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Normal">Normal (Clara, sem queixas)</option>
                  <option value="Alterada">Alterada (Escura, dor ao urinar ou pouca quant.)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Evacuação / Fezes</label>
                <select name="feces" value={formData.feces} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Normal">Normal / Pastosa</option>
                  <option value="Prisão de ventre">Constipação (Prisão de ventre)</option>
                  <option value="Diarreia">Diarreia / Líquida</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Incontinência</label>
                <select name="incontinence" value={formData.incontinence} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Nenhuma">Nenhuma incontinência</option>
                  <option value="Urinária">Urinária (Escapes ou uso de fralda p/ urina)</option>
                  <option value="Fecal">Fecal</option>
                  <option value="Ambas">Urinária e Fecal (Ambas)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 7. HUMOR, SONO E OBSERVAÇÕES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Smile className="h-4 w-4 text-rose-500" /> 7. Humor, Comportamento e Sono
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Humor Geral</label>
              <select name="mood" value={formData.mood} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                <option value="Estável">Estável / Calmo</option>
                <option value="Triste">Triste / Choroso</option>
                <option value="Irritado">Irritado / Agressivo</option>
                <option value="Apático">Apático / Sem reação</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Qualidade do Sono da última noite</label>
              <select name="sleep_quality" value={formData.sleep_quality} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none">
                <option value="Normal">Dormiu bem (Normal)</option>
                <option value="Muito alterado">Muito alterado (Insônia, acordou muito)</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" name="activity_interest" checked={formData.activity_interest} onChange={handleChange} className="h-4 w-4 rounded text-blue-600" /> Demonstrou interesse nas atividades diárias e convívio
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Observações gerais / Evolução descritiva do Prontuário</label>
            <textarea name="notes" rows={3} placeholder="Digite intercorrências, medicações administradas ou detalhes observados..." value={formData.notes} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50">
            <Save className="h-4 w-4" /> {loading ? "Salvando prontuário..." : "Salvar Registro de Evolução"}
          </button>
        </div>
      </form>
    </div>
  );
}