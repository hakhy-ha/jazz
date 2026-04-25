# 🚀 **QUICK DEPLOYMENT REFERENCE**

## **📋 WHAT YOU NEED RIGHT NOW**

### **Step 1: Get Firebase Credentials** (5 minutes)

Visit: https://console.firebase.google.com

Your Firebase config should look like:
```json
{
  "apiKey": "AIzaSy...",
  "authDomain": "jazz-xyz.firebaseapp.com",
  "projectId": "jazz-xyz",
  "storageBucket": "jazz-xyz.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abc..."
}
```

---

### **Step 2: Update Environment Files** (2 minutes)

**Edit `apps/api/.env.production`:**
Replace these placeholders with your actual Firebase values:
```
FIREBASE_API_KEY=YOUR_API_KEY
FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN.firebaseapp.com
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_BUCKET.appspot.com
FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
FIREBASE_APP_ID=YOUR_APP_ID
```

**Edit `apps/web/.env.production`:**
Replace these placeholders with your actual Firebase values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

---

### **Step 3: Deploy Backend to Render** (10-15 minutes)

1. Go to: https://dashboard.render.com
2. Click **New** → **Web Service**
3. Upload your code (use the existing `jazz-app.zip` or create new)
4. Fill in:
   ```
   Name: jazz-api
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```
5. Add environment variables from `.env.production`
6. Click **Create Web Service**
7. **Wait 5-10 minutes** for deployment
8. Copy the URL when ready (e.g., `https://jazz-api-xxx.onrender.com`)

---

### **Step 4: Deploy Frontend to Render** (10-15 minutes)

1. Go to: https://dashboard.render.com
2. Click **New** → **Static Site**
3. Upload your code
4. Fill in:
   ```
   Name: jazz-web
   Build Command: npm install && npm run build
   Publish Directory: .next or out
   ```
5. **Update `NEXT_PUBLIC_API_URL`** to match your backend URL
6. Add environment variables from `.env.production`
7. Click **Create Static Site**
8. **Wait 5-10 minutes** for deployment

---

### **Step 5: Configure Firebase** (5 minutes)

1. Go to Firebase Console → Authentication → Settings
2. Add your frontend domain to **Authorized JavaScript Origins**
3. Go to Storage → Rules
4. Update with the provided rules

---

## **⚡ TESTING YOUR DEPLOYMENT**

### **Quick Test Checklist**
```bash
# 1. Visit your frontend
https://jazz-web.onrender.com

# 2. Check home page loads
✓ No console errors
✓ Navigation visible

# 3. Try signing up
✓ Email signup works
✓ Google signup works
✓ Redirects to profile

# 4. Test profile features
✓ Can upload avatar
✓ Can update bio
✓ Data saves

# 5. Test feed
✓ Can create post
✓ Can upload image
✓ Post appears

# 6. Test chat
✓ Can add friends
✓ Can send messages
✓ Messages appear

# 7. Check database
Go to Supabase Console → check tables have data
```

---

## **🔧 UPDATING AFTER DEPLOYMENT**

If you need to make changes:

1. **Update code locally**
2. **Create new `jazz-app.zip`**
   ```powershell
   Compress-Archive -Path "C:\Users\LENOVO\Desktop\Jazz\*" -DestinationPath "C:\Users\LENOVO\Desktop\jazz-app.zip" -Force
   ```
3. **Go to Render dashboard**
4. **Select your service** (backend or frontend)
5. **Click "Deploy from Git"** or upload new ZIP
6. **Wait for deployment**

---

## **🆘 QUICK TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| Frontend blank page | Check `NEXT_PUBLIC_API_URL` matches backend URL |
| Auth not working | Verify domain in Firebase → Authentication → Authorized domains |
| Upload fails | Check Firebase Storage rules allow authenticated users |
| API 500 error | Check environment variables in Render backend service |
| Database connection error | Verify `DATABASE_URL` in backend environment |
| Can't sign in with Google | Check Firebase Google provider is enabled |

---

## **📊 MONITORING YOUR APP**

### **Render Dashboard**
- https://dashboard.render.com
- Check service status (green = working)
- View logs for errors
- Monitor resource usage

### **Firebase Console**
- https://console.firebase.google.com
- Check auth user count
- Monitor storage usage
- Review security rules

### **Supabase Console**
- https://supabase.com/dashboard
- Check database stats
- Monitor connection count
- Review activity logs

---

## **CRITICAL REMEMBER**

✅ **Backend URL** must be set in frontend as `NEXT_PUBLIC_API_URL`
✅ **All environment variables** must be added to Render services
✅ **Firebase domains** must include your actual frontend domain
✅ **Database connection** must work before frontend can work
✅ **Security rules** in Firebase must allow authenticated access

---

## **SUPPORT LINKS**

- Render Docs: https://render.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**You've got everything you need! 🎉**

1. Get Firebase credentials
2. Update `.env.production` files
3. Deploy to Render
4. Test your app!

Let's go! 🚀