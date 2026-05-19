# HR-NEXUS: Troubleshooting & Verification Guide

## ✅ Complete File Verification

### Essential Files Present

#### Firebase Services (7 files) ✅
```
src/firebase/
├── firebaseConfig.js                ✅ Configuration
├── authService.js                   ✅ Authentication (160 lines)
├── employeeService.js               ✅ Employee Management (140 lines)
├── attendanceService.js             ✅ Attendance Tracking (180 lines)
├── leaveService.js                  ✅ Leave Management (160 lines)
├── payrollService.js                ✅ Payroll Processing (190 lines)
├── departmentService.js             ✅ Department Operations (120 lines)
└── recruitmentService.js            ✅ Recruitment System (180 lines)
```

#### Custom Hooks (2 files) ✅
```
src/hooks/
├── useAuth.js                       ✅ Authentication hook
└── useFirestore.js                  ✅ Real-time data hook
```

#### Context Providers (2 files) ✅
```
src/context/
├── AuthContext.js                   ✅ Auth state management
└── UserContext.js                   ✅ User roles & permissions
```

#### Pages (22 files) ✅
```
src/pages/
├── Auth/(3)
│   ├── Login.js                     ✅ Email + Google login
│   ├── Register.js                  ✅ User registration
│   └── ForgotPassword.js            ✅ Password reset flow
├── Dashboard/(1)
│   └── Dashboard.js                 ✅ KPI cards + charts
├── Employees/(3)
│   ├── EmployeeList.js              ✅ Directory + CRUD
│   ├── AddEmployee.js               ✅ Add form
│   └── EmployeeProfile.js           ✅ Detail view
├── Attendance/(2)
│   ├── AttendancePage.js            ✅ Check-in/out
│   └── AttendanceReport.js          ✅ Reports
├── Leave/(3)
│   ├── LeaveApply.js                ✅ Application form
│   ├── LeaveHistory.js              ✅ History view
│   └── LeaveApproval.js             ✅ Manager approval
├── Payroll/(2)
│   ├── PayrollPage.js               ✅ Payroll processing
│   └── Payslip.js                   ✅ Payslip generation
├── Departments/(2)
│   ├── DepartmentList.js            ✅ Directory
│   └── AddDepartment.js             ✅ Add form
├── Recruitment/(3)
│   ├── JobPost.js                   ✅ Job postings
│   ├── Applicants.js                ✅ Applicant tracking
│   └── InterviewSchedule.js         ✅ Interview management
├── Reports/(3)
│   ├── EmployeeReport.js            ✅ Employee analytics
│   ├── AttendanceReport.js          ✅ Attendance analytics
│   └── PayrollReport.js             ✅ Payroll analytics
└── Settings/(1)
    └── SettingsPage.js              ✅ User preferences
```

#### Components (5+ files) ✅
```
src/components/
├── Charts/
│   └── EmployeeChart.js             ✅ Chart.js visualization
├── Forms/
│   └── FileUpload.js                ✅ Drag-drop upload
├── Navbar/
│   └── Navbar.js                    ✅ Enhanced nav bar
├── Sidebar/
│   └── Sidebar.js                   ✅ Advanced menu
├── Tables/                          ✅ Reusable tables
└── ErrorBoundary.js                 ✅ Error handling
```

#### Utilities (3 files) ✅
```
src/utils/
├── formatDate.js                    ✅ 7 date functions
├── calculateSalary.js               ✅ 8 salary functions
└── helpers.js                       ✅ 11 utility functions
```

#### Routes (2 files) ✅
```
src/routes/
├── PrivateRoute.js                  ✅ Route protection
└── routes.js                        ✅ Route definitions
```

#### Core Files ✅
```
src/
├── App.js                           ✅ Main router (25+ routes)
├── index.js                         ✅ With providers
├── App.css                          ✅ Styles
├── index.css                        ✅ Global styles
└── setupTests.js                    ✅ Test configuration
```

#### Public Files ✅
```
public/
├── index.html                       ✅ HTML entry
├── manifest.json                    ✅ PWA manifest
└── robots.txt                       ✅ SEO

```

#### Configuration Files ✅
```
├── package.json                     ✅ Dependencies configured
├── .env.local                       ⚠️ User needs to create
├── .env.example                     ✅ Template provided
└── .gitignore                       ✅ Git ignore rules
```

#### Documentation (5 files) ✅
```
├── README.md                        ✅ Complete overview
├── SETUP_GUIDE.md                   ✅ Installation guide
├── QUICKSTART.md                    ✅ Quick start
├── API_DOCUMENTATION.md             ✅ API reference
├── PROJECT_COMPLETION_REPORT.md     ✅ Final report
└── database/firestore-schema.md     ✅ Database schema
```

---

## 🔍 Verification Checklist

### 1. Project Structure ✅
```bash
cd hr-nexus
ls -la src/         # Should show all source folders
ls -la public/      # Should show HTML, manifest, robots
cat package.json    # Should have all dependencies
```

**Expected:**
- 40+ files
- Clear folder organization
- All dependencies listed

### 2. Firebase Setup ⚠️ (User does this)
```bash
# Check if .env.local exists
ls -la | grep .env.local    # Should show .env.local file

# Verify it has the right keys
cat .env.local              # Should have 7 Firebase variables
```

**Expected Variables:**
- REACT_APP_FIREBASE_API_KEY
- REACT_APP_FIREBASE_AUTH_DOMAIN
- REACT_APP_FIREBASE_PROJECT_ID
- REACT_APP_FIREBASE_STORAGE_BUCKET
- REACT_APP_FIREBASE_MESSAGING_SENDER_ID
- REACT_APP_FIREBASE_APP_ID
- REACT_APP_FIREBASE_MEASUREMENT_ID

### 3. Dependencies Installed ✅
```bash
npm list react                  # Should show v19.2.4
npm list react-router-dom       # Should show v7.13.1
npm list firebase               # Should show v12.10.0
npm list react-chartjs-2        # Should show v5.2.0
```

### 4. No Compilation Errors ✅
```bash
npm start       # Should start without errors
# Look for "Compiled successfully!" message
```

**Expected output:**
```
webpack compiled successfully
Compiled successfully!
Local: http://localhost:3000
```

### 5. Application Loading ✅
```
Open: http://localhost:3000
Expected: Login page appears
```

### 6. Authentication Works ✅
```
1. Click "Create Account"
2. Enter email, password, name
3. Should successfully register
4. Should be able to login
5. Should see Dashboard
```

### 7. Routes Work ✅
```
- /dashboard           ✅ Dashboard page loads
- /employees          ✅ Employee list loads
- /attendance         ✅ Attendance page loads
- /leave-apply        ✅ Leave form loads
- /payroll            ✅ Payroll page loads
- /departments        ✅ Departments page loads
- /job-post           ✅ Recruitment page loads
- /employee-report    ✅ Reports page loads
- /settings           ✅ Settings page loads
```

### 8. Real-time Data (Optional) ✅
```
Open DevTools → Go to Dashboard
Check: KPI cards update in real-time
Check: Charts render without console errors
```

---

## 🐛 Common Issues & Solutions

### Issue 1: ".env.local is not found"
**Error Message:**
```
firebase is not configured
Cannot read property 'projectId' of undefined
```

**Solution:**
1. Create file `.env.local` in project root
2. Copy template from `.env.example`
3. Fill in your Firebase credentials
4. Restart dev server: `npm start`

```bash
# Create from template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

---

### Issue 2: "Cannot find module"
**Error Message:**
```
Module not found: Can't resolve '../pages/Auth/Login'
```

**Solution:**
```bash
# Check file exists
ls -la src/pages/Auth/Login.js

# Verify spelling matches exactly
# Check capitalization
```

**Common typo patterns:**
- `login.js` (should be `Login.js`)
- `employeeList.js` (should be `EmployeeList.js`)
- Missing `.js` extension

---

### Issue 3: Firebase Authentication Fails
**Error Message:**
```
The operation couldn't be completed with error: Invalid API Key
```

**Solution:**
1. Verify `.env.local` has correct API key
2. Check API key has Firebase enabled in Google Cloud Console
3. Verify Firestore is created in Firebase
4. Check Authentication is enabled in Firebase Console

```bash
# Verify variables are loaded
echo $REACT_APP_FIREBASE_API_KEY
# Should print your API key (not empty)
```

---

### Issue 4: "Firestore permission denied"
**Error Message:**
```
Missing or insufficient permissions
```

**Solution:**
1. Go to Firebase Console
2. Firestore Database → Rules tab
3. Copy and paste entire rules:

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

4. Click "Publish"
5. Wait 30 seconds
6. Refresh application

---

### Issue 5: Port 3000 Already in Use
**Error Message:**
```
Something is already running on port 3000
```

**Solution:**

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm start
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

**Alternative - Use different port:**
```bash
PORT=3001 npm start
```

---

### Issue 6: Build Fails with Syntax Error
**Error Message:**
```
SyntaxError: Unexpected token
```

**Solution:**
```bash
# Check for obvious syntax errors
npm test -- --no-coverage

# Clear build cache
rm -rf node_modules/.cache
npm start

# Check specific file
grep -n "SyntaxError" output.log
```

---

### Issue 7: Styles Not Applying
**Error Message:**
Tailwind CSS classes not working, or no styling visible

**Solution:**
1. Check `index.css` has Tailwind imports:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. Check `tailwind.config.js` exists
3. Clear cache and rebuild:
```bash
rm -rf node_modules/.cache
npm run build
npm start
```

---

### Issue 8: Real-time Updates Not Working
**Error Message:**
Data doesn't update in real-time, stale data shown

**Solution:**
1. Ensure Firestore is writable (check rules)
2. Check DevTools Network tab:
   - Should show Firestore updates
   - Should see data stream
3. Check browser console for errors
4. Verify `useFirestore` hook is used correctly:

```javascript
const { data, loading, error } = useFirestore("collection", [
  ["field", "==", "value"]
]);
```

---

### Issue 9: Google Login Not Working
**Error Message:**
```
Popup closed by user or Login cancelled
```

**Solution:**
1. Verify Google OAuth is enabled in Firebase
2. Check Google credentials are correct
3. Add your domain to authorized redirect URIs:
   - Firebase Console → Authentication → Sign-in methods
   - Google provider → Authorized domains
   - Add `localhost:3000` for development
   - Add production domain when deploying

---

### Issue 10: File Upload Not Working
**Error Message:**
```
Storage upload failed or File size exceeds quota
```

**Solution:**
1. Check Firebase Storage is enabled
2. Update Storage security rules:

```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Check file size (default 5MB limit)
4. Verify `FileUpload.js` component is used correctly

---

## 🔧 Environment Setup Verification

### Node.js Check
```bash
node --version
# ✅ Should be v14 or higher

npm --version
# ✅ Should be v6 or higher
```

### Firebase CLI Check
```bash
firebase --version
# ✅ Should show version number
```

### Git Check
```bash
git --version
# ✅ Should show version number
```

---

## 🧪 Running Tests

### Unit Tests
```bash
npm test

# Run specific test file
npm test EmployeeList.test.js

# Run with coverage
npm test -- --coverage
```

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Logout works
- [ ] Password reset works
- [ ] Protected routes redirect to login

**Employee Management:**
- [ ] Add new employee
- [ ] View employee list
- [ ] Search employees
- [ ] Upload profile picture
- [ ] Update employee info
- [ ] Delete employee (if allowed)

**Attendance:**
- [ ] Check-in records time
- [ ] Check-out calculates hours
- [ ] Attendance history shows records
- [ ] Reports filter by month

**Leave:**
- [ ] Apply for leave
- [ ] Leave balance shows correctly
- [ ] Manager can approve
- [ ] Manager can reject
- [ ] Leave history tracks all

**Payroll:**
- [ ] Calculate salary shows correct breakdown
- [ ] Payslip generates
- [ ] Deductions calculated correctly
- [ ] Payroll reports show data

---

## 🚀 Pre-Deployment Checklist

- [ ] All files created successfully
- [ ] No console errors
- [ ] Authentication working (email + Google)
- [ ] Firebase connected and syncing
- [ ] CRUD operations complete
- [ ] Real-time updates working
- [ ] Responsive design tested
- [ ] All routes accessible
- [ ] Error boundaries functional
- [ ] Performance acceptable

---

## 📞 Getting Help

1. **Check Documentation**
   - [README.md](README.md)
   - [SETUP_GUIDE.md](SETUP_GUIDE.md)
   - [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

2. **Check Console Output**
   - Browser F12 → Console tab
   - Look for error messages
   - Check network tab for failed requests

3. **Check Source Code**
   - Many files are well-commented
   - Follow patterns in similar files
   - Check error handling implementations

4. **Firebase Debugging**
   - Firebase Console → Firestore
   - Check data structure
   - Review security rules
   - Check logs in Functions

---

## ✅ Final Verification

Once everything is working, you should see:

1. **Login page** loads by default
2. **Registration** creates new accounts
3. **Dashboard** shows KPI cards
4. **Navigation sidebar** works
5. **All pages** load without errors
6. **Data persists** in Firestore
7. **Real-time updates** work
8. **Responsive design** on mobile
9. **No console errors** in DevTools
10. **All 25+ routes** accessible

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Complete Verification Guide ✅

*For additional help, check the inline code comments - they're there to guide you!*
