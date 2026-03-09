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
        api.get("/transactions/"),
        api.get("/categories/"),
        api.get("/payment-methods/"),
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
        await api.put(`/transactions/${editingTransaction.id}/`, payload);
      } else {
        await api.post("/transactions/", payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
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
        await api.delete(`/transactions/${id}/`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-vintage-green_dark tracking-tight flex items-center gap-4">
            <div className="p-3 bg-vintage-creme rounded-2xl shadow-sm text-vintage-green_dark">
              <DollarSign size={32} />
            </div>
            Transações
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Acompanhe sua evolução financeira detalhadamente.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-vintage-green_dark text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-vintage-green_mid transition-all shadow-xl shadow-green-900/10 font-bold hover:scale-105"
          >
            <Plus size={22} /> Nova Transação
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white p-10 rounded-4xl border border-gray-100 shadow-2xl animate-in slide-in-from-top duration-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-vintage-green_dark flex items-center gap-3">
              {editingTransaction ? <Edit3 size={32} /> : <Plus size={32} />}
              {editingTransaction ? "Editar Lançamento" : "Nova Transação"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={32} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-vintage-green_mid font-black text-xl">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none text-2xl font-black text-gray-800 h-16"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Data
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none font-bold text-gray-700 h-16"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Tipo de Fluxo
                </label>
                <div className="flex bg-gray-50 p-1.5 rounded-2xl h-16">
                  <button
                    type="button"
                    onClick={() => setType("EXPENSE")}
                    className={`flex-1 rounded-xl text-sm font-black transition-all ${type === "EXPENSE" ? "bg-white text-red-600 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("INCOME")}
                    className={`flex-1 rounded-xl text-sm font-black transition-all ${type === "INCOME" ? "bg-white text-green-700 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    Receita
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Categoria
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none bg-white font-bold text-gray-700 h-16"
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
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Meio de Pagamento
                </label>
                <select
                  value={methodId}
                  onChange={(e) => setMethodId(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none bg-white font-bold text-gray-700 h-16"
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
              <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                Descrição ou Observações
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-vintage-green_mid/10 outline-none h-28 font-medium text-gray-700"
                placeholder="Ex: Aluguel do mês, Supermercado..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-2 bg-vintage-green_dark text-white font-black py-5 rounded-4xl hover:bg-vintage-green_mid transition-all shadow-2xl shadow-green-900/20 text-lg flex items-center justify-center gap-3 active:scale-95"
              >
                <Check size={24} />{" "}
                {editingTransaction
                  ? "Salvar Alterações"
                  : "Confirmar Lançamento"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-500 font-black py-5 rounded-4xl hover:bg-gray-200 transition-all text-lg"
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
                className="bg-white p-7 rounded-4xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`p-5 rounded-2xl ${t.type === "INCOME" ? "bg-green-50 text-green-600 shadow-sm shadow-green-900/5" : "bg-red-50 text-red-600 shadow-sm shadow-red-900/5"}`}
                  >
                    {t.type === "INCOME" ? (
                      <ArrowDownLeft size={28} />
                    ) : (
                      <ArrowUpRight size={28} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-800">
                      {t.description || t.category_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mt-1">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <Calendar
                          size={14}
                          className="text-vintage-green_mid"
                        />{" "}
                        {t.date}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
                        <FileText
                          size={14}
                          className="text-vintage-green_mid"
                        />{" "}
                        {t.payment_method_name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-vintage-creme text-vintage-green_dark text-[10px] font-black uppercase tracking-widest">
                        {t.type === "INCOME" ? "Receita" : "Despesa"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p
                      className={`text-2xl font-black ${t.type === "INCOME" ? "text-green-700" : "text-red-600"}`}
                    >
                      {t.type === "INCOME" ? "+" : "-"} R${" "}
                      {parseFloat(t.amount).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-3 hover:bg-gray-100 rounded-xl text-gray-300 hover:text-vintage-green_mid transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-3 hover:bg-red-50 rounded-xl text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
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
