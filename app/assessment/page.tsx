"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const questions = [
  { text: "I notice changes in my stress, energy, or mood before they become overwhelming.", pillar: "Awareness" },
  { text: "I make time to reflect on patterns, feedback, and what recent experiences are teaching me.", pillar: "Learning" },
  { text: "I have simple practices that help me recover, reset, and maintain my wellbeing.", pillar: "Care" },
  { text: "I can name the people, tools, or environments that support me when things become difficult.", pillar: "Support" },
  { text: "I take small action when I notice an early signal instead of waiting for the situation to intensify.", pillar: "Action" },
  { text: "My current routines are sustainable enough to support the responsibilities I am carrying.", pillar: "Sustainability" },
];

const choices = [
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Consistently", value: 4 },
];

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const completed = answers.every(Boolean);
  const total = useMemo(() => answers.reduce((sum, answer) => sum + answer, 0), [answers]);
  const [showResult, setShowResult] = useState(false);

  const result = total <= 11
    ? {
        title: "Begin with awareness and support.",
        body: "Your answers suggest that life may be asking more of you than your current support system or routines can comfortably hold. Start small: notice one early signal, identify one supportive person or practice, and choose one action you can repeat this week.",
        recommendation: "Shift Left Foundations or a discovery conversation may be a helpful starting point.",
      }
    : total <= 18
      ? {
          title: "You have a foundation. Strengthen the consistency.",
          body: "You already use some proactive practices, but they may not yet be reliable across stressful seasons. Focus on making awareness, reflection, and self-care easier to repeat—not more complicated.",
          recommendation: "A focused coaching program or practical resource can help turn insight into a sustainable rhythm.",
        }
      : {
          title: "You are operating proactively. Keep refining the system.",
          body: "Your answers reflect strong awareness, learning, support, and intentional care. The next opportunity is to protect these practices during transitions and use what you have learned to strengthen the people and systems around you.",
          recommendation: "Executive wellbeing, leadership coaching, or an organizational workshop may fit your next stage.",
        };

  function updateAnswer(index: number, value: number) {
    setAnswers(current => current.map((answer, answerIndex) => answerIndex === index ? value : answer));
    setShowResult(false);
  }

  function resetAssessment() {
    setAnswers(Array(questions.length).fill(0));
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <main>
    <section className="pageHero compactHero">
      <p className="eyebrow">SHIFT LEFT CHECK-IN</p>
      <h1>How proactive is your current wellbeing system?</h1>
      <p className="lead">Reflect on six practical statements across awareness, learning, care, support, action, and sustainability. This is an educational check-in—not a clinical assessment or diagnosis.</p>
    </section>

    <section className="contentPage">
      <div className="contentGrid">
        {questions.map((question, index) => <article className="contentCard" key={question.text}>
          <span className="tag">{String(index + 1).padStart(2, "0")} · {question.pillar}</span>
          <h2>{question.text}</h2>
          <div className="actions" aria-label={`Answer question ${index + 1}`}>
            {choices.map(choice => <button
              type="button"
              key={choice.value}
              className={`button ${answers[index] === choice.value ? "primary" : "secondary"}`}
              onClick={() => updateAnswer(index, choice.value)}
              aria-pressed={answers[index] === choice.value}
            >{choice.label}</button>)}
          </div>
        </article>)}
      </div>

      <section className="consultingTeaser">
        {!showResult ? <>
          <p className="eyebrow">YOUR REFLECTION</p>
          <h2>{completed ? "Your check-in is complete." : `${answers.filter(Boolean).length} of ${questions.length} statements answered.`}</h2>
          <p>{completed ? "View your result and a practical recommended next step." : "Choose the response that best reflects your experience most of the time—not only on your best or hardest day."}</p>
          <button className="button primary" type="button" disabled={!completed} onClick={() => setShowResult(true)}>View my result</button>
        </> : <>
          <p className="eyebrow">YOUR SHIFT LEFT RESULT · {total}/{questions.length * 4}</p>
          <h2>{result.title}</h2>
          <p>{result.body}</p>
          <p><strong>{result.recommendation}</strong></p>
          <div className="actions"><Link href="/programs" className="button primary">Explore programs</Link><Link href="/book?program=Shift%20Left%20Check-In" className="button secondary">Discuss my result</Link><button type="button" className="button secondary" onClick={resetAssessment}>Retake check-in</button></div>
        </>}
      </section>
    </section>

    <section className="contentTeaser">
      <div><p className="eyebrow">KEEP EXPLORING</p><h2>Turn reflection into one useful next step.</h2><p>Browse practical resources, learn the Shift Left Strategy, or begin a guided conversation.</p></div>
      <div className="contentLinks"><Link href="/resources">Practical resources →</Link><Link href="/why-shift-left">The strategy →</Link><Link href="/book">Book a discovery call →</Link></div>
    </section>
  </main>;
}
