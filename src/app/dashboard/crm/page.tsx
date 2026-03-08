"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CRMLayout, CRMDashboard, CustomersTab, PropertiesTab, DealsTab, ActivitiesTab } from "@/components/crm-v2";
import type { CRMTab } from "@/components/crm-v2";

function CRMPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as CRMTab) || "dashboard";
  const [activeTab, setActiveTab] = useState<CRMTab>(initialTab);

  const handleTabChange = (tab: CRMTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/dashboard/crm?${params.toString()}`, { scroll: false });
  };

  return (
    <CRMLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === "dashboard" && <CRMDashboard onNavigate={handleTabChange} />}
      {activeTab === "musteriler" && <CustomersTab />}
      {activeTab === "mulkler" && <PropertiesTab />}
      {activeTab === "firsatlar" && <DealsTab />}
      {activeTab === "aktiviteler" && <ActivitiesTab />}
    </CRMLayout>
  );
}

export default function CRMPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="text-slate-400">Yükleniyor...</div>
      </div>
    }>
      <CRMPageContent />
    </Suspense>
  );
}
