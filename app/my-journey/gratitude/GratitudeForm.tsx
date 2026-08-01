"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function GratitudeForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/gratitude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryDate: data.get("entryDate"),
        gratitudeOne: data.get("gratitudeOne"),
        gratitudeTwo: data.get("gratitudeTwo"),
        gratitudeThree: data.get("gratitudeThree"),
        highlight: data.get("highlight"),
        appreciatedPerson: data.get("appreciatedPerson"),
      }),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(result.error || "Unable to save gratitude entry.");
    setMessage("Your gratitude entry was saved.");
    router.refresh();
  }

  return <form className="dashboardCard goalForm" onSubmit={submit}>
    <p className="eyebrow">DAILY GRATITUDE</p>
    <h2>Notice what is meaningful today.</h2>
    <label>Date<input name="entryDate" type="date" defaultValue={new Date().toISOString().slice(0,10)} /></label>
    <label>1. I am grateful for…<textarea name="gratitudeOne" required rows={2} /></label>
    <label>2. I am also grateful for…<textarea name="gratitudeTwo" rows={2} /></label>
    <label>3. One more thing…<textarea name="gratitudeThree" rows={2} /></label>
    <label>Today’s highlight<textarea name="highlight" rows={3} /></label>
    <label>Someone I appreciate<input name="appreciatedPerson" /></label>
    <button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save gratitude note"}</button>
    {message && <p className="formStatus">{message}</p>}
  </form>;
}
