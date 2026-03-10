"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Wallet,
  Banknote,
} from "lucide-react";

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );

  const fetchMethods = async () => {
    try {
      const response = await api.get("payment-methods/");
      setMethods(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleOpenEdit = (method: PaymentMethod) => {
    setName(method.name || "");
    setType(method.type || "");
    setEditingMethod(method);
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingMethod(null);
    setName("");
    setType("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMethod) {
        await api.put(`payment-methods/${editingMethod.id}/`, {
          name,
          type,
        });
      } else {
        await api.post("payment-methods/", { name, type });
      }
      handleCloseForm();
      fetchMethods();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este método de pagamento?")) {
      try {
        await api.delete(`payment-methods/${id}/`);
        fetchMethods();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getIcon = (type?: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("cartão") || t.includes("card")) return <CreditCard />;
    if (t.includes("banco") || t.includes("bank") || t.includes("conta"))
      return <Wallet />;
    return <Banknote />;
  };

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-6 md:space-y-10 min-h-screen">
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-6 md:pb-8 gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-vintage-green_dark tracking-tight flex items-center justify-center sm:justify-start gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-vintage-creme rounded-xl md:rounded-2xl shadow-sm text-vintage-green_dark">
              <CreditCard size={24} className="md:w-8 md:h-8" />
            </div>
            Pagamentos
          </h1>
          <p className="text-xs md:text-sm font-medium text-gray-500 mt-1 md:mt-2">
            Organize suas contas e cartões de forma profissional.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto bg-vintage-green_dark text-white px-5 py-3 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-vintage-green_mid transition-all shadow-xl shadow-green-900/10 font-bold hover:scale-105 text-sm md:text-base"
          >
            <Plus size={20} /> Novo Método
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-4xl border border-gray-100 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl font-black text-vintage-green_dark flex items-center gap-3">
              {editingMethod ? <Edit3 size={24} /> : <Plus size={24} />}
              {editingMethod ? "Editar Método" : "Novo Método"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={24} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
          >
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Nome do Método
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-vintage-green_mid/20 outline-none font-medium h-12 text-sm"
                placeholder="Ex: Nubank, Dinheiro, ITAU..."
                required
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Tipo & Ação
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-vintage-green_mid/20 outline-none bg-white font-medium h-12 text-sm"
                  placeholder="Ex: Cartão, Pix..."
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 bg-vintage-green_dark text-white rounded-xl hover:bg-vintage-green_mid transition-colors flex items-center justify-center gap-2 font-black shadow-lg shadow-green-900/10 h-12 text-sm"
                  >
                    <Check size={18} /> {editingMethod ? "Salvar" : "Criar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-bold h-12 sm:hidden"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all lg:hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-5">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-vintage-creme rounded-2xl md:rounded-3xl flex items-center justify-center text-vintage-green_dark shadow-inner group-hover:scale-110 transition-transform duration-500">
                {getIcon(method.type)}
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-lg md:text-xl text-gray-800">
                  {method.name}
                </h3>
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                  {method.type
                    ? method.type.replace("_", " ")
                    : "Personalizado"}
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleOpenEdit(method)}
                className="p-2 md:p-2.5 hover:bg-gray-100 rounded-lg md:rounded-xl text-gray-400 hover:text-vintage-green_mid transition-colors"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => handleDelete(method.id)}
                className="p-2 md:p-2.5 hover:bg-red-50 rounded-lg md:rounded-xl text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {methods.length === 0 && !isAdding && (
        <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-vintage-green_light/20">
          <CreditCard
            className="mx-auto text-vintage-green_light opacity-20"
            size={64}
          />
          <p className="mt-6 text-gray-400 font-medium text-lg">
            Nenhum método de pagamento cadastrado. <br />
            <span className="text-sm opacity-70">
              Cadastre seus meios de pagamento para um controle preciso.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
