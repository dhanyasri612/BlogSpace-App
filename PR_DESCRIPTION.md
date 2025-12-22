Branch: feat/smtp-email

Summary:

- Replace Resend-based email sending with an SMTP-based implementation using `nodemailer`.
- Add `utils/smtpEmailSender.js` with `sendVerificationEmail` and `testSmtpSend` helpers.
- Update registration API at `app/api/user/route.js` to use SMTP helper.
- Add `app/api/test-smtp/route.js` to verify SMTP configuration in production.
- Add `.env.example` and `EMAIL_SETUP_SMTP.md` with setup and deliverability guidance.

Required env vars (do not commit secrets):

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `FROM_EMAIL`, `NEXT_PUBLIC_BASE_URL`, `SMTP_TEST_TO` (optional)

Deployment notes:

- Set the env vars in Render's dashboard under your service settings and redeploy.
- Use verified sending domain and configure SPF/DKIM in DNS.

Testing after deploy:

1. `GET /api/test-smtp` should return `success: true` and a `messageId`.
2. `POST /api/user` should return success and trigger a verification email; in development it returns `verifyLink` for manual verification.

If you want, I can open the PR description text in GitHub for you to paste when creating the PR.
