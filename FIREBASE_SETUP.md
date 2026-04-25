# 🔥 **FIREBASE SETUP GUIDE**

## **Step 1: Get Your Firebase Credentials**

1. Open: https://console.firebase.google.com
2. Sign in with your Google account
3. Select your Jazz project (or create one if needed)
4. Go to **Project Settings** (gear icon) → **General** tab
5. Scroll down to find your **Firebase SDK configuration**
6. Copy these values:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "measurementId": "YOUR_MEASUREMENT_ID"
}
```

---

## **Step 2: Enable Firebase Services**

### **Authentication**
1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Enable **Google** provider:
   - Click **Google**
   - Toggle **Enable**
   - Select a **Support email**
   - Click **Save**

### **Firestore Database** (Optional - for chat)
1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select region closest to you
5. Click **Create**

### **Storage** (For file uploads)
1. Go to **Storage** (left sidebar)
2. Click **Get Started**
3. Start with **Production rules**
4. Choose your region
5. Click **Done**

**Update Storage Security Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /posts/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /chat-media/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /audio-notes/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## **Step 3: Update Environment Files**

### **Backend Environment** (`apps/api/.env`)

Create/update this file:

```env
# Database
DATABASE_URL=postgresql://postgres:huPBWtZNS3UIdOxW@db.kazgznelkhaisuiikjar.supabase.co:5432/postgres

# Server
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=86400

# Firebase
FIREBASE_API_KEY=YOUR_API_KEY_FROM_FIREBASE_CONSOLE
FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
FIREBASE_APP_ID=YOUR_APP_ID
```

### **Frontend Environment** (`apps/web/.env.production`)

Create/update this file:

```env
NEXT_PUBLIC_API_URL=https://jazz-api.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_FROM_FIREBASE_CONSOLE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## **Step 4: Deploy to Render with Environment Variables**

### **Deploy Backend**

1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. Upload `jazz-app.zip`
4. Configure:
   - **Name:** `jazz-api`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
5. Click **Advanced** and add these environment variables:

```
DATABASE_URL=postgresql://postgres:huPBWtZNS3UIdOxW@db.kazgznelkhaisuiikjar.supabase.co:5432/postgres
NODE_ENV=production
PORT=3000
JWT_SECRET=generate-a-random-secret-key-here
FIREBASE_API_KEY=YOUR_API_KEY
FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
FIREBASE_APP_ID=YOUR_APP_ID
```

6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. Copy the service URL (e.g., `https://jazz-api.onrender.com`)

### **Deploy Frontend**

1. Click **New** → **Static Site**
2. Upload `jazz-app.zip` (or use `apps/web` folder)
3. Configure:
   - **Name:** `jazz-web`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next/standalone` or `out`
4. Click **Advanced** and add these environment variables:

```
NEXT_PUBLIC_API_URL=https://jazz-api.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

5. Click **Create Static Site**
6. Wait for deployment (5-10 minutes)

---

## **Step 5: Update Firebase to Allow Your Domains**

### **Authorized JavaScript Origins**
1. Go to Firebase Console → **Authentication**
2. Click **Settings** (gear icon)
3. Go to **Authorized domains**
4. Add:
   - `jazz-web.onrender.com` (your frontend domain)
   - `localhost:3000` (for local testing)
   - `127.0.0.1:3000`

---

## **Step 6: Test Everything**

1. Visit: `https://jazz-web.onrender.com`
2. Click **Sign Up**
3. Try signing in with Google
4. Upload a profile picture
5. Create a post with an image
6. Test chat functionality

---

## **Troubleshooting**

### **Firebase Auth Not Working**
- ✓ Check authorized domains in Firebase Console
- ✓ Verify API key is correct
- ✓ Ensure Google provider is enabled
- ✓ Check CORS settings in browser console

### **Upload Fails**
- ✓ Verify Firebase Storage is enabled
- ✓ Check Storage Rules allow uploads
- ✓ Ensure user is authenticated

### **API Connection Failed**
- ✓ Check `NEXT_PUBLIC_API_URL` is correct
- ✓ Verify Render backend service is running
- ✓ Check environment variables in Render dashboard

---

## **Environment Variables Quick Reference**

| Variable | Where to Find |
|----------|---------------|
| `FIREBASE_API_KEY` | Firebase Console → Project Settings → General → SDK config |
| `FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → General |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → General |
| `FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → General |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → General |
| `FIREBASE_APP_ID` | Firebase Console → Project Settings → General |
| `DATABASE_URL` | Supabase → Project Settings → Database |

---

## **IMPORTANT SECURITY NOTE** ⚠️

- Never commit `.env` files to Git
- Always use environment variables in production
- Rotate JWT_SECRET regularly
- Use strong database passwords
- Enable Firebase Security Rules in production

---

**Ready? Follow these steps and your Jazz app will be live! 🚀**