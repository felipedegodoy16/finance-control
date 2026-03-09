"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Wallet, LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("token/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      // Set cookie for middleware
      document.cookie = `access_token=${response.data.access}; path=/; max-age=86400; SameSite=Lax`;
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      const detail =
        err.response?.data?.detail || "Credenciais inválidas. Tente novamente.";
      setError(detail);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-creme flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-700">
        <div className="bg-vintage-green_dark p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
              <Wallet size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Finance App</h1>
            <p className="mt-3 text-vintage-green_light font-medium">
              Gestão elegante para o seu patrimônio
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 bg-white/5 w-40 h-40 rounded-full transform scale-150"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest px-1">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-vintage-green_mid focus:ring-4 focus:ring-vintage-green_mid/10 outline-none transition-all font-medium text-gray-800 bg-gray-50/50"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-gray-700 uppercase tracking-widest px-1">
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

          <button
            type="submit"
            className="w-full bg-vintage-green_dark hover:bg-vintage-green_mid text-white font-black py-5 rounded-2xl shadow-xl shadow-green-900/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
          >
            <LogIn
              size={24}
              className="group-hover:translate-x-1 transition-transform"
            />
            Entrar no Sistema
          </button>

          <footer className="pt-4 text-center">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Premium Financial Experience
            </p>
          </footer>
        </form>
      </div>
    </div>
  );
}
