"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ActivityForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activityDate: data.get("activityDate"),
        activityType: data.get("activityType"),
        durationMinutes: data.get("durationMinutes"),
        steps: data.get("steps"),
        sleepHours: data.get("sleepHours"),
        recoveryScore: data.get("recoveryScore"),
        notes: data.get("notes"),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(result.error || "Unable to save activity.");
      return;
    }
    form.reset();
    setStatus("success");
    setMessage("Activity and recovery data saved.");
    router.refresh();
  }

  return <form className="journalForm dashboardCard" onSubmit={submit}>
    <p className="eyebrow">MANUAL ACTIVITY CHECK-IN</p>
    <h2>Record movement, sleep, and recovery.</h2>
    <div className="activityFormGrid">
      <label>Date<input name="activityDate" type="date" required defaultValue={new Date().toISOString().slice(0,10)} /></label>
      <label>Activity<select name="activityType" required defaultValue="walking"><option value="walking">Walking</option><option value="running">Running</option><option value="cycling">Cycling</option><option value="strength">Strength</option><option value="yoga">Yoga</option><option value="sports">Sports</option><option value="other">Other</option></select></label>
      <label>Duration (minutes)<input name="durationMinutes" type="number" min="0" max="1440" placeholder="30" /></label>
      <label>Steps<input name="steps" type="number" min="0" placeholder="6000" /></label>
      <label>Sleep (hours)<input name="sleepHours" type="number" min="0" max="24" step="0.1" placeholder="7.5" /></label>
      <label>Recovery today<select name="recoveryScore" defaultValue=""><option value="">Not recorded</option><option value="1">1 · Very low</option><option value="2">2 · Low</option><option value="3">3 · Moderate</option><option value="4">4 · Good</option><option value="5">5 · Strong</option></select></label>
    </div>
    <label>Notes<textarea name="notes" rows={4} maxLength={2000} placeholder="How did the activity feel? What helped or got in the way?" /></label>
    <button className="button primary" type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Save activity"}</button>
    {message && <p className={`formStatus ${status}`}>{message}</p>}
    <p className="finePrint">This activity log is for personal reflection and is not a medical record.</p>
  </form>;
}
