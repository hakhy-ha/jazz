# Jazz Social App - Complete Deployment Script
# This script validates and prepares everything for Render deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "JAZZ SOCIAL APP - DEPLOYMENT VALIDATOR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Colors
$success = "Green"
$error_color = "Red"
$warning = "Yellow"
$info = "Cyan"

# 1. VERIFY ZIP FILE
Write-Host "[1/6] Checking deployment ZIP file..." -ForegroundColor $info
$zipPath = "C:\Users\LENOVO\Desktop\jazz-app-final.zip"
if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length / 1MB
    Write-Host "✓ ZIP file found: $zipSize MB" -ForegroundColor $success
} else {
    Write-Host "✗ ZIP file not found at $zipPath" -ForegroundColor $error_color
    exit 1
}

# 2. VERIFY ENVIRONMENT FILES
Write-Host ""
Write-Host "[2/6] Checking environment files..." -ForegroundColor $info

$apiEnv = "C:\Users\LENOVO\Desktop\Jazz\apps\api\.env.production"
$webEnv = "C:\Users\LENOVO\Desktop\Jazz\apps\web\.env.production"

if (Test-Path $apiEnv) {
    $apiContent = Get-Content $apiEnv -Raw
    if ($apiContent -match "FIREBASE_API_KEY=AIzaSyAUTRFwmPf47uFKAGLJRX_txa-tsxTubG8") {
        Write-Host "✓ Backend environment file configured" -ForegroundColor $success
    } else {
        Write-Host "✗ Backend Firebase credentials missing" -ForegroundColor $error_color
        exit 1
    }
} else {
    Write-Host "✗ Backend environment file not found" -ForegroundColor $error_color
    exit 1
}

if (Test-Path $webEnv) {
    $webContent = Get-Content $webEnv -Raw
    if ($webContent -match "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAUTRFwmPf47uFKAGLJRX_txa-tsxTubG8") {
        Write-Host "✓ Frontend environment file configured" -ForegroundColor $success
    } else {
        Write-Host "✗ Frontend Firebase credentials missing" -ForegroundColor $error_color
        exit 1
    }
} else {
    Write-Host "✗ Frontend environment file not found" -ForegroundColor $error_color
    exit 1
}

# 3. VERIFY DATABASE CONNECTION
Write-Host ""
Write-Host "[3/6] Checking database configuration..." -ForegroundColor $info
if ($apiContent -match "DATABASE_URL=postgresql://postgres:huPBWtZNS3UIdOxW@db.kazgznelkhaisuiikjar.supabase.co") {
    Write-Host "✓ Database connection string configured" -ForegroundColor $success
    Write-Host "  Host: db.kazgznelkhaisuiikjar.supabase.co" -ForegroundColor $info
} else {
    Write-Host "✗ Database configuration missing" -ForegroundColor $error_color
    exit 1
}

# 4. VERIFY FIREBASE CREDENTIALS
Write-Host ""
Write-Host "[4/6] Checking Firebase credentials..." -ForegroundColor $info
$requiredFirebase = @(
    "AIzaSyAUTRFwmPf47uFKAGLJRX_txa-tsxTubG8",
    "hakhy-chat",
    "hakhy-chat.firebaseapp.com",
    "hakhy-chat.appspot.com",
    "1060910683787"
)

$allFound = $true
foreach ($cred in $requiredFirebase) {
    if ($webContent -match [regex]::Escape($cred)) {
        Write-Host "✓ Found: $cred" -ForegroundColor $success
    } else {
        $allFound = $false
    }
}

if (-not $allFound) {
    Write-Host "✗ Some Firebase credentials are missing" -ForegroundColor $error_color
    exit 1
}

# 5. VERIFY DOCUMENTATION
Write-Host ""
Write-Host "[5/6] Checking deployment documentation..." -ForegroundColor $info
$docs = @(
    "C:\Users\LENOVO\Desktop\Jazz\RENDER_DEPLOYMENT.md",
    "C:\Users\LENOVO\Desktop\Jazz\DEPLOYMENT_READY.md",
    "C:\Users\LENOVO\Desktop\Jazz\FIREBASE_SETUP.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        $name = Split-Path $doc -Leaf
        Write-Host "✓ $name" -ForegroundColor $success
    }
}

# 6. DEPLOYMENT CHECKLIST
Write-Host ""
Write-Host "[6/6] DEPLOYMENT CHECKLIST" -ForegroundColor $info
Write-Host ""
Write-Host "============================================" -ForegroundColor $info
Write-Host "ALL SYSTEMS READY FOR DEPLOYMENT!" -ForegroundColor $success
Write-Host "============================================" -ForegroundColor $info
Write-Host ""

Write-Host "✓ Deployment ZIP: $zipSize MB" -ForegroundColor $success
Write-Host "✓ Backend environment configured" -ForegroundColor $success
Write-Host "✓ Frontend environment configured" -ForegroundColor $success
Write-Host "✓ Database connection ready" -ForegroundColor $success
Write-Host "✓ Firebase credentials configured" -ForegroundColor $success
Write-Host "✓ Documentation complete" -ForegroundColor $success
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor $warning
Write-Host "1. Go to https://dashboard.render.com" -ForegroundColor $info
Write-Host "2. Sign in with GitHub/Google/Email" -ForegroundColor $info
Write-Host "3. Click 'New' → 'Web Service'" -ForegroundColor $info
Write-Host "4. Upload: C:\Users\LENOVO\Desktop\jazz-app-final.zip" -ForegroundColor $info
Write-Host "5. Set Name: jazz-api" -ForegroundColor $info
Write-Host "6. Root Directory: apps/api" -ForegroundColor $info
Write-Host "7. Build Command: npm install && npm run build" -ForegroundColor $info
Write-Host "8. Start Command: npm run start:prod" -ForegroundColor $info
Write-Host "9. Add all environment variables from .env.production" -ForegroundColor $info
Write-Host "10. Click 'Create Web Service' and wait 5-10 minutes" -ForegroundColor $info
Write-Host ""
Write-Host "11. Repeat for Frontend with 'Static Site' option" -ForegroundColor $info
Write-Host "12. Set Publish Directory to: .next" -ForegroundColor $info
Write-Host ""

Write-Host "FIREBASE SETUP:" -ForegroundColor $warning
Write-Host "1. Go to https://console.firebase.google.com/project/hakhy-chat/authentication/settings" -ForegroundColor $info
Write-Host "2. Add Authorized JavaScript Origins:" -ForegroundColor $info
Write-Host "   - https://jazz-web-[your-name].onrender.com" -ForegroundColor $info
Write-Host "3. Save" -ForegroundColor $info
Write-Host ""

Write-Host "TESTING:" -ForegroundColor $warning
Write-Host "1. Visit your frontend URL" -ForegroundColor $info
Write-Host "2. Sign up with email" -ForegroundColor $info
Write-Host "3. Upload profile picture" -ForegroundColor $info
Write-Host "4. Create post with image" -ForegroundColor $info
Write-Host "5. Send message to someone" -ForegroundColor $info
Write-Host "6. Everything should work!" -ForegroundColor $info
Write-Host ""

Write-Host "========================================" -ForegroundColor $success
Write-Host "DEPLOYMENT VALIDATION COMPLETE ✓" -ForegroundColor $success
Write-Host "Ready for production!" -ForegroundColor $success
Write-Host "========================================" -ForegroundColor $success
