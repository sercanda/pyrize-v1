"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Tag,
  Trash2,
  Building2,
  TrendingUp,
  Activity,
  CheckSquare,
  FileText,
  ExternalLink,
  Plus,
} from "lucide-react";
import { CreatePropertyModal } from "./CreatePropertyModal";
import { SlideOver } from "./SlideOver";
import { SlideOverTabs } from "@/components/ui/AppTabGroup";
import { CONTACT_TYPE_LABELS } from "@/types/crm";
import type { DBCustomer, DBDeal, DBProperty, DBActivity, DBTodo, DBPresentation } from "@/types/crm";

type TabKey = "bilgi" | "mulkler" | "firsatlar" | "aktiviteler" | "gorevler" | "sunumlar";

const SLIDE_TABS: { key: TabKey; label: string; icon: typeof Phone }[] = [
  { key: "bilgi", label: "Bilgi", icon: Phone },
  { key: "mulkler", label: "Mülkler", icon: Building2 },
  { key: "firsatlar", label: "Fırsatlar", icon: TrendingUp },
  { key: "aktiviteler", label: "Aktivite", icon: Activity },
  { key: "gorevler", label: "Görevler", icon: CheckSquare },
  { key: "sunumlar", label: "Sunumlar", icon: FileText },
];

interface CustomerSlideOverProps {
  customer: DBCustomer;
  onClose: () => void;
  onUpdate: (updates: Partial<DBCustomer>) => Promise<void>;
  onDelete: () => Promise<void>;
  onCreateProperty?: (data: Partial<DBProperty>, photos?: File[]) => Promise<void>;
}

export function CustomerSlideOver({ customer, onClose, onUpdate, onDelete, onCreateProperty }: CustomerSlideOverProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("bilgi");
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [relatedDeals, setRelatedDeals] = useState<DBDeal[]>([]);
  const [relatedProperties, setRelatedProperties] = useState<DBProperty[]>([]);
  const [relatedActivities, setRelatedActivities] = useState<DBActivity[]>([]);
  const [relatedTodos, setRelatedTodos] = useState<DBTodo[]>([]);
  const [relatedPresentations, setRelatedPresentations] = useState<DBPresentation[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoadingRelated(true);
      try {
        const [dealsRes, propsRes, actsRes, todosRes, presRes] = await Promise.all([
          fetch(`/api/crm/deals?customer_id=${customer.id}`),
          fetch(`/api/crm/properties?customer_id=${customer.id}`),
          fetch(`/api/crm/activities?customer_id=${customer.id}`),
          fetch(`/api/crm/todos?customer_id=${customer.id}`),
          fetch(`/api/crm/presentations?customer_id=${customer.id}`),
        ]);
        if (dealsRes.ok) setRelatedDeals(await dealsRes.json());
        if (propsRes.ok) setRelatedProperties(await propsRes.json());
        if (actsRes.ok) setRelatedActivities(await actsRes.json());
        if (todosRes.ok) setRelatedTodos(await todosRes.json());
        if (presRes.ok) setRelatedPresentations(await presRes.json());
      } catch {
        // Silently fail for related data
      } finally {
        setLoadingRelated(false);
      }
    };
    fetchRelated();
  }, [customer.id]);

  const handleDelete = async () => {
    if (confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      await onDelete();
    }
  };

  return (
    <SlideOver
      open
      onClose={onClose}
      title={customer.name}
      subtitle={CONTACT_TYPE_LABELS[customer.type] || customer.type}
      width="max-w-xl"
    >
      {/* Tabs */}
      <div className="pb-4 mb-4 -mx-6 px-6 border-b border-white/10">
        <SlideOverTabs
          tabs={SLIDE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "bilgi" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {customer.phone && (
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                <Phone className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-500">Telefon</p>
                  <p className="text-sm text-white">{customer.phone}</p>
                </div>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                <Mail className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-500">E-posta</p>
                  <p className="text-sm text-white">{customer.email}</p>
                </div>
              </div>
            )}
            {customer.city && (
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-500">Şehir</p>
                  <p className="text-sm text-white">{customer.city}</p>
                </div>
              </div>
            )}
            {customer.tags && customer.tags.length > 0 && (
              <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] p-3">
                <Tag className="h-4 w-4 text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Etiketler</p>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.tags.map((tag, i) => (
                      <span key={i} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {customer.notes && (
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-xs text-slate-500 mb-1">Notlar</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{customer.notes}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Müşteriyi Sil
            </button>
          </div>
        </div>
      )}

      {activeTab === "mulkler" && (
        <div className="space-y-3">
          {onCreateProperty && (
            <button
              onClick={() => setShowAddProperty(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#DBE64C]/30 bg-[#DBE64C]/[0.04] py-2.5 text-sm font-medium text-[#DBE64C] transition hover:bg-[#DBE64C]/10"
            >
              <Plus className="h-4 w-4" />
              Mülk Ekle
            </button>
          )}
          <RelatedList
            items={relatedProperties}
            loading={loadingRelated}
            emptyText="Bu müşteriye bağlı mülk yok"
            renderItem={(prop: DBProperty) => (
              <div key={prop.id} className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-sm font-medium text-white">{prop.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {prop.city && <span className="text-xs text-slate-400">{prop.city}</span>}
                  <span className="text-xs text-[#DBE64C]">
                    {new Intl.NumberFormat("tr-TR").format(prop.price)} TL
                  </span>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {activeTab === "firsatlar" && (
        <RelatedList
          items={relatedDeals}
          loading={loadingRelated}
          emptyText="Bu müşteriye bağlı fırsat yok"
          renderItem={(deal: DBDeal) => (
            <div key={deal.id} className="rounded-xl bg-white/[0.04] p-3">
              <p className="text-sm font-medium text-white">{deal.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  {deal.stage}
                </span>
                <span className="text-xs text-cyan-400">
                  {new Intl.NumberFormat("tr-TR").format(deal.value)} TL
                </span>
              </div>
            </div>
          )}
        />
      )}

      {activeTab === "aktiviteler" && (
        <RelatedList
          items={relatedActivities}
          loading={loadingRelated}
          emptyText="Bu müşteriye ait aktivite yok"
          renderItem={(act: DBActivity) => (
            <div key={act.id} className="flex items-start gap-3 rounded-xl bg-white/[0.04] p-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
              <div>
                <p className="text-sm text-white">{act.description || act.type}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(act.date).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
          )}
        />
      )}

      {activeTab === "gorevler" && (
        <RelatedList
          items={relatedTodos}
          loading={loadingRelated}
          emptyText="Bu müşteriye bağlı görev yok"
          renderItem={(todo: DBTodo) => (
            <div key={todo.id} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
              <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                todo.status === "done" ? "border-emerald-400 bg-emerald-400/20" : "border-white/20"
              }`}>
                {todo.status === "done" && <span className="text-emerald-400 text-xs">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${todo.status === "done" ? "text-slate-500 line-through" : "text-white"}`}>
                  {todo.title}
                </p>
                {todo.due_date && (
                  <p className="text-xs text-slate-500">
                    {new Date(todo.due_date).toLocaleDateString("tr-TR")}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      )}

      {showAddProperty && onCreateProperty && (
        <CreatePropertyModal
          onClose={() => setShowAddProperty(false)}
          defaultCustomerId={customer.id}
          onCreate={async (data, photos) => {
            await onCreateProperty(data, photos);
            setShowAddProperty(false);
          }}
        />
      )}

      {activeTab === "sunumlar" && (
        <RelatedList
          items={relatedPresentations}
          loading={loadingRelated}
          emptyText="Bu müşteriye bağlı sunum yok"
          renderItem={(pres: DBPresentation) => (
            <div key={pres.id} className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3">
              <div>
                <p className="text-sm font-medium text-white">{pres.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(pres.created_at).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <a
                href={`/sunum/${pres.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/10 p-2 text-cyan-400 hover:bg-white/15 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        />
      )}
    </SlideOver>
  );
}

function RelatedList<T>({
  items,
  loading,
  emptyText,
  renderItem,
}: {
  items: T[];
  loading: boolean;
  emptyText: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-8">{emptyText}</p>;
  }

  return <div className="space-y-2">{items.map(renderItem)}</div>;
}
