import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServiceClient } from "@/lib/supabase/server";

const DEFAULT_BUCKET = process.env.SUPABASE_IMAGE_BUCKET ?? "fal-room-inputs";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Supabase servis anahtarı bulunamadı. SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY değerlerini .env dosyasında tanımlayın.",
      },
      { status: 500 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Geçerli bir dosya gönderilmedi." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Dosya boyutu 10MB sınırını aşıyor." },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extension =
    file.name.split(".").pop()?.toLowerCase() ||
    file.type.split("/").pop() ||
    "jpg";
  const fileName = `${new Date().toISOString().split("T")[0]}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(DEFAULT_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      {
        error: "Supabase Storage yüklemesi başarısız oldu.",
        details: uploadError.message,
      },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(fileName);

  return NextResponse.json(
    {
      success: true,
      bucket: DEFAULT_BUCKET,
      path: fileName,
      publicUrl,
    },
    { status: 201 },
  );
}

