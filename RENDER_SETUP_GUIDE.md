# Render Environment Variables Setup Guide

## 🚀 Setting Up Email on Render Production

Your production site at `https://blogspace-app-un4j.onrender.com` needs environment variables to send emails.

### Required Environment Variables

You need to add these environment variables in your Render dashboard:

#### 1. MongoDB Connection
```
MONGO_URI=mongodb+srv://dhanyasri:Dhans612@cluster0.ptg0fco.mongodb.net/nextjs_blog
```

#### 2. Base URL (Production)
```
NEXT_PUBLIC_BASE_URL=https://blogspace-app-un4j.onrender.com
NEXT_PUBLIC_API_URL=https://blogspace-app-un4j.onrender.com/api
```

#### 3. Gmail SMTP Configuration
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dhanyasrikalisamy@gmail.com
SMTP_PASS=xwhlwzfkkqefmvwh
FROM_EMAIL=dhanyasrikalisamy@gmail.com
```

#### 4. Cloudinary (if using image uploads)
```
CLOUDINARY_CLOUD_NAME=dsu6mglbf
CLOUDINARY_API_KEY=143546565119249
CLOUDINARY_API_SECRET=Uxw8VinTCWsQrWRMC1FCgEtJ6bs
```

---

## 📝 How to Add Environment Variables on Render

### Step 1: Go to Your Render Dashboard
1. Visit https://dashboard.render.com/
2. Click on your `blogspace-app` service

### Step 2: Navigate to Environment Variables
1. Click on **"Environment"** in the left sidebar
2. Scroll down to **"Environment Variables"** section

### Step 3: Add Each Variable
For each variable above:
1. Click **"Add Environment Variable"**
2. Enter the **Key** (e.g., `SMTP_HOST`)
3. Enter the **Value** (e.g., `smtp.gmail.com`)
4. Click **"Save Changes"**

### Step 4: Redeploy
After adding all variables:
1. Render will automatically redeploy your app
2. Wait for the deployment to complete (usually 2-5 minutes)
3. Your email functionality will now work!

---

## ✅ Testing After Setup

Once deployed, test your registration:
1. Go to https://blogspace-app-un4j.onrender.com/register
2. Register with a real email address
3. Check your inbox for the verification email
4. The verification link should point to your production URL

---

## 🔒 Security Notes

- Never commit `.env.local` to GitHub (it's already in .gitignore)
- Environment variables on Render are encrypted and secure
- Your Gmail App Password is safe in Render's environment
- Each environment (local vs production) has its own variables

---

## 🐛 Troubleshooting

### Email Not Sending?
1. Check Render logs: Dashboard → Your Service → Logs
2. Look for errors like "SMTP connection failed"
3. Verify all SMTP variables are set correctly
4. Make sure SMTP_PASS is your Gmail App Password (not regular password)

### Wrong Verification Links?
1. Check `NEXT_PUBLIC_BASE_URL` is set to production URL
2. Redeploy after changing environment variables

### Still Not Working?
1. Check Render logs for specific error messages
2. Verify Gmail App Password is still valid
3. Test locally first to ensure code works
