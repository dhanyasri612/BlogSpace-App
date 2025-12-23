import nodemailer from "nodemailer";

export default async function sendEmail(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    await transporter.verify();
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
    return { success: true };
  } catch (error) {
    console.log("Email not sent");
    console.error(error);
    return {
      success: false,
      error: error?.message || "Email send failed",
      code: error?.code,
    };
  }
}
