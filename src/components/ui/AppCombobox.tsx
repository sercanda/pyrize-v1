"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

interface AppComboboxOption {
  value: string;
  label: string;
}

interface AppComboboxProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: AppComboboxOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AppCombobox<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Seçin...",
  disabled = false,
  className = "",
}: AppComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value) || null;

  const filtered =
    query === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox
      value={value}
      onChange={(val) => {
        if (val !== null) onChange(val as T);
      }}
      onClose={() => setQuery("")}
      disabled={disabled}
    >
      <div className={`relative ${className}`}>
        <ComboboxInput
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 pr-10 text-sm text-white placeholder-white/20 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20 disabled:opacity-50"
          displayValue={() => selected?.label || ""}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </ComboboxButton>

        <ComboboxOptions
          anchor="bottom start"
          transition
          className="z-[999] w-[var(--input-width)] max-h-60 overflow-auto rounded-xl border border-white/10 bg-[#0a1128]/95 backdrop-blur-xl p-1 text-sm shadow-[0_25px_60px_rgba(0,0,0,0.5)] transition duration-100 ease-out [--anchor-gap:4px] empty:invisible data-closed:scale-95 data-closed:opacity-0"
        >
          {filtered.length === 0 && query !== "" ? (
            <div className="px-3 py-2 text-xs text-slate-500">
              Sonuç bulunamadı
            </div>
          ) : (
            filtered.map((option) => (
              <ComboboxOption
                key={option.value}
                value={option.value}
                className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-slate-200 select-none data-focus:bg-white/10"
              >
                <Check className="invisible h-4 w-4 text-[#DBE64C] group-data-selected:visible" />
                <span className="text-sm">{option.label}</span>
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
