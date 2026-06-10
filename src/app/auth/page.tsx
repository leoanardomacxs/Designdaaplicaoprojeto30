"use client";

import { useState, type FormEvent } from "react";
import { HeartPulse, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        
        if (!res.ok) throw new Error("Erro ao criar conta.");
        
        alert("Conta criada com sucesso! Mude para o modo 'Entrar'.");
        setMode("signin");
      } else {
        
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("E-mail ou senha incorretos.");

        
        router.push("/dashboard");
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-gradient-to-tr from-blue-600 to-emerald-600 lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:14px_24px] opacity-40" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-white">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">CUIDA+</span>
          </Link>
          <div className="max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Cuidado conectado, sem complicação.
            </h1>
            <p className="mt-4 opacity-90">
              Registre sinais vitais, acompanhe gráficos e gere relatórios médicos com poucos
              cliques. Tudo em um só lugar.
            </p>
          </div>
          <p className="text-xs opacity-75">© {new Date().getFullYear()} CUIDA+ — Cuidado conectado.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-600 text-white">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold"></span>
          </Link>Cuida+

          <h2 className="font-display text-2xl font-bold">
            {mode === "signin" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Entre para continuar acompanhando seus pacientes."
              : "Cadastre-se em segundos. É grátis."}
          </p>

          {/* Mode switch */}
          <div className="mt-6 inline-flex rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                mode === "signin"
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" ? (
              <div>
                <label className="text-sm font-medium">Nome completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Seu nome"
                />
              </div>
            ) : null}

            <div>
              <label className="text-sm font-medium">E-mail</label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="voce@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Senha</label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Entrar" : "Criar conta"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ao continuing você concorda com nossos termos e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}