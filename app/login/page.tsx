"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const [next, setNext] = useState("/");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const destination = new URLSearchParams(window.location.search).get("next");
    if (destination?.startsWith("/")) setNext(destination);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage("Account created. Check your email if confirmation is enabled, then sign in.");
        setMode("signin");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        window.location.href = next;
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to complete the request.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="authPage"><section className="authCard">
    <p className="eyebrow">SHIFT LEFT MEMBER ACCESS</p>
    <h1>{mode === "signin" ? "Welcome back." : "Create your account."}</h1>
    <p>{mode === "signin" ? "Sign in to access assessments, results, and member-only Journal content." : "Create a free account to take assessments and access protected resources."}</p>
    {message && <p className="authMessage">{message}</p>}
    {error && <p className="authMessage authError">{error}</p>}
    <form onSubmit={handleSubmit}>
      <label>Email<input type="email" name="email" autoComplete="email" required /></label>
      <label>Password<input type="password" name="password" minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} required /></label>
      <button className="button primary" type="submit" disabled={loading}>{loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</button>
    </form>
    <div className="actions"><button className="button secondary" type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}>{mode === "signin" ? "Create an account" : "I already have an account"}</button><Link className="button secondary" href="/">Back to home</Link></div>
  </section></main>;
}
