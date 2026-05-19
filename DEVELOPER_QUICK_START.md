# 👨‍💻 DEVELOPER QUICK START GUIDE

Quick reference for developers joining HR-NEXUS project.

---

## 📋 TABLE OF CONTENTS

1. [Project Setup](#project-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Firebase Integration](#firebase-integration)
5. [Creating Components](#creating-components)
6. [Creating Pages](#creating-pages)
7. [Adding Routes](#adding-routes)
8. [Working with Firebase](#working-with-firebase)
9. [Styling with Tailwind](#styling-with-tailwind)
10. [Common Tasks](#common-tasks)
11. [Git Workflow](#git-workflow)
12. [Best Practices](#best-practices)

---

## 🚀 PROJECT SETUP

### First Time Setup (5 minutes)

```bash
# 1. Clone repository (if not already done)
git clone https://github.com/yourcompany/hr-nexus.git
cd hr-nexus

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm start

# 4. Open in browser
# Automatically opens http://localhost:3000
```

### Verify Installation

```bash
# Check Node version (14+ required)
node --version

# Check npm version (6+ required)
npm --version

# Check installed packages
npm list | head -20

# Run tests
npm test

# Build for production
npm run build
```

---

## 📁 PROJECT STRUCTURE

```
hr-nexus/
├── public/                           # Static assets
│   ├── index.html                   # Main HTML
│   ├── manifest.json                # PWA config
│   └── robots.txt                   # SEO
│
├── src/
│   ├── index.js                     # App entry point
│   ├── App.js                       # Root component (140+ lines, 25+ routes)
│   ├── App.css                      # Global styles
│   │
│   ├── context/                     # State Management
│   │   ├── AuthContext.js          # Authentication state
│   │   └── UserContext.js          # User data state
│   │
│   ├── components/                  # Reusable components
│   │   ├── Navbar/Navbar.js        # Top navigation
│   │   ├── Sidebar/Sidebar.js      # Side menu
│   │   ├── Charts/EmployeeChart.js # Chart.js component
│   │   ├── Forms/FileUpload.js     # File upload component
│   │   ├── Tables/                 # Table components
│   │   └── Cards/                  # Card components
│   │
│   ├── pages/                       # Application pages (22 pages)
│   │   ├── Auth/                   # Login, Register, etc. (3 pages)
│   │   ├── Dashboard/              # Dashboard board (1 page)
│   │   ├── Employees/              # Employee management (3 pages)
│   │   ├── Attendance/             # Attendance system (2 pages)
│   │   ├── Leave/                  # Leave management (3 pages)
│   │   ├── Payroll/                # Payroll system (2 pages)
│   │   ├── Departments/            # Department mgmt (2 pages)
│   │   ├── Recruitment/            # Recruitment (3 pages)
│   │   ├── Reports/                # Reports module (3 pages)
│   │   └── Settings/               # User settings (1 page)
│   │
│   ├── firebase/                    # Firebase services (7 files, 70+ functions)
│   │   ├── firebaseConfig.js       # Firebase initialization
│   │   ├── authService.js          # Authentication (8 functions)
│   │   ├── employeeService.js      # Employees (8 functions)
│   │   ├── attendanceService.js    # Attendance (8 functions)
│   │   ├── leaveService.js         # Leaves (10 functions)
│   │   ├── payrollService.js       # Payroll (6 functions)
│   │   ├── departmentService.js    # Departments (6 functions)
│   │   └── recruitmentService.js   # Recruitment (6 functions)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js              # Authentication hook
│   │   └── useFirestore.js         # Firestore data hook
│   │
│   ├── utils/                       # Utility functions (26 functions)
│   │   ├── formatDate.js           # Date formatting (7 functions)
│   │   ├── calculateSalary.js      # Salary calculations (8 functions)
│   │   └── helpers.js              # General helpers (11 functions)
│   │
│   ├── routes/                      # Routing config
│   │   ├── routes.js               # Route definitions
│   │   └── PrivateRoute.js         # Protected route component
│   │
│   ├── assets/                      # Images and icons
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   └── setupTests.js                # Jest configuration
│
├── database/                        # Database documentation
│   └── firestore-schema.md         # Firestore schema (9 collections)
│
├── docs/                            # Project documentation (11 files)
│   ├── QUICK_START.md
│   ├── PRODUCTION_DEPLOYMENT_GUIDE.md
│   ├── FIREBASE_ANALYSIS_&_CONFIG.md
│   ├── API_DOCUMENTATION.md
│   ├── USER_MANUAL.md
│   ├── TROUBLESHOOTING_GUIDE.md
│   └── [more...]
│
├── package.json                     # Dependencies (14 packages)
├── README.md                        # Project overview
└── .gitignore                       # Git ignore rules
```

---

## 💻 DEVELOPMENT WORKFLOW

### Daily Development Flow

```bash
# Morning: Get latest code
git pull origin main

# Start development server
npm start

# Make your changes in src/

# Save files - hot reload happens automatically

# Test locally: http://localhost:3000

# When done, commit and push
git add .
git commit -m "your message"
git push origin your-branch
```

### Useful Commands

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Install new package
npm install package-name --save

# Install dev dependency
npm install package-name --save-dev

# Check for outdated packages
npm outdated

# Update all packages
npm update
```

---

## 🔥 FIREBASE INTEGRATION

### Firebase Configuration

**File**: `src/firebase/firebaseConfig.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCN3EXWYuaXgJWhJ_VjbS3DIHGkQvaubxE",
  authDomain: "hr-nexus-7cd0b.firebaseapp.com",
  projectId: "hr-nexus-7cd0b",
  storageBucket: "hr-nexus-7cd0b.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Using Auth Service

```javascript
import { loginUser, registerUser, logout } from './firebase/authService';

// Login
const result = await loginUser('user@company.com', 'password');
if (result.success) {
  console.log('Logged in:', result.user);
}

// Register
const regResult = await registerUser(
  'newuser@company.com',
  'SecurePass123',
  { name: 'John Doe', department: 'HR' }
);

// Logout
await logout();
```

### Using Employee Service

```javascript
import { addEmployee, getEmployees, updateEmployee } from './firebase/employeeService';

// Get all employees
const employees = await getEmployees();

// Get employees by department
const hrEmployees = await getEmployees('hr');

// Add new employee
const newEmp = await addEmployee({
  name: 'Jane Doe',
  email: 'jane@company.com',
  department: 'HR',
  position: 'HR Manager',
  joinDate: new Date(),
  salary: { basic: 50000, hra: 15000, da: 10000 }
});

// Update employee
await updateEmployee(empId, { phone: '123-456-7890' });
```

---

## ⚛️ CREATING COMPONENTS

### Component Template

```jsx
// src/components/MyComponent/MyComponent.js
import React from 'react';
import './MyComponent.css'; // Or Tailwind classes

const MyComponent = ({ prop1, prop2, onAction }) => {
  const handleClick = () => {
    onAction();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">{prop1}</h2>
      <p className="text-gray-600 mb-4">{prop2}</p>
      <button 
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Click Me
      </button>
    </div>
  );
};

export default MyComponent;
```

### Component with State

```jsx
import React, { useState } from 'react';

const FormComponent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default FormComponent;
```

---

## 📄 CREATING PAGES

### Page Template

```jsx
// src/pages/MyModule/MyPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFirestore } from '../../hooks/useFirestore';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';

const MyPage = () => {
  const { user } = useAuth();
  const { loading, data } = useFirestore('collectionName');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Page Title</h1>
            
            {/* Your content here */}
            <div className="grid grid-cols-3 gap-6">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded shadow">
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
```

---

## 🛣️ ADDING ROUTES

### Update App.js

```jsx
// src/App.js - Add to routes array
import PrivateRoute from './routes/PrivateRoute';
import MyNewPage from './pages/MyModule/MyPage';

// Inside App component's JSX:
<Routes>
  {/* ... existing routes ... */}
  
  <Route 
    path="/my-module" 
    element={<PrivateRoute><MyNewPage /></PrivateRoute>} 
  />
</Routes>
```

### Update Sidebar Navigation

```jsx
// src/components/Sidebar/Sidebar.js - Add menu item
const navItems = [
  // ... existing items ...
  {
    name: 'My Module',
    icon: '📊', // Pick emoji or import icon
    links: [
      { name: 'My Page', path: '/my-module' }
    ]
  }
];
```

---

## 📝 WORKING WITH FIREBASE

### Read from Firestore

```javascript
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Get all documents
const getAllEmployees = async () => {
  const snapshot = await getDocs(collection(db, 'employees'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Query with filter
const getEmployeesByDept = async (dept) => {
  const q = query(
    collection(db, 'employees'),
    where('department', '==', dept)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Write to Firestore

```javascript
import { addDoc, setDoc, collection, doc } from 'firebase/firestore';

// Add new document
const addEmployee = async (data) => {
  const docRef = await addDoc(collection(db, 'employees'), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

// Set or update document
const updateEmployee = async (id, data) => {
  await setDoc(doc(db, 'employees', id), {
    ...data,
    updatedAt: new Date()
  }, { merge: true });
};
```

### Real-time Listeners

```javascript
import { onSnapshot } from 'firebase/firestore';

const subscribeToEmployees = (callback) => {
  return onSnapshot(collection(db, 'employees'), snapshot => {
    const employees = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(employees);
  });
};

// In component
useEffect(() => {
  const unsubscribe = subscribeToEmployees(setEmployees);
  return () => unsubscribe(); // Cleanup
}, []);
```

---

## 🎨 STYLING WITH TAILWIND

### Common Patterns

```jsx
// Container with padding
<div className="max-w-6xl mx-auto p-6">

// Grid layout
<div className="grid grid-cols-3 gap-6">

// Card styling
<div className="bg-white rounded-lg shadow p-4">

// Button styling
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">

// Text utilities
<h1 className="text-3xl font-bold text-gray-900">
<p className="text-sm text-gray-600">

// Spacing utilities
<div className="mt-6 mb-4 px-4 py-2">

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Form elements
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">

// Flexbox
<div className="flex justify-between items-center">
```

### Tailwind Documentation
Visit: https://tailwindcss.com/docs

---

## 🔧 COMMON TASKS

### Task: Add a new field to employee form

1. **Update employeeService.js**:
```javascript
// Add to types/validation
// Example: phone field validation
if (!data.phone || data.phone.length < 10) {
  return { success: false, error: 'Invalid phone' };
}
```

2. **Update AddEmployee.js page**:
```jsx
// Add to form JSX
<input 
  name="phone" 
  placeholder="Phone Number"
  value={formData.phone}
  onChange={handleChange}
  className="..."
/>
```

3. **Update Firestore schema**: `database/firestore-schema.md`

### Task: Create a new report

1. Create file: `src/pages/Reports/MyReport.js`
2. Add query function in appropriate service
3. Add route in `App.js`
4. Add sidebar link in `Sidebar.js`
5. Test at new URL

### Task: Add authentication to a page

```jsx
import { useAuth } from '../../hooks/useAuth';

const ProtectedPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Welcome {user.displayName}</div>;
};
```

---

## 📦 GIT WORKFLOW

### Creating a Feature Branch

```bash
# Update main branch
git pull origin main

# Create new branch
git checkout -b feature/my-feature

# Make changes, test locally
npm start

# Stage and commit changes
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/my-feature

# Create Pull Request on GitHub
# Wait for code review
# Merge when approved
```

### Common Commit Messages

```bash
git commit -m "feat: add new employee form"
git commit -m "fix: resolve login timeout issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: improve attendance query performance"
git commit -m "test: add unit tests for salary calculation"
```

---

## ✅ BEST PRACTICES

### Code Quality

✅ **DO:**
- Use descriptive variable names
- Add JSDoc comments for functions
- Handle errors gracefully
- Test before pushing
- Write reusable components
- Follow existing code style

❌ **DON'T:**
- Push broken code to main
- Leave console.log statements
- Ignore error messages
- Create massive components (>500 lines)
- Hardcode values (use constants)
- Commit node_modules

### Performance

✅ **DO:**
- Use pagination for large lists
- Implement React.memo for expensive components
- Use useCallback for event handlers
- Add loading states
- Optimize images
- Minimize re-renders

❌ **DON'T:**
- Fetch all data without pagination
- Create functions inside render
- Forget dependency arrays on useEffect
- Load large images uncompressed
- Block UI with async operations

### Security

✅ **DO:**
- Never hardcode credentials
- Validate user input
- Use Firebase security rules
- Keep dependencies updated
- Follow principle of least privilege
- Use environment variables for secrets

❌ **DON'T:**
- Store passwords in code
- Trust user input
- Allow anyone to read/write data
- Ignore security warnings
- Use admin SDK on client
- Expose API keys (they're public anyway with Firebase)

---

## 📚 HELPFUL RESOURCES

- **Documentation**: [docs/](docs/) folder (11 guide files)
- **API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Firestore Docs**: https://firebase.google.com/docs/firestore

---

**Developer Quick Start Guide**  
**Version**: 1.0  
**Last Updated**: March 16, 2026  
**Status**: Production Ready ✅
