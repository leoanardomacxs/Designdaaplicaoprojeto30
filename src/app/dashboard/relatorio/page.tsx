"use client";

import React, { useEffect, useState } from "react";
import { FileText, Printer, HeartPulse, Droplets, Thermometer, ShieldAlert, FileClock, Loader2 } from "lucide-react";

export default function RelatorioMedicoPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/records/report')
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((data) => setReport(data))
      .catch((err) => console.error("Erro ao carregar relatório:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm font-medium text-slate-500 bg-white border border-slate-100 rounded-2xl max-w-4xl mx-auto shadow-sm print:hidden">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span>Compilando dados epidemiológicos e prontuário estruturado...</span>
      </div>
    );
  }

  if (!report || report.empty) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center max-w-4xl mx-auto shadow-sm print:hidden">
        <FileText className="mx-auto h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-sm font-semibold text-slate-700">Sem dados para relatório</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Insira registros diários para gerar o laudo de consolidation médica.</p>
      </div>
    );
  }

  return (
    // 1. ADICIONADO: 'print:absolute print:top-0 print:left-0 print:w-full print:p-0' para resetar a folha
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-0 print:absolute print:top-0 print:left-0 print:w-full print:p-0 print:m-0">
      
      {/* Topo - Menu de Ações (Ocultado 100% na impressão) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Relatório Consolidado</h1>
          <p className="text-xs text-slate-500 mt-1">Exportação de histórico clínico para suporte e tomadas de decisão médica.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="relative z-50 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </button>
      </div>

      {/* ÁREA DA FOLHA DO LAUDO */}
      {/* 2. CORRIGIDO: Classes 'print:border-0 print:shadow-none print:p-0 print:m-0' para limpar as bordas cinzas na folha */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm print:border-0 print:shadow-none print:p-0 print:m-0 print:bg-transparent">
        
        {/* Cabeçalho do Laudo */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-md font-bold tracking-wider text-slate-900 uppercase">CUIDAMAIS • MONITORAMENTO DOMICILIAR</h2>
            <p className="text-xs text-slate-400 mt-1">Prontuário Multidisciplinar Eletrônico de Geriatria</p>
          </div>
          <div className="text-left md:text-right text-xs text-slate-500 space-y-0.5 font-medium">
            <p><span className="text-slate-400 font-normal">Emissão:</span> {new Date().toLocaleDateString("pt-BR")}</p>
            <p><span className="text-slate-400 font-normal">Período Amostral:</span> Últimos {report.periodDays} registros</p>
          </div>
        </div>

        {/* Dados do Paciente */}
        <div className="mt-6 bg-slate-50 p-5 rounded-xl border border-slate-100 grid gap-4 sm:grid-cols-2 text-xs print:bg-slate-50 print:border">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Paciente</span>
            <strong className="text-slate-800 text-sm font-semibold block">{report.patientName}</strong>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Diagnóstico Base de Monitoramento</span>
            <span className="text-slate-600 block leading-relaxed">Acompanhamento Geriátrico de Rotina, Hipertensão / Controle de Glicemia</span>
          </div>
        </div>

        {/* Bloco 1: Médias Sinais Vitais */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-slate-400 print:hidden" /> 1. Médias Clínicas Calculadas no Período
          </h3>
          <div className="grid gap-4 grid-cols-3 print:grid-cols-3">
            
            {/* Pressão Arterial */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center gap-3.5 shadow-sm print:border print:shadow-none">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 print:hidden"><HeartPulse className="h-4 w-4" /></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Média P.A.</span>
                <strong className="text-slate-800 text-md font-bold tracking-tight">{report.metrics.avgBloodPressure} <span className="text-[10px] text-slate-400 font-normal">mmHg</span></strong>
              </div>
            </div>

            {/* Glicemia */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center gap-3.5 shadow-sm print:border print:shadow-none">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 print:hidden"><Droplets className="h-4 w-4" /></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Média Glicemia</span>
                <strong className="text-slate-800 text-md font-bold tracking-tight">{report.metrics.avgGlucose} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span></strong>
              </div>
            </div>

            {/* Temperatura */}
            <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center gap-3.5 shadow-sm print:border print:shadow-none">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 print:hidden"><Thermometer className="h-4 w-4" /></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Média Temp.</span>
                <strong className="text-slate-800 text-md font-bold tracking-tight">{report.metrics.avgTemperature} <span className="text-[10px] text-slate-400 font-normal">°C</span></strong>
              </div>
            </div>

          </div>
        </div>

        {/* Bloco 2: Mapeamento de Intercorrências */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-slate-400 print:hidden" /> 2. Sumário de Eventos Críticos e Queixas
          </h3>
          <div className="grid gap-3 grid-cols-3 print:grid-cols-3 text-xs text-slate-600">
            
            <div className="p-3.5 rounded-xl bg-white border border-slate-100 flex justify-between items-center shadow-sm print:border print:shadow-none">
              <span className="font-medium">Registros de Quedas</span>
              <span className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${report.intercurrences.falls > 0 ? "bg-red-50 text-red-700 border border-red-100" : "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                {report.intercurrences.falls}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-100 flex justify-between items-center shadow-sm print:border print:shadow-none">
              <span className="font-medium">Episódios Confusão</span>
              <span className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${report.intercurrences.confusion > 0 ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-slate-50 text-slate-600 border border-slate-100"}`}>
                {report.intercurrences.confusion}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-100 flex justify-between items-center shadow-sm print:border print:shadow-none">
              <span className="font-medium">Edema/Inchaço Membros</span>
              <span className="font-semibold px-2 py-0.5 rounded-md text-[11px] bg-slate-50 text-slate-600 border border-slate-100">
                {report.intercurrences.edema}
              </span>
            </div>

          </div>
        </div>

        {/* Bloco 3: Últimas Evoluções Descritivas */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileClock className="h-4 w-4 text-slate-400 print:hidden" /> 3. Últimas Evoluções Narrativas do Prontuário
          </h3>
          <div className="space-y-3">
            {report.recentNotes.map((note: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-xs text-slate-600 leading-relaxed shadow-sm print:border print:bg-white">
                <span className="font-semibold text-slate-500 block mb-1">Registro Clínico em {new Date(note.date).toLocaleDateString("pt-BR")}:</span>
                <p className="text-slate-600 font-normal">"{note.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Espaço para Carimbo / Assinatura do Médico */}
        <div className="mt-16 pt-6 border-t border-dashed border-slate-200 text-center max-w-xs mx-auto text-[11px] text-slate-400 block">
          <div className="h-px bg-slate-300 w-full mb-3"></div>
          <span className="tracking-wide">Assinatura / Carimbo do Profissional Médico</span>
        </div>

      </div>
    </div>
  );
}