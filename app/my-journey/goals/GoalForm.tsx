"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoalForm() {
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
      body: JSON.stringify({ title: data.get("title"), category: data.get("category"), targetDate: data.get("targetDate"), notes: data.get("notes") }),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(result.error || "Unable to save goal.");
    form.reset();
    setMessage("Goal saved.");
    router.refresh();
  }

  return <form className="dashboardCard goalForm" onSubmit={submit}>
    <p className="eyebrow">CREATE A GOAL</p>
    <h2>Choose one practical shift.</h2>
    <label>Goal<input name="title" required maxLength={140} placeholder="Example: Walk for 30 minutes four days a week" /></label>
    <label>Category<select name="category" defaultValue="Wellbeing"><option>Wellbeing</option><option>Mind Fitness</option><option>Physical</option><option>Sleep</option><option>Career</option><option>Relationships</option><option>Learning</option></select></label>
    <label>Target date<input name="targetDate" type="date" /></label>
    <label>Why this matters<textarea name="notes" rows={4} maxLength={2000} /></label>
    <button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save goal"}</button>
    {message && <p className="formStatus">{message}</p>}
  </form>;
}
