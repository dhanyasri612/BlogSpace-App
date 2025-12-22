import { testSmtpSend } from "@/utils/smtpEmailSender.js";

export async function GET(request) {
  try {
    console.log("🧪 Testing SMTP configuration...");

    const to = process.env.SMTP_TEST_TO || "your-test-recipient@example.com";
    const result = await testSmtpSend(to);

    console.log("📊 SMTP test result:", result);

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "SMTP test successful - email sent",
          messageId: result.messageId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: result.error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ SMTP test failed:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err && err.message ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
