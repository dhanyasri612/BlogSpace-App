# SMTP Production Setup (BlogSpace)

This file documents the SMTP configuration and production checklist for BlogSpace.

Required environment variables (set these in Render or your host's secret manager):

- `SMTP_HOST` — SMTP server hostname (e.g., `smtp.sendgrid.net`, `smtp.gmail.com`)
- `SMTP_PORT` — Port (587 for TLS, 465 for SSL)
- `SMTP_USER` — SMTP username (SendGrid uses `apikey`)
- `SMTP_PASS` — SMTP password or API key
- `SMTP_SECURE` — `true` for secure (port 465), otherwise `false` (default: `false`)
- `FROM_EMAIL` — Verified from address (e.g., `no-reply@yourdomain.com`)
- `NEXT_PUBLIC_BASE_URL` — Public base URL used to build verify links
- `SMTP_TEST_TO` (optional) — Recipient address for `GET /api/test-smtp`

Quick test endpoints (once env vars are set and service redeployed):

- `GET /api/test-smtp` — sends a single test email to `SMTP_TEST_TO`.
- `POST /api/user` — creates a user and attempts to send verification email.

Deliverability checklist:

- Configure SPF and DKIM DNS records for your sending domain according to your SMTP provider's instructions.
- Verify the sending domain in your provider dashboard.
- Monitor provider suppression lists for bounces or blocks.
- Use a dedicated sending domain (recommended) rather than a personal email.

Troubleshooting:

- If `GET /api/test-smtp` returns an error mentioning missing config, verify the env vars are present and correctly spelled in Render.
- If the SMTP provider returns a `messageId` but no email arrives, check the provider's delivery logs and your recipient spam/junk folder.
- For Gmail SMTP, use an app password (with 2FA) or an SMTP provider instead; Gmail has strict sending limits.

Security:

- Never commit secrets to the repo. Use Render's secret manager to store `SMTP_PASS` and other credentials.
