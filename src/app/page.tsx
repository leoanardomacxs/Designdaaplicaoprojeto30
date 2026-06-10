"use client";

import {
  HeartPulse,
  Activity,
  Bell,
  FileText,
  ShieldCheck,
  Stethoscope,
  LineChart,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Quote,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link"; 

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-r from-blue-600 to-emerald-500 text-primary-foreground shadow-soft">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">CUIDA+</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#funcionalidades" className="hover:text-foreground">
            Funcionalidades
          </a>
          <a href="#medicos" className="hover:text-foreground">
            Para médicos
          </a>
          <a href="#depoimentos" className="hover:text-foreground">
            Depoimentos
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/auth"
            className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium hover:bg-accent"
          >
            Entrar
          </Link>
          <Link
            href="/auth"
            className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            Começar grátis <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-lg hover:bg-accent md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <a href="#funcionalidades" className="rounded-md px-2 py-2 hover:bg-accent">
              Funcionalidades
            </a>
            <a href="#medicos" className="rounded-md px-2 py-2 hover:bg-accent">
              Para médicos
            </a>
            <Link
              href="/auth"
              className="mt-1 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-20 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50/30" />
<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-70" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-3 py-1 text-xs font-medium text-blue-600">
              <Sparkles className="h-3 w-3" /> Plataforma healthtech para famílias
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Cuidado conectado <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                para quem você ama.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Substitua o caderno de anotações por uma plataforma visual que registra sinais vitais,
              gera relatórios médicos e avisa, com calma, quando algo merece atenção.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="inline-flex h-12 items-center rounded-lg bg-blue-600 px-6 text-base font-semibold text-white shadow-md hover:bg-blue-700"
              >
                Começar gratuitamente <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link
                href="/auth"
                className="inline-flex h-12 items-center rounded-lg border border-border bg-card px-6 text-base font-semibold hover:bg-accent"
              >
                Já tenho conta
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> LGPD compliant
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" /> 4.9/5 famílias
              </div>
            </div>
          </div>

          {/* Hero mockup */}
          <div className="relative mx-auto w-full max-w-[640px]">
            <div className="absolute -inset-8 -z-10 bg-gradient-to-tr from-blue-600/20 via-emerald-500/15 to-transparent blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Paciente · Resumo
                  </p>
                  <p className="font-display text-lg font-semibold">Últimos 7 dias</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Estável
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { l: "Pressão", v: "126/82", t: "mmHg", c: "text-blue-600" },
                  { l: "Glicemia", v: "104", t: "mg/dL", c: "text-emerald-500" },
                  { l: "Temperatura", v: "36,4", t: "°C", c: "text-cyan-500" },
                ].map((m) => (
                  <div key={m.l} className="rounded-xl border border-border/70 bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">{m.l}</p>
                    <p className={`font-display text-xl font-bold ${m.c}`}>{m.v}</p>
                    <p className="text-[10px] text-muted-foreground">{m.t}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex h-44 items-end gap-1.5 rounded-xl border border-border/70 bg-card p-4">
                {[60, 72, 55, 78, 50, 58, 48].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-blue-600 to-emerald-400"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {["S", "T", "Q", "Q", "S", "S", "D"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <p className="text-xs">
                  <span className="font-semibold">Análise:</span> sinais estáveis há 5 dias. Mantenha
                  a rotina.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-xl border border-border/70 bg-card p-3 shadow-lg sm:block">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/10 text-red-500">
                  <Bell className="h-4 w-4" />
                </span>
                <div className="text-xs">
                  <p className="font-semibold">Alerta moderado</p>
                  <p className="text-muted-foreground">Pressão acima da média</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <Section className="py-12">
        <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { v: "+180k", l: "registros diários" },
              { v: "97%", l: "satisfação familiar" },
              { v: "2 min", l: "para registrar" },
              { v: "24/7", l: "monitoramento" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-3xl font-bold text-blue-600">{s.v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="funcionalidades">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            Funcionalidades
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            Tudo que sua família precisa para cuidar melhor
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pensado para cuidadores informais e familiares. Simples no preenchimento, profissional na
            entrega.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { i: HeartPulse, t: "Registro de sinais vitais", d: "Pressão, glicemia, temperatura, humor e medicamentos em até 2 minutos." },
            { i: LineChart, t: "Gráficos inteligentes", d: "Veja tendências e médias com indicadores visuais diários de risco." },
            { i: Bell, t: "Alertas humanizados", d: "Notificações claras, sem alarmismo, com recomendações práticas." },
            { i: FileText, t: "Relatórios médicos", d: "Exporte um PDF profissional pronto para a consulta em um clique." },
            { i: Activity, t: "Histórico cronológico", d: "Filtros e revisão de qualquer dia em segundos." },
            { i: ShieldCheck, t: "Segurança e privacidade", d: "Dados criptografados e em conformidade com a LGPD." },
          ].map((f) => (
            <div
              key={f.t}
              className="group rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600/10 text-blue-600">
                <f.i className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* For doctors */}
      <Section id="medicos">
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-blue-600/5 via-card to-emerald-500/5 p-10 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-blue-600/30 bg-card px-3 py-1 text-xs font-medium text-blue-600">
                <Stethoscope className="mr-1 h-3 w-3" /> Para médicos e clínicas
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                Consultas com histórico estruturado
              </h2>
              <p className="mt-3 text-muted-foreground">
                Receba relatórios padronizados, com gráficos e observações, antes da consulta.
                Decisões clínicas mais rápidas e mais seguras.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth"
                  className="inline-flex h-11 items-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Experimentar agora
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <p className="font-display text-sm font-semibold">Relatório clínico · exemplo</p>
                <span className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium">
                  PDF
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Pressão média</span>
                  <span className="font-medium">126/82 mmHg</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Glicemia média</span>
                  <span className="font-medium">104 mg/dL</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Eventos de atenção</span>
                  <span className="font-medium">3</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Aderência med.</span>
                  <span className="font-medium text-emerald-500">96%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="depoimentos">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            Depoimentos
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            Famílias mais tranquilas, médicos mais informados
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { n: "Carla L.", r: "Cuidadora familiar", t: "Substituiu os cadernos da minha mãe. Em 2 minutos registro tudo e o médico recebe um PDF claro." },
            { n: "Dr. Henrique", r: "Geriatra", t: "Os relatórios chegam organizados, com gráficos. Ganho tempo e qualidade na consulta." },
            { n: "Júlia M.", r: "Filha cuidadora", t: "Os alertas são gentis. Não assustam e me ajudam a entender o que fazer." },
          ].map((q) => (
            <div key={q.n} className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <Quote className="h-5 w-5 text-blue-600" />
              <p className="mt-3 text-sm leading-relaxed">{q.t}</p>
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600/10 text-xs font-semibold text-blue-600">
                  {q.n[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold">{q.n}</p>
                  <p className="text-xs text-muted-foreground">{q.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-24 pt-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-600 p-10 text-center text-white shadow-lg lg:p-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Comece a cuidar com clareza hoje
          </h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Crie sua conta gratuita e registre o primeiro paciente em menos de 2 minutos.
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-white px-6 text-base font-semibold text-blue-600 hover:bg-slate-100"
          >
            Criar conta grátis <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </Section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground lg:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-blue-600" />
            <span>© {new Date().getFullYear()} CUIDA+ — Cuidado conectado.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">
              Termos
            </a>
            <a href="#" className="hover:text-foreground">
              Privacidade
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}