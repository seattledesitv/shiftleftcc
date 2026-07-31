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
    const website = String(body.website || "").trim();
    const captchaLeft = Number(body.captchaLeft);
    const captchaRight = Number(body.captchaRight);
    const captchaAnswer = Number(body.captchaAnswer);

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const validOperands = Number.isInteger(captchaLeft) && Number.isInteger(captchaRight)
      && captchaLeft >= 2 && captchaLeft <= 9
      && captchaRight >= 2 && captchaRight <= 9;

    if (!validOperands || captchaAnswer !== captchaLeft + captchaRight) {
      return NextResponse.json({ error: "The security-check answer is incorrect. Please try the new question." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const to = process.env.DISCOVERY_CALL_TO_EMAIL?.trim();
    const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim();

    if (!apiKey || !to) {
      return NextResponse.json({ error: "Email delivery is not fully configured. Add RESEND_API_KEY and DISCOVERY_CALL_TO_EMAIL in Vercel, then redeploy." }, { status: 503 });
    }

    const from = configuredFrom || "Shift Left Website <onboarding@resend.dev>";
    const resend = new Resend(apiKey);

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
      const testMode = from.includes("@resend.dev");
      const helpfulMessage = testMode && /only send testing emails/i.test(error.message)
        ? `Resend test mode can only deliver to the email address associated with your Resend account. The current configured recipient is ${to}. Confirm that this matches the Resend account email, save the Vercel environment variable for Production, Preview, and Development as needed, and redeploy. Otherwise verify shiftleftcc.com in Resend and use a sender such as hello@shiftleftcc.com.`
        : error.message;

      return NextResponse.json({ error: helpfulMessage }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to send the request." }, { status: 500 });
  }
}
