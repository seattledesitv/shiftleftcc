"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Area = { id: string; name: string; icon: string | null };
type Vision = { id: string; year: number; title: string | null };
type Item = { id: string; title: string; affirmation: string | null; image_prompt: string | null; life_area_id: string | null };

const themes = [
  { id: "calm", name: "Calm & Grounded", description: "Soft, spacious, reflective." },
  { id: "bold", name: "Bold Momentum", description: "High-energy and action oriented." },
  { id: "elegant", name: "Elegant Aspirations", description: "Refined, timeless, premium." },
  { id: "nature", name: "Nature & Renewal", description: "Organic, restorative, balanced." },
  { id: "modern", name: "Modern Focus", description: "Clean, structured, uncluttered." },
  { id: "celebration", name: "Joy & Celebration", description: "Warm, optimistic, uplifting." },
];

const layouts = [
  { id: "mosaic", name: "Mosaic" },
  { id: "magazine", name: "Magazine" },
  { id: "polaroid", name: "Polaroid" },
  { id: "focus", name: "One Big Focus" },
];

export default function VisionBoardBuilder({ areas, visions, items }: { areas: Area[]; visions: Vision[]; items: Item[] }) {
  const router = useRouter();
  const [theme, setTheme] = useState("calm");
  const [layout, setLayout] = useState("mosaic");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const areaMap = useMemo(() => Object.fromEntries(areas.map(area => [area.id, area])), [areas]);

  async function send(payload: Record<string, unknown>, successMessage: string) {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/vision-board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(result.error || "Unable to save.");
    setMessage(successMessage);
    router.refresh();
  }

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    send({ action: "item", title: data.get("title"), affirmation: data.get("affirmation"), imagePrompt: data.get("imagePrompt"), lifeAreaId: data.get("lifeAreaId"), visionId: data.get("visionId") }, "Vision item added.").then(() => form.reset());
  }

  function generateBoard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    send({ action: "board", title: data.get("boardTitle"), visionId: data.get("visionId"), theme, layout }, "Vision board generated and saved.");
  }

  return <div className="visionBoardWorkspace">
    <form className="dashboardCard goalForm" onSubmit={addItem}>
      <p className="eyebrow">ADD TO MY BOARD</p>
      <h2>What do you want to see in your future?</h2>
      <label>Vision item<input name="title" required maxLength={140} placeholder="Example: Publish my first book" /></label>
      <label>Life area<select name="lifeAreaId" defaultValue=""><option value="">Choose a life area</option>{areas.map(area => <option key={area.id} value={area.id}>{area.icon} {area.name}</option>)}</select></label>
      <label>Annual vision<select name="visionId" defaultValue=""><option value="">No specific annual vision</option>{visions.map(vision => <option key={vision.id} value={vision.id}>{vision.year} · {vision.title || "Annual Vision"}</option>)}</select></label>
      <label>Affirmation or meaning<textarea name="affirmation" rows={3} maxLength={500} placeholder="I am creating work that helps people and reflects who I am." /></label>
      <label>Visual idea<textarea name="imagePrompt" rows={3} maxLength={600} placeholder="Describe an image you may upload or generate later." /></label>
      <button className="button primary" disabled={saving}>{saving ? "Saving…" : "Add vision item"}</button>
    </form>

    <div className="visionBoardPanel">
      <form className="dashboardCard" onSubmit={generateBoard}>
        <p className="eyebrow">GENERATE MY VISION BOARD</p>
        <h2>Choose the feeling and layout.</h2>
        <label>Board title<input name="boardTitle" defaultValue="My Vision Board" maxLength={140} /></label>
        <label>Annual vision<select name="visionId" defaultValue=""><option value="">All vision items</option>{visions.map(vision => <option key={vision.id} value={vision.id}>{vision.year} · {vision.title || "Annual Vision"}</option>)}</select></label>
        <div className="themeGrid">{themes.map(option => <button key={option.id} type="button" className={`themeOption theme-${option.id}`} aria-pressed={theme === option.id} onClick={() => setTheme(option.id)}><strong>{option.name}</strong><span>{option.description}</span></button>)}</div>
        <div className="layoutPicker">{layouts.map(option => <button key={option.id} type="button" aria-pressed={layout === option.id} onClick={() => setLayout(option.id)}>{option.name}</button>)}</div>
        <button className="button primary" disabled={saving || !items.length}>{saving ? "Generating…" : "Generate & save board"}</button>
        {message && <p className="formStatus">{message}</p>}
      </form>

      <section className={`generatedVisionBoard theme-${theme} layout-${layout}`} aria-label="Vision board preview">
        <header><p>MY VISION</p><h2>What I am creating</h2></header>
        <div className="visionBoardTiles">{items.map((item, index) => <article key={item.id} className={`visionTile tile-${index % 6}`}><span>{item.life_area_id ? areaMap[item.life_area_id]?.icon : "✦"}</span><h3>{item.title}</h3>{item.affirmation && <p>{item.affirmation}</p>}{item.image_prompt && <small>{item.image_prompt}</small>}</article>)}</div>
        {!items.length && <div className="visionBoardEmpty">Add vision items to build your board.</div>}
      </section>
    </div>
  </div>;
}
