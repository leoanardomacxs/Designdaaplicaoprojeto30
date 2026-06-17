//Layout Principal do painel de controle, barra lateral também
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardPlus, 
  History, 
  LineChart, 
  AlertTriangle, 
  FileText, 
  Users, 
  HeartPulse, 
  LogOut,
  UserCheck 
} from "lucide-react";
import { PatientProvider, usePatient } from "@/context/PatientContext"; 


function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedPatient } = usePatient(); 

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Registro Diário", href: "/dashboard/registro", icon: ClipboardPlus },
    { name: "Histórico", href: "/dashboard/historico", icon: History },
    { name: "Gráficos", href: "/dashboard/graficos", icon: LineChart },
    { name: "Alertas", href: "/dashboard/alertas", icon: AlertTriangle },
    { name: "Relatório Médico", href: "/dashboard/relatorio", icon: FileText },
    { name: "Pacientes", href: "/dashboard/pacientes", icon: Users },
  ];

  async function handleLogout() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/auth");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 print:bg-white print:text-black">
      
      {/* Sidebar Fixa Lateral - Ocultada 100% durante a impressão */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200 bg-white print:hidden">
        {/* Header da Sidebar */}
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-base font-bold block leading-none">CUIDA+</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">HealthTech</span>
          </div>
        </div>

        {/* Feedback do paciente atualmente selecionado */}
        {selectedPatient && (
          <div className="mx-4 mt-4 flex items-center gap-3 rounded-xl bg-blue-50 p-3 text-blue-900 border border-blue-100">
            <UserCheck className="h-5 w-5 text-blue-600 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Monitorando:</p>
              <p className="text-sm font-bold truncate leading-tight">{selectedPatient.name}</p>
            </div>
          </div>
        )}

        {/* Links de Navegação */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer com Perfil do Cuidador e Logout */}
        <div className="border-t border-slate-100 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
              CD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate leading-none mb-1">Cuidador Logado</p>
              <p className="text-xs text-slate-400 truncate">Acesso Administrative</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* Área do Conteúdo Principal à direita da Sidebar */}
      {/* Alterado: 'print:pl-0' remove o espaçamento do menu na folha física */}
      <main className="flex-1 pl-64 print:pl-0">
        {/* Alterado: 'print:p-0' e 'print:overflow-visible' limpam margens e evitam cortes no PDF */}
        <div className="min-h-screen p-6 md:p-10 print:p-0 print:min-h-0 print:overflow-visible">
          {children}
        </div>
      </main>
    </div>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PatientProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PatientProvider>
  );
}