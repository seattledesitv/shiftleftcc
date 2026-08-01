"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; label: string };

export default function GoalForm({ lifeAreas, visions }: { lifeAreas: Option[]; visions: Option[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        category: data.get("category"),
        targetDate: data.get("targetDate"),
        notes: data.get("notes"),
        whyItMatters: data.get("whyItMatters"),
        successDefinition: data.get("successDefinition"),
        lifeAreaId: data.get("lifeAreaId"),
        visionId: data.get("visionId"),
        priority: data.get("priority"),
      }),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(result.error || "Unable to save goal.");
    form.reset();
    setMessage("Life goal saved.");
    router.refresh();
  }

  return <form className="dashboardCard goalForm" onSubmit={submit}>
    <p className="eyebrow">CREATE A LIFE GOAL</p>
    <h2>Define a meaningful outcome for your year.</h2>
    <label>Goal<input name="title" required maxLength={140} placeholder="Example: Publish my first book" /></label>
    <label>Life area<select name="lifeAreaId" defaultValue=""><option value="">Choose a life area</option>{lifeAreas.map(area => <option key={area.id} value={area.id}>{area.label}</option>)}</select></label>
    <label>Annual vision<select name="visionId" defaultValue=""><option value="">Not linked to a vision</option>{visions.map(vision => <option key={vision.id} value={vision.id}>{vision.label}</option>)}</select></label>
    <label>Category<input name="category" defaultValue="Life Goal" maxLength={50} /></label>
    <label>Why this matters<textarea name="whyItMatters" rows={3} maxLength={2500} /></label>
    <label>Success definition<textarea name="successDefinition" rows={3} maxLength={2500} placeholder="How will you know you have truly succeeded?" /></label>
    <label>Target date<input name="targetDate" type="date" /></label>
    <label>Priority<select name="priority" defaultValue="3"><option value="1">1 — Highest</option><option value="2">2 — High</option><option value="3">3 — Medium</option><option value="4">4 — Lower</option><option value="5">5 — Someday</option></select></label>
    <label>Notes<textarea name="notes" rows={3} maxLength={2000} /></label>
    <button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save life goal"}</button>
    {message && <p className="formStatus">{message}</p>}
  </form>;
}
