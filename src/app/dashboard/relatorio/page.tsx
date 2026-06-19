// Geração e visualização de relatórios médicos para imprimir e mandar por email
"use client";

import React, { useEffect, useState } from "react";
import { usePatient } from "@/context/PatientContext"; 
import { FileText, Printer, HeartPulse, Droplets, Thermometer, ShieldAlert, FileClock, Loader2, UserCheck } from "lucide-react";

export default function RelatorioMedicoPage() {
  // Ajuste aqui: Pegamos o contexto como 'any' para o TypeScript não reclamar,
  // e testamos as propriedades mais prováveis que o seu contexto usa (como 'patient')
 const { selectedPatient } = usePatient();
 const patientId = selectedPatient?.id;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não houver patientId, cancela o loading e deixa o estado vazio para tratar na renderização
    if (!patientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/dashboard/records/report?patientId=${patientId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((data) => setReport(data))
      .catch((err) => console.error("Erro ao carregar relatório:", err))
      .finally(() => setLoading(false));
  }, [patientId]);

  const handleEmail = () => {
    if (!report) return;

    // Acessamos o nome do paciente diretamente do seu objeto report
    const nomePaciente = report.patientName; 
    
    const assunto = encodeURIComponent(`Relatório de Acompanhamento - ${nomePaciente} | Cuida Mais`);

    const corpo = encodeURIComponent(
`Prezado(a) colega, tudo bem?

Esperamos que este e-mail o(a) encontre bem.

Somos da Cuida Mais e, visando a continuidade e a excelência no cuidado domiciliar, compartilhamos o relatório clínico atualizado do(a) paciente ${nomePaciente}.

Este documento consolida as métricas fisiológicas, intercorrências relevantes e a evolução das observações da nossa equipe de enfermagem no período recente. Acreditamos que estes dados sejam fundamentais para a sua análise clínica e para o ajuste terapêutico, caso necessário.

Estamos à inteira disposição para discutir qualquer um dos pontos apresentados ou para fornecer detalhes adicionais sobre o prontuário.

Atenciosamente,

Equipe Cuida Mais
Suporte Clínico e Monitoramento Domiciliar`
    );

    const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${assunto}&body=${corpo}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // 1. Estado de Carregamento
  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm font-medium text-slate-500 bg-white border border-slate-100 rounded-2xl max-w-4xl mx-auto shadow-sm print:hidden">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span>Compilando dados epidemiológicos e prontuário estruturado...</span>
      </div>
    );
  }

  // 2. Estado de Erro: Contexto não possui um paciente ativo
  if (!patientId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center max-w-4xl mx-auto shadow-sm print:hidden">
        <UserCheck className="mx-auto h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-sm font-semibold text-slate-700">Nenhum paciente selecionado</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Por favor, selecione um paciente no painel lateral para visualizar o relatório.</p>
      </div>
    );
  }

  // 3. Estado de Erro: Rota retornou vazio ou sem registros
  if (!report || report.empty) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center max-w-4xl mx-auto shadow-sm print:hidden">
        <FileText className="mx-auto h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-sm font-semibold text-slate-700">Sem dados para relatório</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Insira registros diários para gerar o laudo de consolidação médica.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-0 print:absolute print:top-0 print:left-0 print:w-full print:p-0 print:m-0">
      
      {/* Topo - Menu de Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Relatório Consolidado</h1>
          <p className="text-xs text-slate-500 mt-1">Exportação de histórico clínico para suporte e tomadas de decisão médica.</p>
        </div>
        
        <div className="flex gap-2 self-start sm:self-auto">
          <button 
            type="button" 
            onClick={handleEmail}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FileText className="h-4 w-4" /> Enviar por E-mail
          </button>
          
          <button 
            onClick={handlePrint}
            className="relative z-50 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* ÁREA DA FOLHA DO LAUDO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm print:border-0 print:shadow-none print:p-0 print:m-0 print:bg-transparent">
        
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

        {/* Blocos de Dados */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-slate-400 print:hidden" /> 1. Médias Clínicas Calculadas no Período
          </h3>
          <div className="grid gap-4 grid-cols-3 print:grid-cols-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center gap-3.5 shadow-sm print:border print:shadow-none">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 print:hidden"><HeartPulse className="h-4 w-4" /></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Média P.A.</span>
                <strong className="text-slate-800 text-md font-bold tracking-tight">{report.metrics.avgBloodPressure} <span className="text-[10px] text-slate-400 font-normal">mmHg</span></strong>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center gap-3.5 shadow-sm print:border print:shadow-none">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 print:hidden"><Droplets className="h-4 w-4" /></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Média Glicemia</span>
                <strong className="text-slate-800 text-md font-bold tracking-tight">{report.metrics.avgGlucose} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span></strong>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center gap-3.5 shadow-sm print:border print:shadow-none">
              <span className="p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 print:hidden"><Thermometer className="h-4 w-4" /></span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Média Temp.</span>
                <strong className="text-slate-800 text-md font-bold tracking-tight">{report.metrics.avgTemperature} <span className="text-[10px] text-slate-400 font-normal">°C</span></strong>
              </div>
            </div>
          </div>
        </div>

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

        <div className="mt-16 pt-6 border-t border-dashed border-slate-200 text-center max-w-xs mx-auto text-[11px] text-slate-400 block">
          <div className="h-px bg-slate-300 w-full mb-3"></div>
          <span className="tracking-wide">Assinatura / Carimbo do Profissional Médico</span>
        </div>
      </div>
    </div>
  );
}