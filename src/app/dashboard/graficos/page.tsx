//Painel de graficos
"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, Activity, HeartPulse, Droplets, Thermometer, Users, Loader2 } from "lucide-react";

import { usePatient } from "@/context/PatientContext"; 

export default function GraficosPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  
  const [chartWidth, setChartWidth] = useState(500);

  
  const { selectedPatient } = usePatient();

  
  useEffect(() => {
    setHasMounted(true);
    
    const handleResize = () => {
      
      const width = window.innerWidth;
      if (width < 640) {
        setChartWidth(width - 48); 
      } else if (width < 1024) {
        setChartWidth(width - 80); 
      } else {
        setChartWidth(520); 
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedPatient?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    fetch(`/api/dashboard/records/stats?patientId=${selectedPatient.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar métricas dos gráficos");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setChartData(data);
        } else {
          setChartData([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar dados do gráfico:", err);
        setError("Não foi possível processar o histórico de estatísticas.");
      })
      .finally(() => setLoading(false));
  }, [selectedPatient?.id]);

  if (!selectedPatient) {
    return (
      <div className="max-w-6xl mx-auto rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-700">Nenhum idoso selecionado</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Por favor, acesse a aba <strong>"Pacientes"</strong> e selecione um prontuário para visualizar a evolução gráfica dos sinais vitais.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800">Painel de Tendências Clínicas</h1>
        <p className="text-sm text-slate-500 mt-1">
          Análise visual e monitoramento de saúde de: <strong className="text-blue-600">{selectedPatient.name}</strong>
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-semibold border bg-rose-50 text-rose-700 border-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm font-medium text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <span>Construindo curvas de tendência médica...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">Dados insuficientes</h3>
          <p className="text-sm text-slate-400 mt-1">
            Adicione evoluções na aba <strong>"Registro Diário"</strong> para gerar os gráficos de linha do paciente.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Gráfico 1: Pressão Arterial */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 mb-4 self-start flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-blue-600" /> Histórico de Pressão Arterial (mmHg)
            </h3>
            <div className="w-full flex justify-center items-center">
              {hasMounted && (
                <LineChart width={chartWidth} height={260} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="data" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Line type="monotone" dataKey="systolic" name="Sistólica (Máx)" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                  <Line type="monotone" dataKey="diastolic" name="Diastólica (Mín)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                </LineChart>
              )}
            </div>
          </div>

          {/* Gráfico 2: Glicemia Capilar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 mb-4 self-start flex items-center gap-2">
              <Droplets className="h-4 w-4 text-emerald-600" /> Curva de Glicemia (mg/dL)
            </h3>
            <div className="w-full flex justify-center items-center">
              {hasMounted && (
                <LineChart width={chartWidth} height={260} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="data" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="glucose" name="Glicemia" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} connectNulls />
                </LineChart>
              )}
            </div>
          </div>

          {/* Gráfico 3: Temperatura Corporal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 mb-4 self-start flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-amber-500" /> Monitoramento de Temperatura (°C)
            </h3>
            <div className="w-full flex justify-center items-center">
              {hasMounted && (
                <LineChart width={chartWidth} height={260} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="data" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[35, 40]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="temperature" name="Temperatura" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} connectNulls />
                </LineChart>
              )}
            </div>
          </div>

          {/* Gráfico 4: Frequência Cardíaca */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 mb-4 self-start flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-600" /> Pulsação / Frequência Cardíaca (bpm)
            </h3>
            <div className="w-full flex justify-center items-center">
              {hasMounted && (
                <LineChart width={chartWidth} height={260} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="data" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="heart_rate" name="Frequência Cardíaca" stroke="#e11d48" strokeWidth={3} dot={{ r: 5 }} connectNulls />
                </LineChart>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}