import sendEmail from "@/utils/emailValidator.js";

export const runtime = "nodejs";

export async function POST(request) {
  const token = request.headers.get("x-test-token");
  if (!process.env.SMTP_TEST_TOKEN || token !== process.env.SMTP_TEST_TOKEN) {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const to = body?.to || process.env.SMTP_TEST_TO;
    if (!to) {
      return new Response(
        JSON.stringify({ message: "Missing recipient (to)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ok = await sendEmail(
      to,
      "SMTP test",
      "This is a test email from /api/test-smtp"
    );

    if (!ok) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

