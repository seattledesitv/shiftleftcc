import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email delivery is not configured yet." }, { status: 503 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.DISCOVERY_CALL_TO_EMAIL || "info@shiftleftcc.com";
    const from = process.env.RESEND_FROM_EMAIL || "Shift Left Website <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Discovery call request from ${name}`,
      html: `<h2>New discovery call request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Audience:</strong> ${escapeHtml(audience || "Not selected")}</p>
        <p><strong>Organization/Event:</strong> ${escapeHtml(organization || "Not provided")}</p>
        <p><strong>Interest:</strong> ${escapeHtml(interest || "Discovery call")}</p>
        <p><strong>Preferred availability:</strong> ${escapeHtml(availability || "Not provided")}</p>
        <h3>What they would like to discuss</h3>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to send the request." }, { status: 500 });
  }
}
