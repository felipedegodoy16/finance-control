"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowRight,
  PieChart,
  Calendar,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
}

interface Transaction {
  id: number;
  amount: string;
  date: string;
  description: string;
  type: "INCOME" | "EXPENSE";
  category_name: string;
  payment_method_name: string;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary>({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );

  const fetchDashboardData = async () => {
    try {
      const [sRes, tRes] = await Promise.all([
        api.get("/dashboard/summary/"),
        api.get("/transactions/"),
      ]);

      setSummary(sRes.data);
      setRecentTransactions(tRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 min-height-screen">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-vintage-green_dark tracking-tight">
          Painel Financeiro
        </h1>
        <p className="text-gray-500 font-medium flex items-center gap-2">
          <Calendar size={18} className="text-vintage-green_mid" />
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-vintage-creme rounded-2xl flex items-center justify-center text-vintage-green_dark shadow-sm group-hover:scale-110 transition-transform">
            <DollarSign size={32} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Saldo Geral
            </p>
            <h2
              className={`text-3xl font-black ${summary.balance >= 0 ? "text-vintage-green_dark" : "text-red-600"}`}
            >
              R${" "}
              {summary.balance.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Receitas
            </p>
            <h2 className="text-3xl font-black text-green-700">
              R${" "}
              {summary.total_income.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
            <TrendingDown size={32} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Despesas
            </p>
            <h2 className="text-3xl font-black text-red-600">
              R${" "}
              {summary.total_expense.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-vintage-green_dark flex items-center gap-3">
              <LayoutDashboard size={26} />
              Atalhos & Atividades
            </h2>
            <Link
              href="/transactions"
              className="px-4 py-2 bg-vintage-creme text-vintage-green_dark text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-vintage-green_light/20 transition-colors"
            >
              Extrato Completo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t, idx) => (
                <div
                  key={t.id}
                  className={`p-7 flex items-center justify-between hover:bg-gray-50/50 transition-colors ${idx !== recentTransactions.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`p-4 rounded-2xl ${t.type === "INCOME" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                    >
                      {t.type === "INCOME" ? (
                        <TrendingUp size={22} />
                      ) : (
                        <TrendingDown size={22} />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-lg">
                        {t.description || t.category_name}
                      </p>
                      <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Calendar size={14} /> {t.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-black ${t.type === "INCOME" ? "text-green-700" : "text-red-600"}`}
                    >
                      {t.type === "INCOME" ? "+" : "-"} R${" "}
                      {parseFloat(t.amount).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-tighter">
                      {t.category_name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-vintage-creme rounded-full flex items-center justify-center mx-auto text-vintage-green_light/50">
                  <PieChart size={40} />
                </div>
                <p className="text-gray-400 font-medium">
                  Nenhuma transação registrada ainda.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-vintage-green_dark flex items-center gap-3 px-2">
            <Plus size={26} /> Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 gap-5">
            <Link
              href="/transactions"
              className="p-10 bg-vintage-green_dark text-white rounded-[3rem] hover:bg-vintage-green_mid transition-all shadow-2xl shadow-green-950/40 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                  <Plus
                    size={42}
                    className="group-hover:rotate-90 transition-transform duration-500"
                  />
                </div>
                <p className="text-2xl font-black tracking-tight">
                  Nova Transação
                </p>
                <p className="text-vintage-green_light font-bold mt-2 opacity-90">
                  Registre seus gastos ou ganhos agora
                </p>
              </div>
              <div className="absolute -right-6 -bottom-6 bg-white/5 w-40 h-40 rounded-full transform scale-150 group-hover:scale-125 transition-transform duration-700"></div>
            </Link>

            <Link
              href="/categories"
              className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-vintage-green_mid hover:shadow-lg transition-all group"
            >
              <LayoutDashboard
                size={40}
                className="text-vintage-green_mid mb-4 group-hover:scale-110 transition-transform"
              />
              <p className="text-xl font-black text-gray-800">
                Minhas Categorias
              </p>
              <p className="text-sm text-gray-400 font-medium mt-1">
                Personalize seu controle financeiro
              </p>
            </Link>

            <Link
              href="/payment-methods"
              className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-vintage-green_mid hover:shadow-lg transition-all group"
            >
              <DollarSign
                size={40}
                className="text-vintage-green_mid mb-4 group-hover:scale-110 transition-transform"
              />
              <p className="text-xl font-black text-gray-800">
                Métodos de Pagamento
              </p>
              <p className="text-sm text-gray-400 font-medium mt-1">
                Gerencie suas contas e cartões
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
