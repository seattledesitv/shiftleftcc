"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const TARGET = 80;
const questions = [
  { category: "Mind Fitness", text: "I notice changes in my thoughts, stress, or mood before they become overwhelming." },
  { category: "Mind Fitness", text: "I can pause and respond thoughtfully instead of reacting automatically." },
  { category: "Mind Fitness", text: "I have a clear sense of purpose, priorities, or direction in my current life." },
  { category: "Mind Fitness", text: "I feel supported and able to talk openly with at least one trusted person." },
  { category: "Mind Fitness", text: "I regularly reflect, learn from feedback, and adjust when something is not working." },
  { category: "Physical", text: "I usually get enough sleep to function with reasonable energy and focus." },
  { category: "Physical", text: "I include movement or physical activity in my routine consistently." },
  { category: "Physical", text: "My eating and hydration habits generally support my energy and wellbeing." },
  { category: "Physical", text: "I make time for rest, recovery, and breaks before exhaustion builds." },
  { category: "Physical", text: "My current routines feel sustainable for the responsibilities I am carrying." },
] as const;

const choices = [
  { label: "Not at all", value: 1 },
  { label: "Rarely", value: 2 },
  { label: "Sometimes", value: 3 },
  { label: "Often", value: 4 },
  { label: "Usually", value: 5 },
  { label: "Consistently", value: 6 },
];

export default function WellbeingAssessmentPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [current, setCurrent] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Loading your saved progress…");
  const hydrated = useRef(false);

  const completed = answers.every(Boolean);
  const progress = Math.round((answers.filter(Boolean).length / questions.length) * 100);
  const mindFitness = useMemo(() => Math.round((answers.slice(0, 5).reduce((sum, value) => sum + value, 0) / 30) * 50), [answers]);
  const physical = useMemo(() => Math.round((answers.slice(5).reduce((sum, value) => sum + value, 0) / 30) * 50), [answers]);
  const total = Math.min(100, mindFitness + physical);
  const gap = Math.max(0, TARGET - total);

  const status = total >= TARGET
    ? { title: "Healthy wellbeing range", body: "Your combined score meets or exceeds the 80% benchmark. Protect the routines and relationships that help you sustain this foundation." }
    : total >= 60
      ? { title: "A developing foundation", body: `You are ${gap} points from the benchmark. Focus on one repeatable practice in the lower-scoring area rather than changing everything at once.` }
      : { title: "An opportunity to shift earlier", body: `You are ${gap} points from the benchmark. Begin with one early signal, one supportive person, and one practical action you can repeat this week.` };

  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch("/api/assessment-sessions", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load saved progress.");
        const result = await response.json();
        const session = result.session;
        if (session?.status === "in_progress" && Array.isArray(session.answers)) {
          const restored = Array(questions.length).fill(0).map((_, index) => Number(session.answers[index] || 0));
          setAnswers(restored);
          setCurrent(Math.min(questions.length - 1, Math.max(0, Number(session.current_question || 0))));
          setSaveMessage("Saved progress restored.");
        } else {
          setSaveMessage("Your progress will save automatically.");
        }
      } catch {
        setSaveMessage("Automatic saving is unavailable until the Phase A database migration is applied.");
      } finally {
        hydrated.current = true;
      }
    }
    loadProgress();
  }, []);

  useEffect(() => {
    if (!hydrated.current || showResults || !answers.some(Boolean)) return;
    const timer = window.setTimeout(async () => {
      setSaveMessage("Saving…");
      try {
        const response = await fetch("/api/assessment-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, currentQuestion: current, complete: false }),
        });
        if (!response.ok) throw new Error();
        setSaveMessage("Progress saved.");
      } catch {
        setSaveMessage("Unable to save progress right now.");
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [answers, current, showResults]);

  function answer(value: number) {
    setAnswers(currentAnswers => currentAnswers.map((item, index) => index === current ? value : item));
    if (current < questions.length - 1) setTimeout(() => setCurrent(index => index + 1), 120);
  }

  async function completeAssessment() {
    setSaveMessage("Saving your results…");
    try {
      const response = await fetch("/api/assessment-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, currentQuestion: current, complete: true }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save results.");
      setSaveMessage("Results saved to your member dashboard.");
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) {
      setSaveMessage(caught instanceof Error ? caught.message : "Unable to save results.");
    }
  }

  function reset() {
    setAnswers(Array(questions.length).fill(0));
    setCurrent(0);
    setShowResults(false);
    setSaveMessage("A new assessment has started.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <main>
    <section className="pageHero compactHero">
      <p className="eyebrow">MEMBER WELLBEING SELF-ASSESSMENT</p>
      <h1>Measure your current balance between mind fitness and physical wellbeing.</h1>
      <p className="lead">Answer ten practical questions and receive an immediate score, benchmark comparison, and recommended next step. This is an educational self-reflection tool—not a clinical diagnosis.</p>
    </section>

    {!showResults ? <section className="nativeAssessment">
      <p className="assessmentSaveState">{saveMessage}</p>
      <div className="assessmentProgress"><span style={{ width: `${progress}%` }} /></div>
      <article className="questionCard">
        <p className="eyebrow">QUESTION {current + 1} OF {questions.length} · {questions[current].category}</p>
        <h2>{questions[current].text}</h2>
        <div className="answerScale">
          {choices.map(choice => <button key={choice.value} type="button" aria-pressed={answers[current] === choice.value} onClick={() => answer(choice.value)}>{choice.label}</button>)}
        </div>
        <div className="assessmentNav">
          <button className="button secondary" type="button" disabled={current === 0} onClick={() => setCurrent(index => Math.max(0, index - 1))}>← Previous</button>
          {current < questions.length - 1 ? <button className="button secondary" type="button" disabled={!answers[current]} onClick={() => setCurrent(index => Math.min(questions.length - 1, index + 1))}>Next →</button> : <button className="button primary" type="button" disabled={!completed} onClick={completeAssessment}>View and save my results</button>}
        </div>
      </article>
    </section> : <section className="nativeAssessment">
      <p className="assessmentSaveState">{saveMessage}</p>
      <div className="resultDashboard">
        <article className="scorePanel">
          <p className="eyebrow">YOUR COMBINED WELLBEING SCORE</p>
          <div className="scoreBig">{total}%</div>
          <h2>{status.title}</h2>
          <p>{status.body}</p>
          <div className="scoreBars">
            <div className="scoreBar"><label><span>Mind Fitness</span><strong>{mindFitness}/50</strong></label><div className="scoreTrack"><span className="mind" style={{ width: `${mindFitness * 2}%` }} /></div></div>
            <div className="scoreBar"><label><span>Physical Wellbeing</span><strong>{physical}/50</strong></label><div className="scoreTrack"><span className="physical" style={{ width: `${physical * 2}%` }} /></div></div>
          </div>
          <div className="actions"><Link href="/dashboard" className="button primary">Go to my dashboard</Link><Link href="/book?program=Wellbeing%20Self-Assessment" className="button secondary">Discuss my result</Link><Link href="/resources" className="button secondary">Explore resources</Link><button type="button" className="button secondary" onClick={reset}>Retake</button></div>
        </article>
        <article className="chartPanel">
          <p className="eyebrow">80% WELLBEING BENCHMARK</p>
          <div className="benchmarkChart">
            <div className="benchmarkLine"><strong>80% benchmark</strong></div>
            <div className="stackedScore" style={{ height: `${total}%` }}>
              <span style={{ height: `${total ? (physical / total) * 100 : 0}%`, background: "#4384eb" }}>{physical ? `${physical}%` : ""}</span>
              <span style={{ height: `${total ? (mindFitness / total) * 100 : 0}%`, background: "#ef493d" }}>{mindFitness ? `${mindFitness}%` : ""}</span>
            </div>
          </div>
          <p><strong>Mind Fitness + Physical Wellbeing = {total}%</strong></p>
          <p className="finePrint">The 80% line is a general educational benchmark used by this assessment, not a medical threshold.</p>
        </article>
      </div>
    </section>}
  </main>;
}
