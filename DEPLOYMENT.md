# 🚀 Jazz App - Deploy to Render.com

## Step-by-Step Deployment Guide

### 1. **Create Render Account**
- Go to https://render.com
- Sign up with GitHub (recommended for easy repo connection)

### 2. **Create PostgreSQL Database**
- In Render dashboard, click "New" → "PostgreSQL"
- Name: `jazz-db`
- Database: `jazz_prod`
- User: `jazz_user`
- Click "Create Database"
- **Copy the connection string** (looks like: `postgresql://jazz_user:password@host:5432/jazz_prod`)

### 3. **Deploy the Backend API**
- In Render dashboard, click "New" → "Web Service"
- Connect your GitHub repo: `your-username/jazz`
- **Service Settings**:
  - **Name**: `jazz-api`
  - **Runtime**: `Node`
  - **Build Command**: `chmod +x apps/api/render-build.sh && ./apps/api/render-build.sh`
  - **Start Command**: `cd apps/api && npm run start:prod`

- **Environment Variables** (add these):
  ```
  NODE_ENV=production
  DATABASE_URL=postgresql://jazz_user:password@host:5432/jazz_prod  # From step 2
  JWT_SECRET=your-super-secret-jwt-key-here  # Generate a random string
  FIREBASE_PROJECT_ID=hakhy-chat
  FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@hakhy-chat.iam.gserviceaccount.com
  ```

- Click "Create Web Service"
- Wait for deployment (5-10 minutes)

### 4. **Get Firebase Service Account Key**
- Go to [Firebase Console](https://console.firebase.google.com)
- Select your project: `hakhy-chat`
- Go to Project Settings → Service Accounts
- Click "Generate new private key"
- Download the JSON file
- Copy the `private_key` and `client_email` values

### 5. **Update Environment Variables**
- In Render dashboard, go to your `jazz-api` service
- Go to "Environment"
- Update `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL` with values from step 4

### 6. **Run Database Migrations**
- In Render, go to your database service
- Click "Shell" tab
- Run: `cd apps/api && npm run prisma:migrate`
- Or run migrations manually if needed

### 7. **Update Frontend for Production**
- In your Firebase project, set environment variable:
  ```
  NEXT_PUBLIC_API_URL=https://jazz-api.onrender.com
  ```
- Redeploy frontend: `firebase deploy --only hosting`

### 8. **Test the Deployment**
- Frontend: https://hakhy-chat.web.app
- Backend: https://jazz-api.onrender.com
- Test login, feed upload, chat, etc.

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Make sure all dependencies are in package.json
- Verify Prisma schema is correct

### Database Connection Issues
- Check DATABASE_URL format
- Ensure database is running
- Run `npm run prisma:generate` in build

### CORS Issues
- Backend has `app.enableCors({ origin: true, credentials: true })`
- Should work with any frontend origin

### Firebase Upload Issues
- Check FIREBASE_PRIVATE_KEY format (should include \n for line breaks)
- Verify storage rules allow uploads

## 🎯 Success Checklist
- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Backend deployed successfully
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Frontend NEXT_PUBLIC_API_URL updated
- [ ] Frontend redeployed
- [ ] Test login/register
- [ ] Test feed upload
- [ ] Test chat functionality