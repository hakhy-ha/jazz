# 🚀 **JAZZ SOCIAL APP - COMPLETE DEPLOYMENT GUIDE**

## ✅ **CURRENT STATUS**

✓ Supabase project created: `jazz-social-db`
✓ Organization: `Jazz Social` (Free tier)
✓ Database schema created with all tables
✓ Ready for backend & frontend deployment

---

## **DATABASE CONNECTION DETAILS**

**Project ID:** `kazgznelkhaisuiikjar`

**To get your connection string:**

1. Go to: https://supabase.com/dashboard/project/kazgznelkhaisuiikjar/settings/database
2. Look for **Connection string** (URI format)
3. Copy and save it securely

**Format:**
```
postgresql://postgres:[PASSWORD]@db.kazgznelkhaisuiikjar.supabase.co:5432/postgres
```

> Replace `[PASSWORD]` with the password you set during project creation: `huPBWtZNS3UIdOxW`

---

## **DATABASE SCHEMA CREATED**

All tables are ready with foreign key constraints:
- ✓ User table
- ✓ Post table
- ✓ Message table
- ✓ Friendship table
- ✓ Comment table
- ✓ Like table

---

## **NEXT STEPS FOR DEPLOYMENT**

### **Option A: Deploy to Render (Recommended)**

**Step 1: Update `.env.production` in your project**

Update `apps/api/.env.production`:
```bash
DATABASE_URL=postgresql://postgres:huPBWtZNS3UIdOxW@db.kazgznelkhaisuiikjar.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this
FIREBASE_API_KEY=get-from-firebase-console
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Step 2: Deploy to Render**

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Upload the `jazz-app.zip` file
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm run start:prod`
6. Add all environment variables above
7. **Create Web Service**

**Step 3: Deploy Frontend**

1. Click **"New"** → **"Static Site"**
2. Upload `jazz-app.zip`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `.next/standalone` or `out`
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://[your-api-service].onrender.com
   ```
6. **Create Static Site**

---

### **Option B: Deploy Locally First (Test)**

```bash
# Terminal 1: Start API
cd apps/api
npm install
DATABASE_URL="postgresql://postgres:huPBWtZNS3UIdOxW@db.kazgznelkhaisuiikjar.supabase.co:5432/postgres" npm run start:dev

# Terminal 2: Start Frontend  
cd apps/web
npm install
NEXT_PUBLIC_API_URL=http://localhost:3000 npm run dev
```

Access at: http://localhost:3000

---

## **ENVIRONMENT VARIABLES REFERENCE**

### **Backend (NestJS)**
```env
DATABASE_URL=postgresql://postgres:huPBWtZNS3UIdOxW@db.kazgznelkhaisuiikjar.supabase.co:5432/postgres
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRATION=3600
NODE_ENV=production
PORT=5002

# Firebase
FIREBASE_API_KEY=get-from-console
FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
FIREBASE_PROJECT_ID=project-id
FIREBASE_STORAGE_BUCKET=project.appspot.com
```

### **Frontend (Next.js)**
```env
NEXT_PUBLIC_API_URL=https://jazz-api.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=same-as-backend
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
```

---

## **DATABASE PASSWORD**

🔐 **Secure your password!**
- Database Password: `huPBWtZNS3UIdOxW`
- Username: `postgres`
- Host: `db.kazgznelkhaisuiikjar.supabase.co`
- Port: `5432`
- Database: `postgres`

---

## **FIREBASE SETUP REQUIRED**

Before deploying, get these from your Firebase console:

1. Go to: https://console.firebase.google.com
2. Select your Jazz project
3. Go to **Project Settings** (gear icon)
4. Copy the config values
5. Add to environment variables above

**Firebase Config Example:**
```json
{
  "apiKey": "AIzaSyDr...",
  "authDomain": "jazz-social-app.firebaseapp.com",
  "projectId": "jazz-social-app",
  "storageBucket": "jazz-social-app.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc..."
}
```

---

## **TESTING CHECKLIST**

After deployment:

- [ ] Visit your live frontend URL
- [ ] Create a new account
- [ ] Upload a profile picture
- [ ] Create a post with an image
- [ ] Send a chat message
- [ ] Add a friend
- [ ] Check the database in Supabase

---

## **TROUBLESHOOTING**

**Database Connection Error**
- Verify DATABASE_URL is correct
- Check Supabase IP whitelist allows Render's IPs
- Test connection locally first

**Frontend Can't Connect to API**
- Verify NEXT_PUBLIC_API_URL matches your Render service URL
- Check CORS settings in NestJS backend
- Verify environment variables are set in Render

**Firebase Auth Not Working**
- Verify Firebase config keys are correct
- Check Firebase Authentication is enabled
- Verify Google as provider is configured

---

## **FILE STRUCTURE**

```
Jazz/
├── apps/
│   ├── api/           # NestJS backend
│   │   └── .env.production
│   ├── socket/        # WebSocket server
│   └── web/           # Next.js frontend
│       └── .env.production
├── packages/
│   ├── types/         # TypeScript types
│   ├── ui/            # UI components
│   └── utils/         # Shared utilities
└── jazz-app.zip       # Deployment package
```

---

## **SUPPORT DOCS**

- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs
- Next.js Docs: https://nextjs.org/docs
- NestJS Docs: https://docs.nestjs.com

---

**You're all set! Ready to deploy?** 🚀