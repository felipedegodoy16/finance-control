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
        api.get("dashboard/summary/"),
        api.get("transactions/"),
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
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-6 md:space-y-10 min-height-screen">
      <header className="space-y-1 md:space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-vintage-green_dark tracking-tight">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {/* Balance Card */}
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6 group hover:shadow-md transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-vintage-creme rounded-xl md:rounded-2xl flex items-center justify-center text-vintage-green_dark shadow-sm group-hover:scale-110 transition-transform">
            <DollarSign size={24} className="md:w-8 md:h-8" />
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
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6 group hover:shadow-md transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 rounded-xl md:rounded-2xl flex items-center justify-center text-green-600 shadow-sm group-hover:scale-110 transition-transform">
            <TrendingUp size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">
              Receitas
            </p>
            <h2 className="text-xl md:text-3xl font-black text-green-700">
              R${" "}
              {summary.total_income.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6 group hover:shadow-md transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-xl md:rounded-2xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
            <TrendingDown size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400">
              Despesas
            </p>
            <h2 className="text-xl md:text-3xl font-black text-red-600">
              R${" "}
              {summary.total_expense.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <h2 className="text-xl md:text-2xl font-bold text-vintage-green_dark flex items-center gap-3">
              <LayoutDashboard size={24} className="md:w-6 md:h-6" />
              Atividades
            </h2>
            <Link
              href="/transactions"
              className="px-4 py-2 bg-white text-vintage-green_dark text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-vintage-creme border border-gray-100 transition-colors"
            >
              Extrato Completo <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t, idx) => (
                <div
                  key={t.id}
                  className={`p-4 md:p-7 flex items-center justify-between hover:bg-gray-50/50 transition-colors ${idx !== recentTransactions.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div
                      className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${t.type === "INCOME" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                    >
                      {t.type === "INCOME" ? (
                        <TrendingUp size={18} className="md:w-6 md:h-6" />
                      ) : (
                        <TrendingDown size={18} className="md:w-6 md:h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm md:text-lg truncate max-w-[120px] sm:max-w-none">
                        {t.description || t.category_name}
                      </p>
                      <p className="text-[10px] md:text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Calendar size={12} className="md:w-3.5 md:h-3.5" />{" "}
                        {t.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm md:text-xl font-black ${t.type === "INCOME" ? "text-green-700" : "text-red-600"}`}
                    >
                      {t.type === "INCOME" ? "+" : "-"} R${" "}
                      {parseFloat(t.amount).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-[8px] md:text-xs font-bold text-gray-300 uppercase tracking-tighter">
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

        <div className="space-y-4 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-bold text-vintage-green_dark flex items-center gap-3 px-2">
            <Plus size={24} className="md:w-6 md:h-6" /> Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5">
            <Link
              href="/transactions"
              className="p-6 md:p-10 bg-vintage-green_dark text-white rounded-[2rem] md:rounded-[3rem] hover:bg-vintage-green_mid transition-all shadow-xl shadow-green-900/20 group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                  <Plus
                    size={32}
                    className="md:w-10 md:h-10 group-hover:rotate-90 transition-transform duration-500"
                  />
                </div>
                <p className="text-xl md:text-2xl font-black tracking-tight">
                  Nova Transação
                </p>
                <p className="text-xs md:text-sm text-vintage-green_light font-bold mt-1 md:mt-2 opacity-90">
                  Registre seus gastos agora
                </p>
              </div>
            </Link>

            <Link
              href="/categories"
              className="p-6 md:p-8 bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] hover:border-vintage-green_mid hover:shadow-lg transition-all group"
            >
              <LayoutDashboard
                size={32}
                className="md:w-10 md:h-10 text-vintage-green_mid mb-3 md:mb-4 group-hover:scale-110 transition-transform"
              />
              <p className="text-lg md:text-xl font-black text-gray-800">
                Categorias
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Personalize seu controle
              </p>
            </Link>

            <Link
              href="/payment-methods"
              className="p-6 md:p-8 bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] hover:border-vintage-green_mid hover:shadow-lg transition-all group"
            >
              <DollarSign
                size={32}
                className="md:w-10 md:h-10 text-vintage-green_mid mb-3 md:mb-4 group-hover:scale-110 transition-transform"
              />
              <p className="text-lg md:text-xl font-black text-gray-800">
                Pagamentos
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Contas e cartões
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
