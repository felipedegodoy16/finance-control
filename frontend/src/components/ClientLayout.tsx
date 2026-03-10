"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Tag,
  CreditCard,
  DollarSign,
  Wallet,
  LogOut,
} from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {!isLoginPage && (
        <nav className="w-full md:w-20 lg:w-64 bg-vintage-green_dark text-vintage-creme flex flex-row md:flex-col items-center py-2 md:py-8 px-4 md:px-4 gap-4 md:gap-8 md:sticky md:top-0 md:h-screen z-50">
          <div className="flex md:flex-col items-center gap-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Wallet size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="text-[10px] md:text-xs font-black tracking-widest uppercase opacity-50 hidden lg:inline">
              Finance
            </span>
          </div>

          <div className="flex flex-row md:flex-col flex-1 justify-around md:justify-start w-full gap-2 md:gap-6">
            <NavItem
              href="/"
              icon={<Home size={20} className="md:w-6 md:h-6" />}
              label="Início"
            />
            <NavItem
              href="/transactions"
              icon={<DollarSign size={20} className="md:w-6 md:h-6" />}
              label="Transações"
            />
            <NavItem
              href="/categories"
              icon={<Tag size={20} className="md:w-6 md:h-6" />}
              label="Categorias"
            />
            <NavItem
              href="/payment-methods"
              icon={<CreditCard size={20} className="md:w-6 md:h-6" />}
              label="Pagamentos"
            />
          </div>

          <div className="flex md:flex-col gap-2 md:gap-4 md:pt-8 md:border-t md:border-white/5 w-auto md:w-full">
            <div className="bg-white/5 p-3 rounded-xl hidden lg:block">
              <p className="text-[10px] opacity-50">Logado como</p>
              <p className="text-xs font-bold truncate">Usuário Vintage</p>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center md:justify-start gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-red-500/20 text-red-200 transition-all w-10 h-10 md:w-full font-bold text-sm"
              title="Sair"
            >
              <LogOut size={20} />
              <span className="hidden lg:inline text-xs">Sair</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex flex-col lg:flex-row items-center gap-3 p-3 rounded-2xl transition-all w-full relative ${
        isActive
          ? "bg-white/20 text-white shadow-lg shadow-black/10"
          : "hover:bg-white/10 text-vintage-creme/70 hover:text-white"
      }`}
    >
      <span
        className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
      >
        {icon}
      </span>
      <span className="text-[10px] lg:text-sm font-bold hidden md:inline">
        {label}
      </span>
      {isActive && (
        <div className="absolute left-0 w-1.5 h-8 bg-vintage-green_light rounded-r-full hidden lg:block animate-in fade-in slide-in-from-left-2 duration-300" />
      )}
    </Link>
  );
}
