"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfUTvhDAO0O1VK205nojFYvGOVfP5Xyj_lau3eYD1A8cB18lw/viewform?embedded=true";
const TARGET = 80;

export default function WellbeingAssessmentPage() {
  const [mindFitness, setMindFitness] = useState(23);
  const [physical, setPhysical] = useState(30);

  const total = useMemo(() => Math.min(100, mindFitness + physical), [mindFitness, physical]);
  const gap = Math.max(0, TARGET - total);
  const status = total >= TARGET
    ? {
        label: "Healthy wellbeing range",
        message: "Your combined score meets or exceeds the 80% wellbeing benchmark. The next step is protecting the habits and support systems that help you maintain it.",
      }
    : total >= 60
      ? {
          label: "Building a strong foundation",
          message: `You are ${gap} points from the current wellbeing benchmark. Focus on one repeatable practice in the lower-scoring area rather than trying to change everything at once.`,
        }
      : {
          label: "Opportunity for earlier support",
          message: `You are ${gap} points from the current wellbeing benchmark. Consider identifying one early signal, one supportive person, and one practical action you can begin this week.`,
        };

  return <main>
    <section className="pageHero compactHero">
      <p className="eyebrow">WELLBEING SELF-ASSESSMENT</p>
      <h1>Understand your current balance between mind fitness and physical wellbeing.</h1>
      <p className="lead">Complete the assessment, review your category scores, and compare your combined wellbeing score with the current 80% benchmark. This is an educational self-reflection tool—not a clinical diagnosis.</p>
      <div className="actions">
        <a className="button primary" href="#assessment-form">Start the assessment</a>
        <a className="button secondary" href="#results-visualizer">View the score model</a>
      </div>
    </section>

    <section className="contentPage">
      <section className="intro">
        <p className="eyebrow">HOW IT WORKS</p>
        <div>
          <h2>Assess. Understand. Shift earlier.</h2>
          <p>First, complete the Google Form below. After reviewing your results, enter the Mind Fitness and Physical values in the results visualizer. The chart will combine both dimensions and show how your score compares with the 80% wellbeing benchmark.</p>
          <p><strong>Current scoring model:</strong> Mind Fitness contributes up to 50 points and Physical Wellbeing contributes up to 50 points, creating a combined score out of 100.</p>
        </div>
      </section>

      <section id="assessment-form" className="consultingTeaser">
        <p className="eyebrow">STEP 1 · COMPLETE THE ASSESSMENT</p>
        <h2>Answer based on your current experience.</h2>
        <p>Choose responses that reflect how you are doing most of the time—not only on your best or hardest day.</p>
        <div style={{ marginTop: "2rem", borderRadius: "24px", overflow: "hidden", background: "white", border: "1px solid rgba(17, 63, 54, 0.12)" }}>
          <iframe
            src={FORM_URL}
            title="Shift Left wellbeing self-assessment"
            width="100%"
            height="1650"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            loading="lazy"
          >Loading assessment…</iframe>
        </div>
        <p className="finePrint">If the embedded form does not load, <a href={FORM_URL.replace("?embedded=true", "")} target="_blank" rel="noreferrer">open the assessment in a new tab</a>.</p>
      </section>

      <section id="results-visualizer" className="contentTeaser" style={{ alignItems: "stretch" }}>
        <div>
          <p className="eyebrow">STEP 2 · VISUALIZE YOUR RESULT</p>
          <h2>Compare your combined score with the 80% benchmark.</h2>
          <p>Enter the category values shown in your assessment results. Your information stays in your browser and is not saved by this page.</p>

          <label style={{ display: "block", marginTop: "1.5rem" }}>
            <strong>Mind Fitness: {mindFitness}%</strong>
            <input
              type="range"
              min="0"
              max="50"
              value={mindFitness}
              onChange={(event) => setMindFitness(Number(event.target.value))}
              style={{ width: "100%", marginTop: ".75rem" }}
            />
          </label>

          <label style={{ display: "block", marginTop: "1.5rem" }}>
            <strong>Physical Wellbeing: {physical}%</strong>
            <input
              type="range"
              min="0"
              max="50"
              value={physical}
              onChange={(event) => setPhysical(Number(event.target.value))}
              style={{ width: "100%", marginTop: ".75rem" }}
            />
          </label>

          <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "20px", background: "rgba(26, 122, 104, 0.08)" }}>
            <p className="eyebrow">YOUR COMBINED SCORE</p>
            <h2 style={{ marginBottom: ".5rem" }}>{total}%</h2>
            <p><strong>{status.label}</strong></p>
            <p>{status.message}</p>
          </div>
        </div>

        <div aria-label={`Combined wellbeing score ${total} percent compared with an 80 percent benchmark`} style={{ position: "relative", minHeight: "430px", padding: "2rem 1.5rem 1.5rem", borderRadius: "24px", background: "white", border: "1px solid rgba(17, 63, 54, 0.12)" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", marginBottom: "1.5rem", fontSize: ".9rem" }}>
            <span><i style={{ display: "inline-block", width: "12px", height: "12px", marginRight: "6px", background: "#ef493d" }} />Mind Fitness</span>
            <span><i style={{ display: "inline-block", width: "12px", height: "12px", marginRight: "6px", background: "#4384eb" }} />Physical</span>
          </div>

          <div style={{ position: "relative", height: "315px", borderLeft: "1px solid #1f2937", borderBottom: "1px solid #1f2937", marginLeft: "48px", background: "repeating-linear-gradient(to top, transparent 0, transparent 76px, rgba(15, 23, 42, 0.12) 77px, rgba(15, 23, 42, 0.12) 78px)" }}>
            {[0, 25, 50, 75, 100].map(value => <span key={value} style={{ position: "absolute", left: "-52px", bottom: `calc(${value}% - 8px)`, fontSize: ".75rem" }}>{value}%</span>)}

            <div style={{ position: "absolute", left: 0, right: 0, bottom: "80%", borderTop: "2px solid #f0ad1b" }}>
              <span style={{ position: "absolute", top: "-29px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontWeight: 700 }}>80% wellbeing benchmark</span>
            </div>

            <div style={{ position: "absolute", left: "28%", width: "44%", bottom: 0, height: `${total}%`, display: "flex", flexDirection: "column-reverse", justifyContent: "flex-start" }}>
              <div style={{ height: `${total ? (physical / total) * 100 : 0}%`, background: "#4384eb", display: "grid", placeItems: "center", color: "white", fontWeight: 700 }}>{physical ? `${physical}%` : ""}</div>
              <div style={{ height: `${total ? (mindFitness / total) * 100 : 0}%`, background: "#ef493d", display: "grid", placeItems: "center", color: "white", fontWeight: 700 }}>{mindFitness ? `${mindFitness}%` : ""}</div>
            </div>

            <strong style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: `calc(${total}% + 10px)`, fontSize: "1.15rem" }}>{total}% combined</strong>
          </div>
        </div>
      </section>

      <section className="consultingTeaser">
        <p className="eyebrow">STEP 3 · CHOOSE ONE NEXT STEP</p>
        <h2>Your score is a starting point, not a label.</h2>
        <p>Use the result to begin a conversation, select a practical resource, or explore guided support for the area that needs attention.</p>
        <div className="actions">
          <Link href="/resources" className="button primary">Explore practical resources</Link>
          <Link href="/book?program=Wellbeing%20Self-Assessment" className="button secondary">Discuss my results</Link>
          <Link href="/assessment" className="button secondary">Take the Shift Left Check-In</Link>
        </div>
      </section>
    </section>
  </main>;
}
