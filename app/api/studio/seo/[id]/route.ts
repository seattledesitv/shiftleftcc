import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "../../../../../lib/supabase/server";

const allowedSchema = new Set(["WebPage","CollectionPage","Service","Book","AboutPage","Blog","Article","FAQPage","Product"]);
const allowedFrequency = new Set(["always","hourly","daily","weekly","monthly","yearly","never"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: adminUser } = await supabase.from("admins").select("role").eq("user_id", user.id).maybeSingle();
  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) return NextResponse.json({ error: "Admin service is not configured." }, { status: 503 });

  const { id } = await params;
  const body = await request.json();
  const schemaType = allowedSchema.has(body.schemaType) ? body.schemaType : "WebPage";
  const changeFrequency = allowedFrequency.has(body.changeFrequency) ? body.changeFrequency : "monthly";
  const priority = Math.max(0, Math.min(1, Number(body.priority) || 0.7));
  const keywords = String(body.keywords || "").split(",").map((value: string) => value.trim()).filter(Boolean).slice(0, 30);

  const admin = createAdminClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.from("seo_pages").update({
    page_name: String(body.pageName || "").trim(),
    seo_title: String(body.seoTitle || "").trim(),
    meta_description: String(body.metaDescription || "").trim(),
    keywords,
    canonical_url: String(body.canonicalUrl || "").trim() || null,
    og_image: String(body.ogImage || "").trim() || "/shift-left-logo.svg",
    schema_type: schemaType,
    index_page: Boolean(body.indexPage),
    sitemap_enabled: Boolean(body.sitemapEnabled),
    sitemap_priority: priority,
    change_frequency: changeFrequency,
    notes: String(body.notes || "").trim() || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, page: data });
}
