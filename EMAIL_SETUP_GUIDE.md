# Real Email Setup Guide

## Option 1: Gmail (Free, Personal Use)

### Prerequisites:
- Gmail account
- 2-Factor Authentication enabled

### Steps:
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not done)
3. Security → App passwords → Mail → Generate
4. Copy the 16-character password
5. Update .env.local:
   ```
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=your-16-char-app-password
   FROM_EMAIL=youremail@gmail.com
   ```

### Limitations:
- 500 emails per day limit
- May get flagged as spam
- Not recommended for production

## Option 2: SendGrid (Recommended for Production)

### Why SendGrid?
- 100 emails/day free forever
- Better deliverability
- Professional email service
- Easy setup

### Steps:
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your account
3. Create an API key
4. Update .env.local:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   FROM_EMAIL=noreply@yourdomain.com
   ```

## Option 3: Outlook/Hotmail

### Steps:
1. Enable 2FA on Microsoft account
2. Generate app password
3. Update .env.local:
   ```
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=youremail@outlook.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=youremail@outlook.com
   ```

## Testing Your Setup

After updating .env.local, test with:
```bash
node scripts/test-email.js
```

## Important Notes:

- Always restart your dev server after changing .env.local
- Keep your SMTP credentials secure
- For production, use a dedicated email service like SendGrid
- Gmail has daily sending limits