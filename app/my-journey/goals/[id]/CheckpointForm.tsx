"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckpointForm({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/checkpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId, title: data.get("title"), plannedDate: data.get("plannedDate"), nextStep: data.get("nextStep") }),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(result.error || "Unable to save checkpoint.");
    form.reset();
    setMessage("Checkpoint saved.");
    router.refresh();
  }

  return <form className="dashboardCard goalForm" onSubmit={submit}>
    <p className="eyebrow">ADD CHECKPOINT</p>
    <h2>Break the goal into meaningful milestones.</h2>
    <label>Checkpoint<input name="title" required maxLength={180} placeholder="Example: Complete the first draft" /></label>
    <label>Planned date<input name="plannedDate" type="date" /></label>
    <label>Next step<textarea name="nextStep" rows={3} maxLength={1500} /></label>
    <button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save checkpoint"}</button>
    {message && <p className="formStatus">{message}</p>}
  </form>;
}
