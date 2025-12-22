# 🧪 Test Different Email Providers

## Current Issue:
Gmail SMTP (port 465 or 587) is being blocked by Render's infrastructure. This is a common issue with Gmail on cloud hosting platforms.

## IMMEDIATE SOLUTION:

### Use SendGrid (5-minute setup):

1. **Sign up**: https://sendgrid.com/ (FREE - 100 emails/day)

2. **Create API Key**:
   - Login → Settings → API Keys
   - Create API Key → Name: "BlogSpace"
   - Permissions: Mail Send → Full Access
   - Copy the API key (shown only once!)

3. **Update Render Environment Variables**:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=SG.your-actual-api-key-here
   FROM_EMAIL=noreply@blogspace.com
   SMTP_TEST_TO=dhanyasrikalisamy@gmail.com
   ```

4. **Redeploy in Render**

5. **Test**:
   ```bash
   curl https://blogspace-app-un4j.onrender.com/api/test-smtp
   ```

## Why Gmail Doesn't Work on Render:

- Gmail SMTP is designed for personal use, not production servers
- Cloud hosting IPs are often blocked by Gmail
- Connection timeouts are common
- Not recommended for production applications

## Why SendGrid/Brevo/Resend Work:

- Designed specifically for production email delivery
- Optimized for cloud hosting platforms
- Better deliverability rates
- No connection timeout issues
- Professional email service

## Your Options (in order of recommendation):

1. **SendGrid** - Most popular, 100 emails/day free
2. **Brevo** - 300 emails/day free, no credit card
3. **Resend** - Modern, developer-friendly, 100 emails/day
4. **Mailgun** - Reliable, 100 emails/day free

## Time to Fix:

- **SendGrid setup**: 5 minutes
- **Update Render variables**: 2 minutes
- **Redeploy**: 3 minutes
- **Total**: 10 minutes to working emails!

## Next Steps:

1. Choose SendGrid (recommended)
2. Sign up and get API key
3. Update Render environment variables
4. Redeploy
5. Test registration - emails will work!

**This is the only way to reliably send emails from Render. Gmail SMTP will not work.**