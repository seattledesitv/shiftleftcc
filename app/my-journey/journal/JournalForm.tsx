"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const moods = ["Great", "Good", "Okay", "Low", "Difficult"];
const suggestedTags = ["Work", "Family", "Stress", "Gratitude", "Health", "Growth"];

export default function JournalForm() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggleTag(tag: string) {
    setSelectedTags(current => current.includes(tag) ? current.filter(item => item !== tag) : [...current, tag]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        content: data.get("content"),
        mood: data.get("mood"),
        tags: selectedTags,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error || "Unable to save your entry.");
      return;
    }

    form.reset();
    setSelectedTags([]);
    setStatus("success");
    setMessage("Your private reflection was saved.");
    router.refresh();
  }

  return <form className="journalForm dashboardCard" onSubmit={submit}>
    <p className="eyebrow">TODAY'S CHECK-IN</p>
    <h2>What would you like to notice today?</h2>
    <label>How are you feeling?
      <select name="mood" defaultValue="">
        <option value="">Select a mood</option>
        {moods.map(mood => <option key={mood}>{mood}</option>)}
      </select>
    </label>
    <label>Title
      <input name="title" maxLength={120} placeholder="Optional—give this reflection a name" />
    </label>
    <label>Reflection
      <textarea name="content" rows={7} maxLength={8000} required placeholder="What happened? What did you notice? What would help next?" />
    </label>
    <fieldset>
      <legend>Tags</legend>
      <div className="journalTags">
        {suggestedTags.map(tag => <button key={tag} type="button" aria-pressed={selectedTags.includes(tag)} onClick={() => toggleTag(tag)}>{tag}</button>)}
      </div>
    </fieldset>
    <button className="button primary" type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Save private entry"}</button>
    {message && <p className={`formStatus ${status}`}>{message}</p>}
    <p className="finePrint">Journal entries are private to your account and are not visible in Studio.</p>
  </form>;
}
