# 🔧 TROUBLESHOOTING GUIDE

Complete troubleshooting and debugging guide for HR-NEXUS system.

---

## 📋 TABLE OF CONTENTS

1. [Installation Issues](#installation-issues)
2. [Login & Authentication](#login--authentication)
3. [Application Performance](#application-performance)
4. [Firebase Errors](#firebase-errors)
5. [Page & Feature Issues](#page--feature-issues)
6. [Network Issues](#network-issues)
7. [Data & Database](#data--database)
8. [Deployment Issues](#deployment-issues)
9. [Common Error Codes](#common-error-codes)
10. [Advanced Debugging](#advanced-debugging)

---

## 🛠️ INSTALLATION ISSUES

### npm install Fails

**Error**: `npm ERR! code ERESOLVE`

**Cause**: Version conflicts in dependencies

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps

# Start the app
npm start
```

---

### Cannot find module errors

**Error**: `Module not found: Can't resolve 'firebase'`

**Cause**: Firebase not installed

**Solution**:
```bash
# Install Firebase explicitly
npm install firebase --save

# Or for Firebase Admin SDK
npm install firebase-admin --save

# Verify installation
npm list firebase
```

---

### react-scripts not found

**Error**: `Cannot find module 'react-scripts'`

**Cause**: react-scripts not installed

**Solution**:
```bash
# Install react-scripts
npm install react-scripts --save-dev

# Verify version
npm list react-scripts

# Should be 5.0.1 or higher
```

---

### All imports failing

**Error**: Multiple module not found errors

**Solution** (Nuclear option):
```bash
# Remove everything
rm -r node_modules package-lock.json

# Reinstall from scratch
npm install

# Clear cache and restart
npm cache clean --force
npm start
```

---

## 🔐 LOGIN & AUTHENTICATION

### App won't load due to Firebase offline

**Error**: `Failed to get document because the client is offline`

**Cause**: Firestore trying to initialize before auth ready

**Solution** (Already Fixed):
- Check `src/App.js` line 35-50
- Verify `AuthContext.js` is not blocking with Firestore fetch
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh (Ctrl+F5)

---

### Login page takes 5+ seconds

**Error**: Long delay before login page appears

**Cause**: Async code blocking page render

**Solution**:
1. Check `src/context/AuthContext.js`
2. Verify setupAuth() is NOT using `await`
3. Confirm user state set immediately
4. Clear browser cache

**Check Code** (AuthContext.js):
```javascript
// ❌ WRONG - Blocks page load
await checkUserProfile(); // DON'T USE await

// ✅ CORRECT - Non-blocking
checkUserProfile().catch(err => console.log(err));
```

---

### Login returns error: "user-not-found"

**Error**: `auth/user-not-found`

**Cause**: Email not registered in Firebase

**Solution**:
1. Check email spelling
2. CAPS LOCK off
3. Use correct email
4. If new user, click "Register"
5. If forgot email, contact HR

---

### Login returns error: "wrong-password"

**Error**: `auth/wrong-password`

**Cause**: Incorrect password

**Solution**:
1. Verify CAPS LOCK is off
2. Check password carefully
3. Use password manager if available
4. Click "Forgot Password" to reset
5. Contact IT if still fails

---

### Cannot login with Google

**Error**: Google OAuth doesn't work or browser blocks popup

**Solution**:
1. **Pop-up blocking**: Allow popups for this site
   - Browser settings → Permissions → Popups
2. **Privacy mode**: Exit incognito/private browsing
3. **Cookies**: Enable third-party cookies
4. **Browser support**: Use Chrome/Edge/Firefox
5. **Google account**: Ensure Google account linked to email

---

### Session expires immediately after login

**Error**: Logged in but immediately logged out

**Cause**: Session storage issue or security rules block

**Solution**:
1. Clear browser cache completely
2. Clear cookies
3. Hard refresh (Ctrl+F5)
4. Try different browser
5. Check Firebase console for session issues

---

## ⚡ APPLICATION PERFORMANCE

### App runs slowly

**Symptoms**: Slow page navigation, delayed interactions

**Diagnosis**:
```bash
# Check laptop performance
# Open Developer Tools: F12
# Go to Performance tab
# Record page load
# Look for red bars (slow operations)
```

**Common Causes & Solutions**:

1. **Too many API calls**
   - Check Network tab (F12)
   - Look for duplicate requests
   - Implement request caching

2. **Unoptimized images**
   - Check public/images folder
   - Compress large images
   - Use WebP format

3. **Large Firebase queries**
   - Use pagination (limit 10-50 items)
   - Add indexes to collections
   - Query specific fields only

4. **Browser cache**
   ```bash
   # Clear all cache
   Ctrl+Shift+Del
   # Select "All Time"
   # Delete everything
   # Refresh page
   ```

---

### Page freezes or becomes unresponsive

**Cause**: JavaScript infinite loop or heavy computation

**Solution**:
1. Open Developer Tools (F12)
2. Go to Sources tab
3. Pause execution (Space key)
4. Look at call stack
5. Identify problematic function
6. Report to dev team with stack trace

---

### npm start takes too long

**Cause**: Webpack compilation slow

**Solution**:
```bash
# Kill current process
Ctrl+C

# Clear cache
rm -rf node_modules/.cache

# Disable source maps for faster builds
GENERATE_SOURCEMAP=false npm start

# On Windows:
set GENERATE_SOURCEMAP=false && npm start
```

---

## 🔥 FIREBASE ERRORS

### Firebase initialization error

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Cause**: Invalid Firebase credentials

**Solution**:
1. Check `src/firebase/firebaseConfig.js`
2. Verify all keys are present:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

3. Verify keys match Firebase Console
4. Ensure keys not expired
5. Contact Firebase support if keys invalid

---

### Firestore connection fails

**Error**: `failed to get document because the client is offline`

**Cause**: Firestore can't connect to database

**Solution**:
1. **Check internet**: Verify connection
2. **Clear offline cache**:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```
3. **Hard refresh**: Ctrl+F5
4. **Try incognito mode**: Ctrl+Shift+N
5. **Contact Firebase support** if persists

---

### Permission denied writing to Firestore

**Error**: `permission-denied`

**Cause**: Security rules block write access

**Solution**:
1. Check Firestore security rules (Firebase Console)
2. Verify user authenticated
3. Check collection path matches rules
4. Contact admin to update rules
5. Temporarily allow all access for debugging:
   ```javascript
   // TEMPORARY - Allow all reads/writes
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

---

### Firebase Storage upload fails

**Error**: `storage/unknown`

**Cause**: Upload permission denied or file too large

**Solution**:
1. **Check permissions**: Security rules allow write
2. **File size**: Max 100 MB recommended
3. **File format**: PNG, JPG, WebP supported
4. **Storage quota**: Check Firebase console for usage
5. **Try different file**: Test with smaller image

---

## 📄 PAGE & FEATURE ISSUES

### Page shows blank/white screen

**Cause**: Component rendering error

**Solution**:
1. Open Developer Tools (F12)
2. Check Console tab for errors
3. Look for red error messages
4. Get full error text and stack trace
5. Check component imports and syntax
6. Refresh page (F5)

---

### Form won't submit

**Cause**: Validation error or submit handler broken

**Symptoms**: Click submit but nothing happens

**Debug**:
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try form submit again
4. Check if request sent
5. Look for error response
6. Check Console for JavaScript errors

**Common Issues**:
- Required field empty (check validation)
- Form validation rejecting valid data
- Async operation not completing
- Firestore write failing

---

### Data not saving to database

**Cause**: Write permission denied or network issue

**Solution**:
1. Check browser console for errors
2. Verify user authenticated (logged in)
3. Check Firestore security rules
4. Verify network tab shows request sent
5. Check response in Network tab
6. Try again with valid data

---

### Images not loading

**Cause**: Image URL broken or file not found

**Solution**:
1. Check image file exists in `public/images/`
2. Verify correct path in code
3. Check file name spelling (case-sensitive)
4. Try different format (JPG vs PNG)
5. Clear browser cache (Ctrl+Shift+Del)
6. Hard refresh (Ctrl+F5)

---

### Chart.js charts not displaying

**Cause**: Chart library not initialized properly

**Solution**:
1. Verify Chart.js installed: `npm list chart.js`
2. Check component imports correct
3. Verify data passed to chart
4. Check canvas element exists in DOM
5. Refresh page
6. Try different browser

---

## 📡 NETWORK ISSUES

### API request times out

**Error**: Timeout after 30+ seconds

**Cause**: Network slow or server down

**Solution**:
1. Check internet connection
2. Test with different network (mobile hotspot?)
3. Check Firebase console status
4. Try different region endpoint
5. Wait and retry
6. Contact Firebase support if down

---

### CORS errors in browser console

**Error**: `Access to XMLHttpRequest... blocked by CORS policy`

**Cause**: Cross-origin requests blocked

**Note**: Firebase SDK handles CORS automatically

**Solution**:
1. If using custom API, check CORS headers
2. Firebase shouldn't trigger this error
3. Check browser extensions blocking requests
4. Disable browser extensions temporarily
5. Try incognito mode

---

### Connection refused error

**Error**: `Connection refused` or `Cannot reach server`

**Cause**: Backend/Firestore not accessible

**Solution**:
1. **Check internet**: Verify connection
2. **Check endpoints**: Verify URLs correct
3. **Check Firebase**: Console.firebase.google.com status
4. **Try VPN**: Some networks block Firebase
5. **Check firewall**: Corporate firewall blocks ports
6. **Wait**: Services might be down temporarily

---

## 💾 DATA & DATABASE

### Data appears but won't update

**Cause**: Real-time subscription not working

**Solution**:
1. Check `useFirestore` hook working
2. Verify dependency array in useEffect
3. Check Firestore rules allow read
4. Verify document/collection path correct
5. Refresh page to fetch fresh data
6. Check database has data

---

### Duplicate data appears

**Cause**: Multiple load operations running

**Solution**:
1. Check component renders twice (React strict mode)
2. Check useEffect dependencies
3. Verify cleanup function removes listeners
4. Check for multiple API calls in Network tab
5. Use React DevTools to check renders

---

### Data lost after refresh

**Cause**: Data stored in state only, not saved to database

**Solution**:
1. Verify data saved to Firestore
2. Check write operation completed
3. Refresh page and reload from Firestore
4. Check Firestore console for data
5. Verify save function calls Firebase service

---

### Firebase quota exceeded

**Error**: `Quota exceeded` or `Insufficient quota`

**Cause**: Too many database operations

**Solution**:
1. **Check usage**: Firebase console → Usage tab
2. **Reduce queries**: Implement pagination
3. **Batch operations**: Combine multiple writes
4. **Caching**: Store frequently accessed data locally
5. **Wait**: Limits reset at day boundary
6. **Upgrade plan**: Increase quota in Firebase

---

## 🚀 DEPLOYMENT ISSUES

### Build fails with errors

```bash
# Clear and rebuild
npm cache clean --force
rm -rf node_modules
npm install
npm run build

# Check for errors
npm run build -- --verbose
```

---

### Production app fails after deployment

**Solution**:
1. Check Firebase configuration in production environment
2. Verify environment variables set correctly
3. Check all Firebase services initialized
4. Review browser console for errors
5. Check Network tab for failed requests

---

### Firebase Hosting deploy fails

```bash
# Ensure Firebase CLI installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to specific project
firebase deploy --project hr-nexus-7cd0b
```

---

## 📊 COMMON ERROR CODES

| Code | Meaning | Solution |
|------|---------|----------|
| auth/user-not-found | Email not registered | Register account first |
| auth/wrong-password | Incorrect password | Check password, reset if needed |
| auth/weak-password | Password too weak | Use 8+ chars, uppercase, number, symbol |
| permission-denied | No access to resource | Contact admin, check rules |
| not-found | Document doesn't exist | Verify ID/path correct |
| unavailable | Service down | Wait and retry |
| invalid-api-key | Bad Firebase config | Check firebaseConfig.js |
| too-many-requests | Rate limit hit | Wait before retrying |

---

## 🔍 ADVANCED DEBUGGING

### Enable Debug Logging

```javascript
// In App.js or any page
import { enableLogging } from 'firebase/app';

enableLogging(true); // Very verbose logging
```

### Check Network Activity

1. Open Developer Tools (F12)
2. Go to Network tab
3. Perform action
4. Watch requests/responses
5. Check status codes:
   - 200 = Success
   - 400 = Bad request
   - 401 = Unauthorized
   - 403 = Forbidden
   - 404 = Not found
   - 500 = Server error

---

### React DevTools Debugging

1. Install React DevTools extension
2. Open DevTools (F12)
3. Go to "Components" tab
4. Inspect component tree
5. Check props and state
6. Watch for unnecessary re-renders

---

### Firebase Console Debugging

**Check** (firebase.google.com):
```
hr-nexus-7cd0b → 
├─ Firestore Database (data)
├─ Authentication (users)
├─ Storage (files)
├─ Rules (permissions)
├─ Usage (quotas)
└─ Logs (errors)
```

---

### Browser Console Commands

```javascript
// Check if user logged in
firebase.auth().currentUser

// Get current auth state
firebase.auth().onAuthStateChanged(user => console.log(user))

// Clear local storage
localStorage.clear()

// Clear Firebase cache
firebase.firestore().clearPersistence()

// Test Firestore connection
db.collection('test').add({test: true})
```

---

## 📞 GETTING HELP

### Information to Provide When Reporting Bug

1. **Error message** (exact text)
2. **Browser**: Chrome, Firefox, etc. (version)
3. **OS**: Windows, Mac, Linux
4. **Steps to reproduce**: 1. Click... 2. Type... 3. Error appears
5. **Screenshot/video**: If possible
6. **Browser console output**: F12 → Console tab
7. **Network activity**: F12 → Network tab

### Support Channels

- **Email**: support@company.com
- **Slack**: #hr-nexus-support
- **Ticket System**: Internal ticketing system
- **Response Time**: 2-4 hours typically

---

**Troubleshooting Guide**  
**Version**: 1.0  
**Last Updated**: March 16, 2026  
**Status**: Production Ready ✅
