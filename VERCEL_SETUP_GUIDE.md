# Vercel Deployment Guide

Since you are using **Next.js**, the best place to host your app is **Vercel** (the creators of Next.js). Vercel **does not block SMTP ports**, so your Gmail email sending will work perfectly on their free tier.

## Steps to Deploy on Vercel

### 1. Create a Vercel Account
1.  Go to [vercel.com](https://vercel.com/signup).
2.  Sign up using your **GitHub** account.

### 2. Import Your Project
1.  On your Vercel dashboard, click **"Add New..."** -> **"Project"**.
2.  Select your GitHub repository (`BlogSpace-App`).
3.  Click **Import**.

### 3. Configure Environment Variables
Before clicking "Deploy", look for the **"Environment Variables"** section. Add the same variables you used locally:

- **`MONGO_URI`**: Your MongoDB connection string.
- **`SMTP_HOST`**: `smtp.gmail.com`
- **`SMTP_SERVICE`**: `gmail`
- **`SMTP_PORT`**: `587`
- **`SMTP_SECURE`**: `false`
- **`SMTP_USER`**: `your-email@gmail.com`
- **`SMTP_PASS`**: `your-16-digit-app-password`
- **`NEXT_PUBLIC_BASE_URL`**: Leave this empty for now, or set it to your Vercel URL after deployment (e.g., `https://your-app.vercel.app`).
    - *Note: Vercel automatically provides a `NEXT_PUBLIC_VERCEL_URL`, but it's better to set your own `NEXT_PUBLIC_BASE_URL` once you know your domain.*

### 4. Deploy
1.  Click **"Deploy"**.
2.  Wait for the build to finish (usually 1-2 minutes).

### 5. Final Step: Update Base URL
1.  Once deployed, Vercel will give you a domain (e.g., `blogspace-app.vercel.app`).
2.  Go to your project **Settings** -> **Environment Variables**.
3.  Add/Update **`NEXT_PUBLIC_BASE_URL`** with this new URL (e.g., `https://blogspace-app.vercel.app`).
4.  Go to the **Deployments** tab and **Redeploy** the latest commit for this change to take effect.

## Why Vercel?
- **Native Next.js Support**: Faster builds, better performance.
- **No SMTP Blocking**: Gmail/Nodemailer works out of the box.
- **Free Tier**: Very generous for hobby projects.
