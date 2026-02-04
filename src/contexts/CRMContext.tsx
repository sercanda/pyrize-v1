"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Customer, CustomerStage, Activity, FileAttachment } from "@/types/crm";
import { loadCustomers, saveCustomers } from "@/lib/crm/storage";
import { SAMPLE_CUSTOMERS } from "@/lib/crm/sample-data";

interface CRMContextType {
  customers: Customer[];
  addCustomer: (newCustomer: Omit<Customer, "id" | "lastActivity" | "activities" | "files">) => void;
  updateCustomer: (id: string, updatedFields: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  moveCustomer: (customerId: string, newStage: CustomerStage) => void;
  addActivity: (customerId: string, activity: Omit<Activity, "id" | "date">) => void;
  addFile: (customerId: string, file: FileAttachment) => void;
  removeFile: (customerId: string, fileId: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const storedCustomers = loadCustomers();
    if (storedCustomers.length === 0) {
      setCustomers(SAMPLE_CUSTOMERS);
      saveCustomers(SAMPLE_CUSTOMERS);
    } else {
      setCustomers(storedCustomers);
    }
  }, []);

  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  const addCustomer = useCallback(
    (newCustomer: Omit<Customer, "id" | "lastActivity" | "activities" | "files">) => {
      setCustomers((prevCustomers) => [
        ...prevCustomers,
        {
          ...newCustomer,
          id: `customer-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          lastActivity: new Date().toISOString(),
          activities: [],
          files: [],
        },
      ]);
    },
    []
  );

  const updateCustomer = useCallback((id: string, updatedFields: Partial<Customer>) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              ...updatedFields,
              lastActivity: new Date().toISOString(),
            }
          : customer
      )
    );
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
  }, []);

  const moveCustomer = useCallback((customerId: string, newStage: CustomerStage) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              stage: newStage,
              lastActivity: new Date().toISOString(),
            }
          : customer
      )
    );
  }, []);

  const addActivity = useCallback(
    (customerId: string, activity: Omit<Activity, "id" | "date">) => {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                activities: [
                  {
                    ...activity,
                    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    date: new Date().toISOString(),
                  },
                  ...customer.activities,
                ],
                lastActivity: new Date().toISOString(),
              }
            : customer
        )
      );
    },
    []
  );

  const addFile = useCallback((customerId: string, file: FileAttachment) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              files: [...customer.files, file],
              lastActivity: new Date().toISOString(),
            }
          : customer
      )
    );
  }, []);

  const removeFile = useCallback((customerId: string, fileId: string) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              files: customer.files.filter((f) => f.id !== fileId),
            }
          : customer
      )
    );
  }, []);

  return (
    <CRMContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        moveCustomer,
        addActivity,
        addFile,
        removeFile,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error("useCRM must be used within a CRMProvider");
  }
  return context;
}

