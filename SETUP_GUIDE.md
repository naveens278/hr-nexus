# HR-NEXUS: Project Setup & Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Running Locally](#running-locally)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js**: v14 or higher
- **npm**: v6 or higher  
- **Git**: For version control
- **Firebase Account**: Free tier is sufficient
- **Google Developer Account**: For OAuth setup
- **Text Editor/IDE**: VS Code recommended

## Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd hr-nexus
```

### 2. Install Dependencies
```bash
npm install
```

Installation includes:
- react@19.2.4
- react-router-dom@7.13.1
- firebase@12.10.0
- tailwindcss@4.2.1
- chart.js@4.5.1
- react-chartjs-2@5.2.0
- And other dependencies

### 3. Verify Installation
```bash
npm list react firebase tailwindcss
```

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://firebase.google.com)
2. Click "Create Project"
3. Enter project name: `hr-nexus`
4. Accept Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
   - Check "Email/Password" under Sign-in method
   - Click Save
4. Enable **Google** provider
   - Click on Google
   - Add your project name
   - Provide support email
   - Add Authorized domains (later for production)
   - Save

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Production mode**
4. Choose region (closest to you)
5. Enable Firestore

### Step 4: Set Up Storage

1. Go to **Storage**
2. Click **Get Started**
3. Use default bucket
4. Select region
5. Done

### Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Under "Your apps", select Web app
3. Register app as `hr-nexus`
4. Copy the Firebase configuration

### Step 6: Create `.env.local` File

In project root, create `.env.local`:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=hr-nexus-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=hr-nexus-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=hr-nexus-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ Important**: Never commit `.env.local` to version control

### Step 7: Initialize Firestore Collections

Create initial collections in Firestore:

```
Collections to create:
- users (for admin/HR staff)
- employees
- departments  
- attendance
- leaves
- leaveBalance
- payroll
- recruitment/jobs
- recruitment/applicants
- recruitment/interviews
- audit_logs
```

Can be created automatically via app when first admin user registers.

### Step 8: Set Firestore Security Rules

1. Go to Firestore Database
2. Click **Rules** tab
3. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Admin access to all
    match /{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
    
    // HR/Admin access to employees
    match /employees/{document=**} {
      allow read: if request.auth.token.role in ["HR", "Admin"];
      allow write: if request.auth.token.role == "Admin";
    }
    
    // Attendance access
    match /attendance/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Public visitor access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

### Step 9: Set Storage Rules

1. Go to Storage
2. Click **Rules** tab
3. Replace with:

```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
    match /avatars/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

## Running Locally

### Start Development Server

```bash
npm start
```

This will:
- Compile React & JSX
- Start development server at `http://localhost:3000`
- Enable hot reload for file changes
- Open browser automatically

### Access Application

1. Open `http://localhost:3000` in browser
2. You should see login page
3. First user registration creates admin account automatically
4. Log in with credentials

### Development Tips

- **Hot Reload**: Changes auto-save and reload
- **React DevTools**: Install browser extension for React debugging
- **Firebase Emulator**: Can be used for testing without Firebase project
- **Network Tab**: Check API calls in browser DevTools

## Testing

### Run Tests

```bash
npm test
```

Tests use Jest and React Testing Library.

### Manual Testing Checklist

- [ ] User Registration works
- [ ] Email/Password Login works
- [ ] Google Login works
- [ ] Dashboard displays KPIs
- [ ] Can add new employee
- [ ] Can check in/out for attendance
- [ ] Can apply for leave
- [ ] Can approve leave
- [ ] Payroll calculates correctly
- [ ] Can generate reports
- [ ] Sidebar navigation works
- [ ] Mobile responsive layout works

## Deployment

### Option 1: Firebase Hosting (Recommended)

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Initialize Firebase Hosting

```bash
firebase login
firebase init hosting
```

Select:
- Use existing project: `hr-nexus`
- Public directory: `build`
- Configure as SPA: `Y`

#### Step 3: Build for Production

```bash
npm run build
```

Creates optimized `build/` folder.

#### Step 4: Deploy

```bash
firebase deploy
```

Gets deployed to:
```
https://hr-nexus-xxxxx.firebaseapp.com
https://hr-nexus-xxxxx.web.app
```

#### Step 5: Configure Custom Domain (Optional)

1. Go to Hosting in Firebase Console
2. Click **Connect Domain**
3. Do required verification
4. DNS records propagate (24-48 hours)

### Option 2: Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### Option 3: Netlify

1. Connect GitHub repository
2. Authorize Netlify
3. Configure build: `npm run build`
4. Deploy automatically

## Troubleshooting

### Issue: Firebase Config Not Found

**Error**: `firebase is not configured`

**Solution**:
```bash
# Check if .env.local exists
ls -la | grep env.local

# If missing, create it with Firebase credentials
# Restart development server
npm start
```

### Issue: Authentication Not Working

**Error**: `Sign-in failed` or `Anonymous user`

**Solution**:
1. Check `.env.local` has correct credentials
2. Verify Authentication is enabled in Firebase
3. Check Firestore security rules allow access
4. Clear browser cache: `Ctrl+Shift+Delete`
5. Check browser console for errors

### Issue: Dependencies Conflict

**Error**: `npm ERR! peer dep missing`

**Solution**:
```bash
# Update npm
npm install -g npm@latest

# Clean installation
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 Already in Use

**Error**: `Something is already running on port 3000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Issue: Build Fails

**Error**: Build error in terminal

**Solution**:
```bash
# Check for syntax errors
npm run lint   # If available

# Clear build cache
rm -rf build
npm run build

# Check console for specific error
```

## Environment Variables

### Development
- Used from `.env.local`
- Hot reload when changed
- Not committed to git

### Production
- Set in deployment platform
- Netlify: Netlify UI settings
- Vercel: Vercel UI settings
- Firebase: `.env.local` copy before deploy

## Performance Monitoring

### Development
```bash
npm run build -- --analyze
```

### Production
- Firebase Console → Analytics
- Monitor active users, events
- Check error logs in Console

## Database Backup

### Manual Backup

```bash
firebase firestore:export backup-[date]
```

### Automated Backups
- In Google Cloud Console
- Configure scheduled backups
- Set retention policy

## Security Checklist

- [ ] Firebase security rules reviewed
- [ ] `.env.local` not committed
- [ ] Custom domain configured
- [ ] HTTPS enabled (automatic)
- [ ] Database indexed for queries
- [ ] Rate limiting configured
- [ ] Two-factor auth considered

---

**Last Updated**: 2024
**Status**: Complete Setup Guide ✅
