"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Wallet, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await api.post("users/", { username, email, password });
      router.push("/login?registered=true");
    } catch (err: any) {
      console.error("Registration error:", err.response?.data || err.message);
      const data = err.response?.data;
      let errorMessage = "Erro ao cadastrar. Tente novamente.";

      if (data) {
        if (data.username) errorMessage = `Usuário: ${data.username[0]}`;
        else if (data.email) errorMessage = `Email: ${data.email[0]}`;
        else if (data.password) errorMessage = `Senha: ${data.password[0]}`;
        else if (data.detail) errorMessage = data.detail;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-creme flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-700">
        <div className="bg-vintage-green_dark p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
              <Wallet size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Criar Conta</h1>
            <p className="mt-3 text-vintage-green_light font-medium">
              Comece sua jornada financeira elegante
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 bg-white/5 w-40 h-40 rounded-full transform scale-150"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest px-1">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-vintage-green_mid focus:ring-4 focus:ring-vintage-green_mid/10 outline-none transition-all font-medium text-gray-800 bg-gray-50/50"
              placeholder="Escolha um usuário"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-widest px-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-vintage-green_mid focus:ring-4 focus:ring-vintage-green_mid/10 outline-none transition-all font-medium text-gray-800 bg-gray-50/50"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest px-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-vintage-green_mid focus:ring-4 focus:ring-vintage-green_mid/10 outline-none transition-all font-medium text-gray-800 bg-gray-50/50"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest px-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-vintage-green_mid focus:ring-4 focus:ring-vintage-green_mid/10 outline-none transition-all font-medium text-gray-800 bg-gray-50/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vintage-green_dark hover:bg-vintage-green_mid text-white font-black py-5 rounded-2xl shadow-xl shadow-green-900/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50"
          >
            <UserPlus
              size={24}
              className="group-hover:translate-x-1 transition-transform"
            />
            {loading ? "Cadastrando..." : "Confirmar Cadastro"}
          </button>

          <div className="text-center pt-2">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-vintage-green_dark transition-colors"
            >
              <ArrowLeft size={14} /> Já tenho uma conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
