# HR-NEXUS: Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Prerequisites
```bash
# Verify Node.js and npm are installed
node --version  # Should be v14 or higher
npm --version   # Should be v6 or higher
```

### Step 2: Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd hr-nexus

# Install dependencies
npm install
```

### Step 3: Firebase Setup

1. Go to [Firebase Console](https://firebase.google.com)
2. Create new project: `hr-nexus`
3. Enable **Authentication** (Email/Password, Google)
4. Create **Firestore Database** (Production mode)
5. Set up **Storage** for files

### Step 4: Configure `.env.local`

Create file `hr-nexus/.env.local`:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

**Where to find these?**
- Firebase Console → Project Settings → General tab
- Copy Web API section

### Step 5: Set Firestore Rules

In Firebase Console → Firestore Database → Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**

### Step 6: Run Application

```bash
npm start
```

Opens at: `http://localhost:3000`

### Step 7: Create Admin Account

1. Click **Create Account**
2. Fill in email, password, name
3. First user is automatically admin
4. Login with your credentials

## 🎯 What You Can Do Now

### Employee Management
- Add new employees
- View employee directory
- Search employees
- Upload profile pictures
- Manage salary components

### Attendance
- Check-in/out tracking
- View attendance history
- Generate reports

### Leave Management
- Apply for leave
- Track leave balance
- Manager approval system
- Leave history

### Payroll
- Automatic salary calculation
- Generate payslips
- Track payment status
- Payroll reports

### Departments
- Create departments
- Assign employees
- View department stats

### Recruitment
- Post job openings
- Track applicants
- Schedule interviews
- Manage hiring

### Reports
- Employee analytics
- Attendance reports
- Payroll analysis
- Department statistics

## 🚀 Deployment (Optional)

### Firebase Hosting (Free)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build for production
npm run build

# Deploy
firebase deploy
```

Your app will be live at:
```
https://YOUR_PROJECT.firebaseapp.com
```

### Alternative: Vercel or Netlify

1. Push to GitHub
2. Connect repository to Vercel/Netlify
3. Auto-deploys on every push

## 🐛 Troubleshooting

### Issue: "Firebase is not defined"
**Solution:**
```bash
# Check .env.local exists
ls -la | grep env.local

# Restart server
npm start
```

### Issue: Can't login
**Solution:**
1. Check Firebase Authentication is enabled
2. Verify Firestore Security Rules
3. Clear browser cache: `Ctrl+Shift+Delete`

### Issue: Port 3000 already in use
**Solution:**
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📱 Mobile Testing

Open on mobile devices:
```
http://YOUR_IP:3000
```

Find your IP:
```bash
# Mac/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

## 📚 Next Steps

1. **Customize** - Edit styles, colors, branding
2. **Add Data** - Populate with real employees, departments
3. **Configure** - Set up security rules properly
4. **Deploy** - Deploy to Firebase/Vercel
5. **Monitor** - Use Firebase Analytics

## 📖 Full Documentation

- [README.md](README.md) - Complete overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) - API reference
- [PROJECT_COMPLETION_REPORT.md](PROJECT_COMPLETION_REPORT.md) - What's included

## 💡 Tips & Tricks

### Development
```bash
# Format code
npm run format

# Check for errors
npm test

# Full build
npm run build
```

### Database
- Firestore data viewable in Firebase Console
- Realtime updates automatically
- Check `audit_logs` collection for activity

### Debugging
- Press `F12` for Developer Tools
- Check Network tab for API calls
- Console shows helpful error messages
- React DevTools browser extension helps

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✅ Checklist

- [ ] Node.js and npm installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] `.env.local` created with Firebase config
- [ ] Firebase Firestore Rules updated
- [ ] `npm start` works and shows login page
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Dashboard shows KPI cards

## 🎉 Ready to Go!

Your HR-NEXUS system is ready. Start by:

1. Adding employees
2. Setting up attendance
3. Creating departments
4. Posting jobs
5. Generating reports

**Need help?** Check documentation or examine source code - it's well-commented!

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Ready to Use ✅
