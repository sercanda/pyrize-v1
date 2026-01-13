"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Customer, CustomerStage, STAGES } from "@/types/crm";
import { StageColumn } from "./StageColumn";
import { CustomerCard } from "./CustomerCard";
import { useCRM } from "@/contexts/CRMContext";
import { useState } from "react";

interface PipelineBoardProps {
  onCustomerClick: (customer: Customer) => void;
  onAddCustomer: (stage?: CustomerStage) => void;
  filteredCustomers?: Customer[];
}

export function PipelineBoard({ onCustomerClick, onAddCustomer, filteredCustomers }: PipelineBoardProps) {
  const { customers: allCustomers, moveCustomer } = useCRM();
  const customers = filteredCustomers || allCustomers;
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const customersByStage = STAGES.reduce(
    (acc, stage) => {
      acc[stage.key] = customers.filter((customer) => customer.stage === stage.key);
      return acc;
    },
    {} as Record<CustomerStage, Customer[]>
  );

  const handleDragStart = (event: DragStartEvent) => {
    const customer = customers.find((c) => c.id === event.active.id);
    if (customer) setActiveCustomer(customer);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCustomer(null);

    if (!over) return;

    const customerId = active.id as string;
    const newStage = over.id as CustomerStage;

    if (STAGES.some((stage) => stage.key === newStage)) {
      moveCustomer(customerId, newStage);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-full overflow-x-auto overflow-y-hidden scroll-smooth">
        <div className="flex h-full gap-4 p-4" style={{ minWidth: "fit-content" }}>
          {STAGES.map((stage) => (
            <div key={stage.key} className="flex-shrink-0" style={{ width: "320px" }}>
              <StageColumn
                stage={stage}
                customers={customersByStage[stage.key]}
                onCustomerClick={onCustomerClick}
                onAddCustomer={() => onAddCustomer(stage.key)}
              />
            </div>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeCustomer ? (
          <div className="rotate-3 opacity-90" style={{ width: "320px" }}>
            <CustomerCard customer={activeCustomer} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

