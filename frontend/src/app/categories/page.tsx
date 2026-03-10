"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Tag, Plus, Trash2, Edit3, X, Check } from "lucide-react";

interface Category {
  id: number;
  name: string;
  color: string;
  type: "INCOME" | "EXPENSE";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2D5A27");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenEdit = (cat: Category) => {
    setName(cat.name);
    setColor(cat.color);
    setType(cat.type);
    setEditingCategory(cat);
    setIsAdding(true);
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingCategory(null);
    setName("");
    setColor("#2D5A27");
    setType("EXPENSE");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`categories/${editingCategory.id}/`, {
          name,
          color,
          type,
        });
      } else {
        await api.post("categories/", { name, color, type });
      }
      handleCloseForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir esta categoria?")) {
      try {
        await api.delete(`categories/${id}/`);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-6 md:space-y-10 min-h-screen">
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 pb-6 md:pb-8 gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-vintage-green_dark tracking-tight flex items-center justify-center sm:justify-start gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-vintage-creme rounded-xl md:rounded-2xl shadow-sm text-vintage-green_dark">
              <Tag size={24} className="md:w-8 md:h-8" />
            </div>
            Categorias
          </h1>
          <p className="text-xs md:text-sm font-medium text-gray-500 mt-1 md:mt-2">
            Organize suas entradas e saídas com inteligência.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto bg-vintage-green_dark text-white px-5 py-3 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-vintage-green_mid transition-all shadow-xl shadow-green-900/10 font-bold hover:scale-105 text-sm md:text-base"
          >
            <Plus size={20} /> Nova Categoria
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl font-black text-vintage-green_dark flex items-center gap-3">
              {editingCategory ? <Edit3 size={24} /> : <Plus size={24} />}
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
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
            className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
          >
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Nome da Categoria
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-vintage-green_mid/20 outline-none font-medium h-12 text-sm"
                placeholder="Ex: Alimentação, Lazer..."
                required
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "INCOME" | "EXPENSE")
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-vintage-green_mid/20 outline-none bg-white font-medium h-12 text-sm"
              >
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Cor & Finalização
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-12 w-full sm:w-16 rounded-xl border border-gray-200 p-1 cursor-pointer bg-white"
                />
                <div className="flex gap-2 flex-1">
                  <button
                    type="submit"
                    className="flex-1 bg-vintage-green_dark text-white rounded-xl hover:bg-vintage-green_mid transition-colors flex items-center justify-center gap-2 font-black shadow-lg shadow-green-900/10 text-sm h-12"
                  >
                    <Check size={18} /> {editingCategory ? "Salvar" : "Criar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm h-12 sm:hidden"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-4xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group lg:hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 md:gap-5">
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20"
                style={{ backgroundColor: cat.color }}
              >
                <Tag size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="font-black text-base md:text-lg text-gray-800">
                  {cat.name}
                </h3>
                <span
                  className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-full ${cat.type === "INCOME" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {cat.type === "INCOME" ? "Receita" : "Despesa"}
                </span>
              </div>
            </div>
            <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-2 md:p-2.5 hover:bg-gray-100 rounded-lg md:rounded-xl text-gray-400 hover:text-vintage-green_mid transition-colors"
              >
                <Edit3 size={18} className="md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 md:p-2.5 hover:bg-red-50 rounded-lg md:rounded-xl text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !isAdding && (
        <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-vintage-green_light/20">
          <Tag
            className="mx-auto text-vintage-green_light opacity-20"
            size={64}
          />
          <p className="mt-6 text-gray-400 font-medium text-lg">
            Nenhuma categoria encontrada. <br />
            <span className="text-sm opacity-70">
              Comece criando sua primeira categoria personalizada.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
