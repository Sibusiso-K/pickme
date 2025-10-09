import { NextResponse } from "next/server";
import { sbAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { path } = await req.json();
  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }
  const sb = sbAdmin();
  const { data, error } = await sb.storage
    .from("driver-docs")
    .createSignedUploadUrl(path);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ token: data.token });
}
