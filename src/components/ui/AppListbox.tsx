'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

interface AppListboxOption<T> {
  value: T;
  label: string;
}

interface AppListboxProps<T extends string> {
  value: T | '';
  onChange: (value: T) => void;
  options: AppListboxOption<T>[];
  placeholder?: string;
  label?: string;
}

export function AppListbox<T extends string>({
  value,
  onChange,
  options,
  placeholder = 'Seçiniz',
  label,
}: AppListboxProps<T>) {
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          {label}
        </label>
      )}
      <Listbox value={value as T} onChange={onChange}>
        <ListboxButton className="relative w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-left text-sm text-white transition-all focus:outline-none data-[open]:border-cyan-500/30 data-[open]:ring-2 data-[open]:ring-cyan-500/20">
          <span className={selected ? 'text-white' : 'text-white/30'}>
            {selected ? selected.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </span>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          className="z-[9999] mt-1 w-[var(--button-width)] overflow-auto rounded-xl border border-white/[0.08] bg-[#0d1631] py-1 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl focus:outline-none"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="relative cursor-pointer select-none px-4 py-2.5 text-sm text-slate-300 transition-colors data-[focus]:bg-white/[0.08] data-[focus]:text-white data-[selected]:text-cyan-400"
            >
              {option.label}
              {option.value === value && (
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <Check className="h-4 w-4 text-cyan-400" />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
