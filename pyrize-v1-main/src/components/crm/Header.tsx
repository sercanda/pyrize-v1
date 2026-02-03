"use client";

import { Plus } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeaderProps {
  onNewCustomer: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ onNewCustomer, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Müşteri Yönetimi</h1>
        <p className="mt-1 text-xs text-slate-400">Pipeline görünümü ile müşterilerinizi takip edin</p>
      </div>
      <div className="flex items-center gap-3">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <button
          onClick={onNewCustomer}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#24d6a4] to-[#1fb894] px-4 py-2 text-sm font-semibold text-page-bg shadow-lg shadow-[#24d6a4]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#24d6a4]/30 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Yeni Müşteri
        </button>
      </div>
    </div>
  );
}

