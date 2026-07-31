import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "../../../lib/supabase/server";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character] || character));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const audience = String(body.audience || "").trim();
    const organization = String(body.organization || "").trim();
    const interest = String(body.interest || "").trim();
    const message = String(body.message || "").trim();
    const availability = String(body.availability || "").trim();
    const website = String(body.website || "").trim();
    const captchaLeft = Number(body.captchaLeft);
    const captchaRight = Number(body.captchaRight);
    const captchaAnswer = Number(body.captchaAnswer);

    if (website) return NextResponse.json({ success: true });
    if (!name || !email || !message) return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });

    const validOperands = Number.isInteger(captchaLeft) && Number.isInteger(captchaRight) && captchaLeft >= 2 && captchaLeft <= 9 && captchaRight >= 2 && captchaRight <= 9;
    if (!validOperands || captchaAnswer !== captchaLeft + captchaRight) return NextResponse.json({ error: "The security-check answer is incorrect. Please try the new question." }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const to = process.env.DISCOVERY_CALL_TO_EMAIL?.trim();
    const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim();
    let emailStatus: "sent" | "failed" = "failed";
    let emailError: string | null = null;

    if (!apiKey || !to) {
      emailError = "Email delivery is not configured.";
    } else {
      const from = configuredFrom || "Shift Left Website <onboarding@resend.dev>";
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to: [to],
        replyTo: email,
        subject: `Discovery call request from ${name}`,
        html: `<h2>New discovery call request</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p><p><strong>Audience:</strong> ${escapeHtml(audience || "Not selected")}</p><p><strong>Organization/Event:</strong> ${escapeHtml(organization || "Not provided")}</p><p><strong>Interest:</strong> ${escapeHtml(interest || "Discovery call")}</p><p><strong>Preferred availability:</strong> ${escapeHtml(availability || "Not provided")}</p><h3>What they would like to discuss</h3><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
      });
      if (error) emailError = error.message;
      else emailStatus = "sent";
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error: saveError } = await supabase.from("discovery_call_leads").insert({
      user_id: user?.id || null,
      name,
      email,
      phone: phone || null,
      audience: audience || null,
      organization: organization || null,
      interest: interest || null,
      message,
      availability: availability || null,
      email_status: emailStatus,
      email_error: emailError,
    });

    if (saveError) return NextResponse.json({ error: `Unable to save your request: ${saveError.message}` }, { status: 500 });
    if (emailStatus === "failed") return NextResponse.json({ error: `Your request was saved, but the notification email failed: ${emailError}` }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to send the request." }, { status: 500 });
  }
}
