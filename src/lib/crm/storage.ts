import { Customer } from "@/types/crm";

const CRM_STORAGE_KEY = "pyrize.crmCustomers.v1";

export function loadCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CRM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load customers from localStorage", error);
    return [];
  }
}

export function saveCustomers(customers: Customer[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error("Failed to save customers to localStorage", error);
  }
}

