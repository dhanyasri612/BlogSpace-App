import nodemailer from "nodemailer";

export default async function sendEmail(email, subject, text) {
  try {
    const service = process.env.SMTP_SERVICE?.trim();
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT || 0);
    const secure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === "true"
        : port === 465;
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      throw new Error("SMTP credentials are not configured");
    }

    if (!service && !host) {
      throw new Error("SMTP host/service is not configured");
    }

    if (!service && (!port || Number.isNaN(port))) {
      throw new Error("SMTP port is not configured");
    }

    const transportOptions = service
      ? {
          service,
          auth: { user, pass },
        }
      : {
          host,
          port,
          secure,
          auth: { user, pass },
        };

    const transporter = nodemailer.createTransport(transportOptions);

    await transporter.sendMail({
      from: process.env.FROM_EMAIL?.trim() || user,
      to: email,
      subject: subject,
      text: text,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error?.message || error);
    return false;
  }
}
