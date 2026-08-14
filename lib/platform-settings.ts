import { createClient } from "./supabase/server";

export type PlatformSetting = {
  id: string;
  category: string;
  key: string;
  value: unknown;
  value_type: string;
  label: string;
  description: string | null;
  is_public: boolean;
  display_order: number;
};

const fallbacks: Record<string, unknown> = {
  "general.site_name": "Shift Left Coaching & Consulting",
  "general.tagline": "Notice earlier. Learn continuously. Care intentionally.",
  "general.site_url": "https://www.shiftleftcc.com",
  "contact.primary_email": "info@shiftleftcc.com",
  "contact.support_email": "info@shiftleftcc.com",
  "contact.service_delivery": "100% Online · Available across the U.S. and worldwide via Zoom or Microsoft Teams",
  "branding.primary_logo": "/shift-left-logo.svg",
  "seo.default_title": "Shift Left Coaching & Consulting | Online Career, Leadership & Mental Fitness Coaching",
  "seo.default_description": "Online coaching and consulting for career transitions, leadership, mental fitness, family wellbeing and proactive personal growth using the Shift Left approach.",
  "scheduling.meeting_platforms": "Zoom or Microsoft Teams",
};

export async function getPlatformSettings(category?: string) {
  try {
    const supabase = await createClient();
    let query = supabase.from("platform_settings").select("id,category,key,value,value_type,label,description,is_public,display_order").order("category").order("display_order");
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) return [] as PlatformSetting[];
    return (data || []) as PlatformSetting[];
  } catch {
    return [] as PlatformSetting[];
  }
}

export async function getSetting<T = string>(category: string, key: string, fallback?: T): Promise<T> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("platform_settings").select("value").eq("category", category).eq("key", key).maybeSingle();
    if (data && data.value !== null && typeof data.value !== "undefined") return data.value as T;
  } catch {}
  const storedFallback = fallbacks[`${category}.${key}`];
  return (typeof storedFallback !== "undefined" ? storedFallback : fallback) as T;
}

export function settingsToMap(settings: PlatformSetting[]) {
  return Object.fromEntries(settings.map(setting => [`${setting.category}.${setting.key}`, setting.value]));
}
