"use client";

import React, { useEffect, useState } from "react";
import { FileText, Printer, HeartPulse, Droplets, Thermometer, ShieldAlert, FileClock } from "lucide-react";

export default function RelatorioMedicoPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/records/report")
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => console.error("Erro ao carregar relatório:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm font-medium text-slate-400 bg-white border border-dashed rounded-2xl max-w-4xl mx-auto">
        Compilando dados epidemiológicos e prontuário estruturado...
      </div>
    );
  }

  if (!report || report.empty) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center max-w-4xl mx-auto">
        <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-700">Sem dados para relatório</h3>
        <p className="text-sm text-slate-400 mt-1">Insira registros diários para gerar o laudo de consolidação médica.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Topo - Ocultado na impressão via utilitários do Tailwind */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Relatório Consolidado</h1>
          <p className="text-sm text-slate-500 mt-1">Exportação de histórico clínico para suporte e tomadas de decisão médica.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white shadow-lg hover:bg-slate-900 transition-all"
        >
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </button>
      </div>

      {/* ÁREA DA FOLHA DO LAUDO (Formatada para Impressão) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm print:border-0 print:shadow-none print:p-0">
        
        {/* Cabeçalho do Laudo */}
        <div className="border-b-2 border-slate-900 pb-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">CUIDAMAIS • SISTEMA DE MONITORAMENTO DOMICILIAR</h2>
            <p className="text-xs text-slate-500 mt-0.5">Prontuário Multidisciplinar Eletrônico de Geriatria</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Emissão: {new Date().toLocaleDateString("pt-BR")}</p>
            <p>Período Amostral: Últimos {report.periodDays} registros</p>
          </div>
        </div>

        {/* Dados do Paciente */}
        <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Paciente</span>
            <strong className="text-slate-800 text-base">{report.patientName}</strong>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Diagnóstico Base de Monitoramento</span>
            <span className="text-slate-700">Acompanhamento Geriátrico de Rotina, Hipertensão / Controle de Glicemia</span>
          </div>
        </div>

        {/* Bloco 1: Médias Sinais Vitais */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 border-b pb-1 flex items-center gap-1.5">
            <HeartPulse className="h-4 w-4 text-blue-600" /> 1. Médias Clínicas Calculadas no Período
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><HeartPulse className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Média P.A.</span>
                <strong className="text-slate-800 text-lg">{report.metrics.avgBloodPressure} <span className="text-xs text-slate-400 font-normal">mmHg</span></strong>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Droplets className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Média Glicemia</span>
                <strong className="text-slate-800 text-lg">{report.metrics.avgGlucose} <span className="text-xs text-slate-400 font-normal">mg/dL</span></strong>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Thermometer className="h-5 w-5" /></span>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Média Temp.</span>
                <strong className="text-slate-800 text-lg">{report.metrics.avgTemperature}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 2: Mapeamento de Intercorrências */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 border-b pb-1 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-rose-600" /> 2. Sumário de Eventos Críticos e Queixas
          </h3>
          <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span>Registros de Quedas:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${report.intercurrences.falls > 0 ? "bg-rose-100 text-rose-700" : "text-slate-600"}`}>
                {report.intercurrences.falls} ocorrencia(s)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span>Episódios Confusão:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${report.intercurrences.confusion > 0 ? "bg-amber-100 text-amber-700" : "text-slate-600"}`}>
                {report.intercurrences.confusion} vez(es)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span>Edema/Inchaço de membros:</span>
              <span className="font-bold text-slate-700">
                {report.intercurrences.edema} registro(s)
              </span>
            </div>
          </div>
        </div>

        {/* Bloco 3: Últimas Evoluções Descritivas */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 border-b pb-1 flex items-center gap-1.5">
            <FileClock className="h-4 w-4 text-purple-600" /> 3. Últimas Evoluções Narrativas do Prontuário
          </h3>
          <div className="space-y-3">
            {report.recentNotes.map((note: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-500 block mb-1">Registro Clínico em {new Date(note.date).toLocaleDateString("pt-BR")}:</span>
                <p className="italic">"{note.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Espaço para Carimbo / Assinatura do Médico */}
        <div className="mt-14 pt-8 border-t border-dashed border-slate-300 text-center max-w-xs mx-auto text-xs text-slate-400 print:block">
          <div className="h-1 bg-slate-300 w-full mb-2"></div>
          <span>Assinatura / Carimbo do Profissional Médico</span>
        </div>

      </div>
    </div>
  );
}