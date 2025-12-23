# Render Setup Guide

To run this application on Render (or any production environment), you need to configure the following Environment Variables in your Render Dashboard.

## Environment Variables

Go to your Render service -> **Environment** tab and add the following:

### 1. Application URL
This is crucial for email verification links to point to the correct domain.

- **Key**: `NEXT_PUBLIC_BASE_URL`
- **Value**: `https://blogspace-app-un4j.onrender.com` (Your deployed URL)

### 2. Database Connection
- **Key**: `MONGO_URI`
- **Value**: Your MongoDB Connection String (e.g., from MongoDB Atlas)

### 3. Email Configuration (SMTP)
These are required for sending verification emails.

If you are using **Gmail**, you need to use an **App Password**, not your regular password.
(Go to Google Account -> Security -> 2-Step Verification -> App Passwords)

- **Key**: `SMTP_HOST`
- **Value**: `smtp.gmail.com` (for Gmail)

- **Key**: `SMTP_SERVICE`
- **Value**: `gmail`

- **Key**: `SMTP_PORT`
- **Value**: `587` (or `465` for SSL)

- **Key**: `SMTP_SECURE`
- **Value**: `true` (if using port 465) or `false` (if using port 587)

- **Key**: `SMTP_USER`
- **Value**: `your-email@gmail.com`

- **Key**: `SMTP_PASS`
- **Value**: `your-16-digit-app-password`

## Deployment
After adding these variables, redeploy your service (or it might restart automatically).
