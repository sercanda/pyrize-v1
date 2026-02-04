"use client";

import { useState, useMemo } from "react";
import { CRMProvider, useCRM } from "@/contexts/CRMContext";
import { Header } from "@/components/crm/Header";
import { FilterBar } from "@/components/crm/FilterBar";
import { PipelineBoard } from "@/components/crm/PipelineBoard";
import { CreateCustomerModal } from "@/components/crm/CreateCustomerModal";
import { CustomerDetailModal } from "@/components/crm/CustomerDetailModal";
import { Customer, CustomerStage, RequestType } from "@/types/crm";

function MusterilerPageContent() {
  const { customers } = useCRM();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [defaultStage, setDefaultStage] = useState<CustomerStage | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStages, setSelectedStages] = useState<CustomerStage[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<RequestType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    customers.forEach((customer) => {
      customer.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      const matchesStage = selectedStages.length === 0 || selectedStages.includes(customer.stage);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(customer.requestType);
      const matchesTag = selectedTags.length === 0 || customer.tags.some((tag) => selectedTags.includes(tag));

      return matchesSearch && matchesStage && matchesType && matchesTag;
    });
  }, [customers, searchQuery, selectedStages, selectedTypes, selectedTags]);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleAddCustomer = (stage?: CustomerStage) => {
    setDefaultStage(stage);
    setIsCreateModalOpen(true);
  };

  const handleStageToggle = (stage: CustomerStage) => {
    setSelectedStages((prev) => (prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]));
  };

  const handleTypeToggle = (type: RequestType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleClearFilters = () => {
    setSelectedStages([]);
    setSelectedTypes([]);
    setSelectedTags([]);
  };

  // Override customers in context with filtered ones for display
  const displayCustomers = filteredCustomers;

  return (
    <div className="mx-auto w-full max-w-[95vw] px-4 pb-16 pt-8 md:px-8">
      <div className="mb-6">
        <Header
          onNewCustomer={() => handleAddCustomer()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      <div className="mb-6">
        <FilterBar
          selectedStages={selectedStages}
          selectedTypes={selectedTypes}
          selectedTags={selectedTags}
          availableTags={availableTags}
          onStageToggle={handleStageToggle}
          onTypeToggle={handleTypeToggle}
          onTagToggle={handleTagToggle}
          onClearFilters={handleClearFilters}
        />
      </div>
      <div className="h-[calc(100vh-20rem)] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <PipelineBoard
          onCustomerClick={handleCustomerClick}
          onAddCustomer={handleAddCustomer}
          filteredCustomers={filteredCustomers}
        />
      </div>
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setDefaultStage(undefined);
        }}
        defaultStage={defaultStage}
      />
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
}

export default function DashboardMusterilerPage() {
  return (
    <CRMProvider>
      <MusterilerPageContent />
    </CRMProvider>
  );
}
