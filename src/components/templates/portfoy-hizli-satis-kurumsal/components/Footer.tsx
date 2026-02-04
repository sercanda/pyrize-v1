import React from 'react';
import { Consultant } from '../types';

interface FooterProps {
    consultant: Consultant;
}

export const Footer: React.FC<FooterProps> = ({ consultant }) => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-10 text-center">
        <div className="mb-4">
            <h3 className="text-2xl font-bold">{consultant.ofisAdi}</h3>
            <p className="text-slate-400">Stratejik Gayrimenkul Çözümleri</p>
        </div>
        <div className="border-t border-slate-700 pt-6 mt-6">
            <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} {consultant.ofisAdi}. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-slate-500 mt-4">
                Powered by <a href="#" className="font-semibold text-slate-400 hover:text-white transition-colors">PYRIZE</a>
            </p>
        </div>
      </div>
    </footer>
  );
};