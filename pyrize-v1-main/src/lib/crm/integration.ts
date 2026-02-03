import { randomUUID } from "crypto";
import { SupabaseClient } from "@supabase/supabase-js";
import { SunumOlusturmaIstegi } from "@/types";

interface SyncPresentationParams {
  supabase: SupabaseClient;
  slug: string;
  sunum: SunumOlusturmaIstegi;
  presentationTitle: string;
  createdAt: string;
}

const buildCustomerPayload = (istek: SunumOlusturmaIstegi) => {
  const musteri: any = (istek as any).musteri || {};
  const name =
    musteri?.adSoyad ||
    musteri?.name ||
    musteri?.fullName ||
    istek?.mulk?.konum ||
    "Portföy Sahibi";

  const phone = musteri?.telefon || musteri?.phone || null;
  const email = musteri?.email || null;

  const amac = istek.amac as string;
  const status =
    amac === "portfoy_almak"
      ? "Beklemede"
      : amac === "satisa_hazirlik"
        ? "Aktif"
        : "Aktif";

  const tags = [
    istek.amac?.split("_").join(" "),
    istek.tema,
    istek.sunumStili,
  ]
    .filter(Boolean)
    .map((tag) => String(tag));

  const notes = [
    istek.mulk?.konum ? `Konum: ${istek.mulk.konum}` : null,
    istek.mulk?.tur ? `Mülk türü: ${istek.mulk.tur}` : null,
    istek.mulk?.kullanimPotansiyeli
      ? `Potansiyel: ${istek.mulk.kullanimPotansiyeli}`
      : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return { name, phone, email, status, tags, notes };
};

const findExistingCustomer = async (
  supabase: SupabaseClient,
  email?: string | null,
  phone?: string | null
) => {
  if (email) {
    const { data } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (data?.id) return data.id as string;
  }

  if (phone) {
    const { data } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (data?.id) return data.id as string;
  }

  return null;
};

export const syncCrmWithPresentation = async ({
  supabase,
  slug,
  sunum,
  presentationTitle,
  createdAt,
}: SyncPresentationParams) => {
  const customerPayload = buildCustomerPayload(sunum);
  let customerId = await findExistingCustomer(
    supabase,
    customerPayload.email,
    customerPayload.phone
  );

  if (!customerId) {
    customerId = randomUUID();
  }

  try {
    await supabase
      .from("customers")
      .upsert(
        {
          id: customerId,
          name: customerPayload.name,
          phone: customerPayload.phone,
          email: customerPayload.email,
          status: customerPayload.status,
          tags: customerPayload.tags,
          notes: customerPayload.notes,
          updated_at: createdAt,
        },
        { onConflict: "id" }
      );
  } catch (error) {
    console.warn("CRM müşteri kaydı oluşturulamadı:", error);
  }

  try {
    await supabase.from("presentations").upsert(
      {
        id: slug,
        customer_id: customerId,
        title: presentationTitle,
        purpose: sunum.amac,
        style: sunum.sunumStili,
        theme: sunum.tema,
        created_at: createdAt,
        updated_at: createdAt,
      },
      { onConflict: "id" }
    );
  } catch (error) {
    console.warn("CRM sunum kaydı oluşturulamadı:", error);
  }

  return { customerId };
};

