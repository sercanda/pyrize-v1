'use client';

import { TabGroup, TabList, Tab } from '@headlessui/react';

interface TabItem<T extends string> {
  key: T;
  label: string;
  icon: React.ElementType;
}

// ── Sidebar / Mobile nav tabs (CRM top-level navigation) ──────────────────────

interface CRMNavTabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  layout: 'sidebar' | 'mobile';
}

export function CRMNavTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  layout,
}: CRMNavTabsProps<T>) {
  const selectedIndex = tabs.findIndex((t) => t.key === activeTab);

  if (layout === 'sidebar') {
    return (
      <TabGroup
        selectedIndex={selectedIndex === -1 ? 0 : selectedIndex}
        onChange={(i) => onTabChange(tabs[i].key)}
      >
        <TabList className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.key}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none border border-transparent text-slate-400 hover:bg-white/5 hover:text-white data-[selected]:border-cyan-400/40 data-[selected]:bg-white/10 data-[selected]:text-white data-[selected]:shadow-[0_8px_20px_rgba(14,165,233,0.1)]"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-current data-[selected]:text-cyan-400"
                />
                {tab.label}
              </Tab>
            );
          })}
        </TabList>
      </TabGroup>
    );
  }

  // Mobile bottom bar
  return (
    <TabGroup
      selectedIndex={selectedIndex === -1 ? 0 : selectedIndex}
      onChange={(i) => onTabChange(tabs[i].key)}
    >
      <TabList className="flex w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.key}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors focus:outline-none text-slate-500 data-[selected]:text-cyan-400"
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </Tab>
          );
        })}
      </TabList>
    </TabGroup>
  );
}

// ── Horizontal scrollable tabs (slide-over nested panels) ─────────────────────

interface SlideOverTabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function SlideOverTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: SlideOverTabsProps<T>) {
  const selectedIndex = tabs.findIndex((t) => t.key === activeTab);

  return (
    <TabGroup
      selectedIndex={selectedIndex === -1 ? 0 : selectedIndex}
      onChange={(i) => onTabChange(tabs[i].key)}
    >
      <TabList className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.key}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all focus:outline-none text-slate-500 hover:bg-white/5 hover:text-slate-300 data-[selected]:bg-cyan-500/20 data-[selected]:text-cyan-300"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {tab.label}
            </Tab>
          );
        })}
      </TabList>
    </TabGroup>
  );
}
