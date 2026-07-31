"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  mission?: { statement: string; why_it_matters: string | null } | null;
  vision?: { year: number; title: string | null; vision_statement: string; success_definition: string | null; why_it_matters: string | null } | null;
};

export default function FoundationForms({ mission, vision }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>, type: "mission" | "vision") {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/personal-foundation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, ...data }) });
    const result = await response.json();
    setSaving(false);
    setMessage(response.ok ? "Saved successfully." : result.error || "Unable to save.");
    if (response.ok) router.refresh();
  }

  return <div className="foundationGrid">
    <form className="dashboardCard journalForm" onSubmit={event => submit(event, "mission")}>
      <p className="eyebrow">MY MISSION</p>
      <h2>What is the larger purpose guiding your life?</h2>
      <label>Mission statement<textarea name="statement" rows={6} required defaultValue={mission?.statement || ""} placeholder="The contribution, relationships, values, and way of living that matter most to me..." /></label>
      <label>Why it matters<textarea name="why_it_matters" rows={4} defaultValue={mission?.why_it_matters || ""} /></label>
      <button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save my mission"}</button>
    </form>

    <form className="dashboardCard journalForm" onSubmit={event => submit(event, "vision")}>
      <p className="eyebrow">MY ANNUAL VISION</p>
      <h2>What kind of life do you want to create this year?</h2>
      <label>Year<input name="year" type="number" min="2000" max="2200" required defaultValue={vision?.year || new Date().getFullYear()} /></label>
      <label>Vision title<input name="title" defaultValue={vision?.title || ""} placeholder="My year of purposeful growth" /></label>
      <label>Vision statement<textarea name="vision_statement" rows={6} required defaultValue={vision?.vision_statement || ""} /></label>
      <label>Why it matters<textarea name="why_it_matters" rows={4} defaultValue={vision?.why_it_matters || ""} /></label>
      <label>Success will look like<textarea name="success_definition" rows={4} defaultValue={vision?.success_definition || ""} /></label>
      <button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save annual vision"}</button>
      {message && <p className="formStatus">{message}</p>}
    </form>
  </div>;
}
