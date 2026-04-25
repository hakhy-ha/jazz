# 🚀 **RENDER DEPLOYMENT GUIDE** (Best Option Selected)

## **Step 1: Create Render Account**
✅ **Browser opened to:** https://dashboard.render.com/register

**Choose your signup method:**
- **GitHub** (if accessible) - Click "GitHub" button
- **Google** - Click "Google" button (recommended alternative)
- **GitLab/Bitbucket** - If you have accounts there
- **Email** - Scroll down for email signup

**Fill out your details and create account**

---

## **Step 2: Create PostgreSQL Database**

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Name: `jazz-db`
3. Database: `jazz_prod`
4. User: `jazz_user`
5. Region: Choose closest to you (e.g., Oregon, Frankfurt)
6. **Click "Create Database"**
7. **Copy the connection string** (looks like: `postgresql://user:pass@host:5432/db`)

---

## **Step 3: Deploy Backend (NestJS API)**

1. Click **"New +"** → **"Web Service"**
2. **Choose "Public Git repository"** → But since GitHub is blocked, use **"Manual Deploy"**
3. Service Name: `jazz-api`
4. Environment: `Node`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm run start:prod`
7. **Upload the ZIP file:** `C:\Users\LENOVO\Desktop\jazz-app.zip`
8. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db  # From Step 2
   JWT_SECRET=your-super-secret-jwt-key-here
   FIREBASE_API_KEY=your-firebase-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```
9. **Click "Create Web Service"**

---

## **Step 4: Deploy Frontend (Next.js)**

1. Click **"New +"** → **"Static Site"**
2. **Choose "Manual Deploy"**
3. Site Name: `jazz-web`
4. Build Command: `npm install && npm run build && npm run export`
5. Publish Directory: `out`
6. **Upload the ZIP file:** `C:\Users\LENOVO\Desktop\jazz-app.zip`
7. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://jazz-api.onrender.com  # Will get this after backend deploys
   ```
8. **Click "Create Static Site"**

---

## **Step 5: Update Frontend API URL**

After backend deploys successfully:
1. Go to your **jazz-api** service
2. Copy the **service URL** (e.g., `https://jazz-api.onrender.com`)
3. Go to your **jazz-web** static site
4. **Environment** → **Add Environment Variable**
5. Name: `NEXT_PUBLIC_API_URL`
6. Value: `https://jazz-api.onrender.com`
7. **Save and redeploy**

---

## **Step 6: Configure Firebase**

Your Firebase config should already be set up from local development. Make sure:
- Storage rules allow your deployed domain
- Authentication is enabled
- Firestore security rules are configured

---

## **Expected URLs After Deployment:**
- **Frontend:** `https://jazz-web.onrender.com`
- **Backend:** `https://jazz-api.onrender.com`

---

## **Testing Your Deployment:**

1. Visit `https://jazz-web.onrender.com`
2. Try registering a new account
3. Test chat functionality
4. Upload a post with media
5. Check user profiles

---

## **Troubleshooting:**

- **Build fails:** Check build logs in Render dashboard
- **API not responding:** Verify `NEXT_PUBLIC_API_URL` is correct
- **Database connection:** Ensure PostgreSQL credentials are correct
- **Firebase issues:** Check Firebase console for errors

---

## **Cost Estimate:**
- **Free Tier:** 750 hours/month combined
- **PostgreSQL:** $7/month after free trial
- **Domains:** Free with .onrender.com

**Ready to proceed?** Follow these steps in your browser!