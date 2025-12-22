# Resend Email Setup Guide (Recommended for Render)

Render and other cloud platforms often block SMTP ports (25, 587, 465) to prevent spam. This causes email sending to fail in production even if it works locally.

We have updated the application to support **Resend**, a modern email API that works reliably on Render via HTTP (port 443).

## Why Resend?
- Works over HTTP (no blocked ports)
- Free tier includes 3,000 emails/month
- High deliverability
- Easy to verify domain

## Setup Steps

### 1. Create a Resend Account
1. Go to [Resend.com](https://resend.com) and sign up.
2. Verify your domain (recommended for production) or use the testing domain (only sends to your own email).

### 2. Get API Key
1. Go to **API Keys** in the dashboard.
2. Create a new API key (give it a name like "Blog Production").
3. Copy the key (starts with `re_`).

### 3. Configure Environment Variable
In your Render Dashboard:
1. Go to your **Service**.
2. Click on **Environment**.
3. Add a new Environment Variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: (paste your API key)
   - **Key**: `FROM_EMAIL` (Optional, defaults to `onboarding@resend.dev`)
     - If you verified a domain, use `hello@yourdomain.com`
     - If using testing domain, use `onboarding@resend.dev`

### 4. Verify
Redeploy your application. The registration flow will now automatically try to use Resend.

## How it works
The application now uses a "Hybrid" approach:
1. Checks if `RESEND_API_KEY` is present.
2. If yes, it tries to send via Resend API.
3. If Resend fails or key is missing, it falls back to SMTP (Nodemailer).

This ensures your app works both locally (with SMTP or Resend) and in production (with Resend).
