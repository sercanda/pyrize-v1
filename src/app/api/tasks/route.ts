import { NextRequest, NextResponse } from "next/server";
import { withSecurity } from "@/lib/security/withSecurity";
import { securityConfig } from "@/lib/security/config";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

type CreateTaskBody = {
  title: string;
  description?: string;
  dueDate: string;
  priority?: "low" | "medium" | "high";
  type?: "meeting" | "offer" | "price_update" | "call";
  status?: "pending" | "completed" | "cancelled";
  customerId?: string | null;
  presentationId?: string | null;
};

const estimateCost = () => securityConfig.defaultRequestCost * 0.1;

export async function POST(request: NextRequest) {
  // Lazy init inside handler - build-time safe
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase yapılandırılmamış" },
      { status: 503 }
    );
  }

  return withSecurity<CreateTaskBody>(
    request,
    async ({ body }) => {
      if (!body?.title || !body?.dueDate) {
        return NextResponse.json(
          { error: "Başlık ve dueDate alanları zorunlu" },
          { status: 400 }
        );
      }

      const id = randomUUID();
      const nowIso = new Date().toISOString();

      try {
        await supabase.from("tasks").insert({
          id,
          title: body.title,
          description: body.description || null,
          due_date: body.dueDate,
          status: body.status || "pending",
          priority: body.priority || "medium",
          type: body.type || "meeting",
          customer_id: body.customerId || null,
          presentation_id: body.presentationId || null,
          created_at: nowIso,
          updated_at: nowIso,
        });
      } catch (error: any) {
        console.error("Görev kaydı oluşturulamadı:", error);
        return NextResponse.json(
          { error: error?.message || "Görev kaydedilemedi" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { id },
      });
    },
    {
      identifyUser: ({ body, ip }) =>
        body?.customerId || body?.presentationId || ip,
      estimateCost: () => estimateCost(),
    }
  );
}

