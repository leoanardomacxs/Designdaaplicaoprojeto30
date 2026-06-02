"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, HeartPulse, History, LineChart, BellRing, 
  FileText, Users, Shield, LogOut, Menu, Sun, Moon 
} from "lucide-react";

import { useAuth } from "../hooks/use-auth"; 
// NOTA: Remova ou comente o import do useActivePatient até adaptá-lo para o Prisma

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/registro", label: "Registro diário", icon: HeartPulse },
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/graficos", label: "Gráficos", icon: LineChart },
  { href: "/alertas", label: "Alertas", icon: BellRing },
  { href: "/relatorio", label: "Relatório médico", icon: FileText },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/admin", label: "Admin", icon: Shield },
] as const;

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-soft">
        <HeartPulse className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-base font-bold">Projeto 30</p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Healthtech</p>
      </div>
    </Link>
  );
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground hover:bg-accent"
            }`}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  title,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  async function handleLogout() {
    // Como você usa Prisma, o logout aqui deve limpar o estado do seu useAuth
    // ou simplesmente redirecionar o usuário para a página inicial
    router.push("/");
  }

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-border bg-card p-5 lg:flex">
        <div className="px-1 pb-6">
          <Brand />
        </div>
        <NavList pathname={pathname} />
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl border border-border p-3 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <button
              onClick={() => setOpenMobile(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-accent">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="px-4 pb-5 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}