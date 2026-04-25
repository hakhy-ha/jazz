# ✅ **JAZZ SOCIAL APP - DEPLOYMENT CHECKLIST**

## **PHASE 1: Preparation** ✓

- [x] Created Supabase database (`jazz-social-db`)
- [x] All database tables created
- [x] Connection string ready: `db.kazgznelkhaisuiikjar.supabase.co`
- [x] Database password: `huPBWtZNS3UIdOxW`
- [x] Environment files created (`.env.production`)

---

## **PHASE 2: Firebase Setup** (IN PROGRESS)

- [ ] **Get Firebase Credentials**
  - [ ] Open https://console.firebase.google.com
  - [ ] Select your Jazz project (create if needed)
  - [ ] Go to Project Settings → General
  - [ ] Copy Firebase SDK configuration
  - [ ] Save all credentials securely

- [ ] **Enable Firebase Services**
  - [ ] Enable Authentication → Google Provider
  - [ ] Enable Firestore Database (optional)
  - [ ] Enable Cloud Storage
  - [ ] Update Storage Security Rules

- [ ] **Update Environment Variables**
  - [ ] Fill in `apps/api/.env.production` with Firebase values
  - [ ] Fill in `apps/web/.env.production` with Firebase values
  - [ ] Generate random JWT_SECRET for backend
  - [ ] Save changes

---

## **PHASE 3: Backend Deployment to Render** (NEXT)

- [ ] **Prepare Code**
  - [ ] Create/verify `.env.production` in `apps/api/`
  - [ ] Verify `package.json` has correct build/start scripts
  - [ ] Test build locally: `npm run build`

- [ ] **Create Render Service**
  - [ ] Go to https://dashboard.render.com
  - [ ] Click "New" → "Web Service"
  - [ ] Upload `jazz-app.zip` file
  - [ ] Set Name: `jazz-api`
  - [ ] Set Build Command: `npm install && npm run build`
  - [ ] Set Start Command: `npm run start:prod`
  - [ ] Add all environment variables
  - [ ] Click "Create Web Service"
  - [ ] Wait 5-10 minutes for deployment
  - [ ] Copy service URL (e.g., `https://jazz-api.onrender.com`)

---

## **PHASE 4: Frontend Deployment to Render** (NEXT)

- [ ] **Update API URL**
  - [ ] Open `apps/web/.env.production`
  - [ ] Update `NEXT_PUBLIC_API_URL=https://jazz-api.onrender.com` (use your actual URL)

- [ ] **Create Render Static Site**
  - [ ] Go to https://dashboard.render.com
  - [ ] Click "New" → "Static Site"
  - [ ] Upload `jazz-app.zip` file
  - [ ] Set Name: `jazz-web`
  - [ ] Set Build Command: `npm install && npm run build`
  - [ ] Set Publish Directory: `.next` or `out`
  - [ ] Add all environment variables
  - [ ] Click "Create Static Site"
  - [ ] Wait 5-10 minutes for deployment
  - [ ] Note frontend URL

---

## **PHASE 5: Firebase Configuration** (CONCURRENT WITH PHASES 3-4)

- [ ] **Add Authorized Domains**
  - [ ] Go to Firebase Console → Authentication → Settings
  - [ ] Add your frontend domain (e.g., `jazz-web.onrender.com`)
  - [ ] Add localhost domains for testing
  - [ ] Save

- [ ] **Configure Firebase Storage Rules**
  - [ ] Go to Firebase Console → Storage → Rules
  - [ ] Update rules to allow authenticated uploads
  - [ ] Deploy rules

---

## **PHASE 6: Testing** (AFTER DEPLOYMENT)

- [ ] **Frontend Testing**
  - [ ] Visit `https://jazz-web.onrender.com`
  - [ ] Page loads without errors
  - [ ] Can navigate to login/signup

- [ ] **Authentication Testing**
  - [ ] Click "Sign Up"
  - [ ] Create account with email
  - [ ] Verify email (check spam folder)
  - [ ] Try "Sign In with Google"
  - [ ] Can log in successfully

- [ ] **Profile Testing**
  - [ ] Go to profile page
  - [ ] Try uploading profile picture
  - [ ] Update bio/nickname
  - [ ] Changes save correctly

- [ ] **Feed Testing**
  - [ ] Create a new post
  - [ ] Upload image to post
  - [ ] Post appears in feed
  - [ ] Like/comment on posts
  - [ ] Features work correctly

- [ ] **Chat Testing**
  - [ ] Add a friend
  - [ ] Open chat with friend
  - [ ] Send text message
  - [ ] Send image/media
  - [ ] Messages appear in real-time

- [ ] **Database Testing**
  - [ ] Login to Supabase Console
  - [ ] Check "User" table has new users
  - [ ] Check "Post" table has new posts
  - [ ] Check "Message" table has messages

---

## **PHASE 7: Monitoring** (AFTER DEPLOYMENT)

- [ ] **Render Dashboard**
  - [ ] Check backend service status (green)
  - [ ] Check frontend service status (green)
  - [ ] Monitor logs for errors
  - [ ] Review deployment history

- [ ] **Firebase Console**
  - [ ] Check Authentication stats
  - [ ] Monitor Storage usage
  - [ ] Review Security Rules
  - [ ] Check for any errors in logs

- [ ] **Supabase Console**
  - [ ] Monitor database connections
  - [ ] Check query performance
  - [ ] Review storage usage

---

## **QUICK REFERENCE**

### **URLs**
- Firebase Console: https://console.firebase.google.com
- Render Dashboard: https://dashboard.render.com
- Supabase Console: https://supabase.com/dashboard
- Frontend: https://jazz-web.onrender.com
- Backend API: https://jazz-api.onrender.com

### **Credentials to Save** 🔐
```
Supabase:
- Host: db.kazgznelkhaisuiikjar.supabase.co
- User: postgres
- Password: huPBWtZNS3UIdOxW
- Database: postgres

Firebase:
- Get from: Project Settings → General

Render:
- Backend URL: [your-api-service].onrender.com
- Frontend URL: [your-web-site].onrender.com
```

### **Environment Variables Needed**
```
Backend (.env.production):
- DATABASE_URL
- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID
- JWT_SECRET

Frontend (.env.production):
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## **TROUBLESHOOTING QUICK LINKS**

- Auth not working: Check authorized domains in Firebase
- Upload fails: Check Storage rules in Firebase
- API not connecting: Verify API_URL in frontend
- Database error: Check DATABASE_URL in backend
- Deployment failed: Check Render logs

---

**Estimated Total Time: 30-45 minutes**

Current Status: **Phase 2 - Firebase Setup** 🔄

Next Action: Get Firebase credentials and fill in environment variables! 🚀