# Gmail SMTP Setup Guide (Free & Reliable)

Since Resend requires domain verification to send to external emails, **Gmail SMTP** is the best free alternative for personal projects. It allows you to send up to 500 emails/day to **any** email address.

## Step 1: Enable 2-Factor Authentication
1. Go to your [Google Account Settings](https://myaccount.google.com/).
2. Click on **Security** on the left.
3. Scroll down to "How you sign in to Google".
4. Make sure **2-Step Verification** is turned **ON**.

## Step 2: Generate an App Password
1. In the same **Security** section, search for **"App passwords"** in the search bar at the top (or look under 2-Step Verification).
2. Create a new App Password:
   - **App name**: `BlogSpace`
   - Click **Create**.
3. **Copy the 16-character password** displayed (it will look like `xxxx xxxx xxxx xxxx`).

## Step 3: Configure Render Environment Variables
Go to your Render Dashboard -> Service -> **Environment** and set these variables:

| Variable | Value |
| :--- | :--- |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `your-gmail-address@gmail.com` |
| `SMTP_PASS` | `your-16-char-app-password` (remove spaces if any) |
| `SMTP_SECURE` | `true` |
| `RESEND_API_KEY` | *(Delete this variable or leave empty)* |

## Step 4: Redeploy
Once you save the variables, Render will restart your app. Registration emails should now work for **any** email address!
