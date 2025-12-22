# Production Email Fix Guide

## 🚨 URGENT: Email Not Sending in Production

This guide will help you fix the email sending issue in your production environment.

## Step 1: Check Production Environment Variables

Your production environment (Render) MUST have these environment variables set:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=dhanyasrikalisamy@gmail.com
SMTP_PASS=xwhlwzfkkqefmvwh
FROM_EMAIL=dhanyasrikalisamy@gmail.com
SMTP_TEST_TO=dhanyasrikalisamy@gmail.com
```

### How to Set Environment Variables in Render:

1. Go to your Render dashboard
2. Select your BlogSpace service
3. Go to "Environment" tab
4. Add each variable above
5. Click "Save Changes"
6. **IMPORTANT**: Redeploy your service after adding variables

## Step 2: Test Your Production Email

After setting the environment variables and redeploying, test the email:

```bash
curl -X GET "https://blogspace-app-un4j.onrender.com/api/test-smtp"
```

Expected response:
```json
{
  "success": true,
  "message": "SMTP test successful - email sent",
  "messageId": "some-message-id"
}
```

## Step 3: Common Issues and Solutions

### Issue 1: Gmail App Password Problems

**Problem**: Gmail rejects the app password
**Solution**: 
1. Make sure 2FA is enabled on your Gmail account
2. Generate a NEW app password:
   - Go to Google Account Settings
   - Security → 2-Step Verification
   - App passwords → Mail → Generate
3. Use the NEW 16-character password (no spaces)

### Issue 2: Environment Variables Not Set

**Problem**: Production environment missing SMTP variables
**Solution**: 
1. Check Render environment variables
2. Ensure all variables are spelled correctly
3. Redeploy after adding variables

### Issue 3: Gmail Security Blocking

**Problem**: Gmail blocks emails from production servers
**Solution**: 
1. Try sending a test email first
2. Check Gmail's "Less secure app access" (though this is deprecated)
3. Consider switching to SendGrid for production

## Step 4: Alternative - Switch to SendGrid (Recommended)

If Gmail continues to cause issues, switch to SendGrid:

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Update your production environment variables:

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=no-reply@yourdomain.com
```

## Step 5: Test Locally First

Before deploying, test locally:

```bash
node scripts/test-email.js
```

This will verify your SMTP configuration works.

## Step 6: Debug Production Issues

If emails still don't send, check your production logs:

1. Go to Render dashboard
2. Select your service
3. Check "Logs" tab
4. Look for SMTP-related errors

Common error messages and solutions:

- **"SMTP configuration missing"** → Environment variables not set
- **"Authentication failed"** → Wrong Gmail app password
- **"Connection timeout"** → Network/firewall issues
- **"Invalid login"** → Wrong username or password

## Step 7: Manual Verification (Temporary Fix)

If email still doesn't work, you can manually verify users:

1. Check your MongoDB for unverified users
2. Set `isVerified: true` for legitimate users
3. This is a temporary solution while fixing email

## Quick Checklist

- [ ] Environment variables set in Render
- [ ] Service redeployed after adding variables
- [ ] Gmail 2FA enabled and app password generated
- [ ] Test endpoint returns success
- [ ] Local test script works
- [ ] Production logs checked for errors

## Need Help?

If you're still having issues:

1. Run the local test script and share the output
2. Check your Render logs and share any error messages
3. Verify your Gmail app password is correct
4. Consider switching to SendGrid for better reliability

## Important Notes

- Gmail has daily sending limits (500 emails/day)
- Production email delivery can take a few minutes
- Always test locally before deploying
- Keep your SMTP credentials secure
- Never commit real passwords to your repository