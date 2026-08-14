"use client";

import { FormEvent, useState } from "react";

type Setting = {
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

function displayValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return JSON.stringify(value ?? "", null, 2);
}

export default function SettingsEditor({ setting }: { setting: Setting }) {
  const [status, setStatus] = useState("");
  const [checked, setChecked] = useState(Boolean(setting.value));

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving…");
    const data = new FormData(event.currentTarget);
    const value = setting.value_type === "boolean" ? checked : data.get("value");
    const response = await fetch(`/api/studio/platform-settings/${setting.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    const result = await response.json();
    setStatus(response.ok ? "Saved." : result.error || "Unable to save.");
  }

  const common = { name: "value", defaultValue: displayValue(setting.value) };

  return <form className="dashboardCard seoEditor" onSubmit={save}>
    <div className="leadHeader"><div><p className="eyebrow">{setting.category} · {setting.key}</p><h2>{setting.label}</h2></div><span className="assessmentStatus">{setting.is_public ? "Public" : "Admin only"}</span></div>
    {setting.description && <p>{setting.description}</p>}
    {setting.value_type === "textarea" && <label>Value<textarea {...common} rows={3} /></label>}
    {setting.value_type === "boolean" && <label className="journalTags"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)} /> Enabled</label>}
    {setting.value_type === "number" && <label>Value<input {...common} type="number" /></label>}
    {setting.value_type === "email" && <label>Value<input {...common} type="email" /></label>}
    {setting.value_type === "url" && <label>Value<input {...common} type="url" /></label>}
    {setting.value_type === "color" && <div className="activityFormGrid"><label>Color<input {...common} type="text" /></label><label>Preview<input type="color" value={typeof setting.value === "string" ? setting.value : "#000000"} readOnly /></label></div>}
    {setting.value_type === "select" && <label>Value<input {...common} /></label>}
    {setting.value_type === "json" && <label>JSON<textarea {...common} rows={5} /></label>}
    {!["textarea","boolean","number","email","url","color","select","json"].includes(setting.value_type) && <label>Value<input {...common} /></label>}
    <div className="actions"><button type="submit" className="button primary">Save setting</button>{status && <span>{status}</span>}</div>
  </form>;
}
