"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Edit3,
  X,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  type: string;
}
interface PaymentMethod {
  id: number;
  name: string;
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [methodId, setMethodId] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const fetchData = async () => {
    try {
      const [tRes, cRes, mRes] = await Promise.all([
        api.get("transactions/"),
        api.get("categories/"),
        api.get("payment-methods/"),
      ]);
      setTransactions(tRes.data);
      setCategories(cRes.data);
      setMethods(mRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEdit = (t: Transaction) => {
    setAmount(t.amount);
    setDate(t.date);
    setDescription(t.description || "");
    setType(t.type);
    // Find category ID from name
    const cat = categories.find((c) => c.name === t.category_name);
    if (cat) setCategoryId(cat.id.toString());
    // Find method ID from name
    const method = methods.find((m) => m.name === t.payment_method_name);
    if (method) setMethodId(method.id.toString());

    setEditingTransaction(t);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        amount,
        date,
        description,
        type,
        category: categoryId,
        payment_method: methodId,
      };

      if (editingTransaction) {
        await api.put(`transactions/${editingTransaction.id}/`, payload);
      } else {
        await api.post("transactions/", payload);
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao processar transação: " + (JSON.stringify(err.response?.data) || err.message));
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategoryId("");
    setMethodId("");
    setEditingTransaction(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Excluir transação?")) {
      try {
        await api.delete(`transactions/${id}/`);
        fetchData();
      } catch (err: any) {
        console.error(err);
        alert("Erro ao excluir transação: " + (JSON.stringify(err.response?.data) || err.message));
      }
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-6 md:space-y-10 min-h-screen">
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-6 md:pb-8 gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-vintage-green_dark tracking-tight flex items-center justify-center sm:justify-start gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-vintage-creme rounded-xl md:rounded-2xl shadow-sm text-vintage-green_dark">
              <DollarSign size={24} className="md:w-8 md:h-8" />
            </div>
            Transações
          </h1>
          <p className="text-xs md:text-sm font-medium text-gray-500 mt-1 md:mt-2">
            Acompanhe sua evolução financeira detalhadamente.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto bg-vintage-green_dark text-white px-5 py-3 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-vintage-green_mid transition-all shadow-xl shadow-green-900/10 font-bold hover:scale-105 text-sm md:text-base"
          >
            <Plus size={20} /> Nova Transação
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-4xl border border-gray-100 shadow-2xl animate-in slide-in-from-top duration-700">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-vintage-green_dark flex items-center gap-3">
              {editingTransaction ? (
                <Edit3 size={24} className="md:w-8 md:h-8" />
              ) : (
                <Plus size={24} className="md:w-8 md:h-8" />
              )}
              {editingTransaction ? "Editar Lançamento" : "Nova Transação"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={24} className="md:w-8 md:h-8" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-vintage-green_mid font-black text-lg md:text-xl">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none text-xl md:text-2xl font-black text-gray-800 h-14 md:h-16"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none font-bold text-gray-700 h-14 md:h-16 text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Tipo de Fluxo
                </label>
                <div className="flex bg-gray-50 p-1.5 rounded-xl md:rounded-2xl h-14 md:h-16">
                  <button
                    type="button"
                    onClick={() => setType("EXPENSE")}
                    className={`flex-1 rounded-lg md:rounded-xl text-xs font-black transition-all ${type === "EXPENSE" ? "bg-white text-red-600 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("INCOME")}
                    className={`flex-1 rounded-lg md:rounded-xl text-xs font-black transition-all ${type === "INCOME" ? "bg-white text-green-700 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Receita
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Categoria
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none bg-white font-bold text-gray-700 h-14 md:h-16 text-sm"
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories
                    .filter((c) => c.type === type)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Meio de Pagamento
                </label>
                <select
                  value={methodId}
                  onChange={(e) => setMethodId(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none bg-white font-bold text-gray-700 h-14 md:h-16 text-sm"
                  required
                >
                  <option value="">Onde foi pago/recebido?</option>
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Descrição ou Observações
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none h-24 md:h-28 font-medium text-gray-700 text-sm"
                placeholder="Ex: Aluguel do mês, Supermercado..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
              <button
                type="submit"
                className="flex-1 bg-vintage-green_dark text-white font-black py-4 md:py-5 rounded-xl md:rounded-4xl hover:bg-vintage-green_mid transition-all shadow-xl shadow-green-900/10 text-base md:text-lg flex items-center justify-center gap-2 active:scale-95 order-1 sm:order-2"
              >
                <Check size={20} className="md:w-6 md:h-6" />{" "}
                {editingTransaction ? "Salvar" : "Confirmar"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-500 font-black py-4 md:py-5 rounded-xl md:rounded-4xl hover:bg-gray-200 transition-all text-base md:text-lg order-2 sm:order-1"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {transactions.length > 0
          ? transactions.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 md:p-7 rounded-[1.5rem] md:rounded-4xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                  <div
                    className={`p-3 md:p-5 rounded-xl md:rounded-2xl ${t.type === "INCOME" ? "bg-green-50 text-green-600 shadow-sm shadow-green-900/5" : "bg-red-50 text-red-600 shadow-sm shadow-red-900/5"}`}
                  >
                    {t.type === "INCOME" ? (
                      <ArrowDownLeft size={20} className="md:w-7 md:h-7" />
                    ) : (
                      <ArrowUpRight size={20} className="md:w-7 md:h-7" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-base md:text-xl text-gray-800">
                      {t.description || t.category_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-sm font-bold text-gray-400 mt-1">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
                        <Calendar
                          size={12}
                          className="text-vintage-green_mid md:w-3.5 md:h-3.5"
                        />{" "}
                        {t.date}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
                        <FileText
                          size={12}
                          className="text-vintage-green_mid md:w-3.5 md:h-3.5"
                        />{" "}
                        {t.payment_method_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  <div className="text-right">
                    <p
                      className={`text-lg md:text-2xl font-black ${t.type === "INCOME" ? "text-green-700" : "text-red-600"}`}
                    >
                      {t.type === "INCOME" ? "+" : "-"} R${" "}
                      {parseFloat(t.amount).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-2 md:p-3 hover:bg-gray-100 rounded-lg md:rounded-xl text-gray-300 hover:text-vintage-green_mid transition-colors"
                    >
                      <Edit3 size={18} className="md:w-5 md:h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 md:p-3 hover:bg-red-50 rounded-lg md:rounded-xl text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          : !isAdding && (
              <div className="text-center py-32 bg-white/50 rounded-[3rem] border-2 border-dashed border-vintage-green_light/20">
                <div className="w-24 h-24 bg-vintage-creme rounded-full flex items-center justify-center mx-auto text-vintage-green_light/30 mb-6">
                  <DollarSign size={48} />
                </div>
                <p className="text-gray-400 font-bold text-xl">
                  Nenhuma transação encontrada.
                </p>
                <p className="text-gray-400 font-medium mt-2">
                  Comece a organizar suas finanças registrando seu primeiro
                  lançamento.
                </p>
              </div>
            )}
      </div>
    </div>
  );
}
