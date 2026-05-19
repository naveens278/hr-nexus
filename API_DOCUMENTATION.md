# 📖 HR-NEXUS | API DOCUMENTATION

## Overview

Complete API documentation for all Firebase services in HR-NEXUS. All functions are async and return `{ success, data/error }` format.

---

## 🔐 Authentication Service

**File**: `src/firebase/authService.js`

### 1. `registerUser(email, password, userData)`
Creates new user account with profile

**Parameters:**
```javascript
{
  email: string,              // User email
  password: string,           // Min 6 chars
  userData: {
    name: string,             // Full name
    role: string,             // Optional: "admin" | "manager" | "employee"
    department: string,       // Optional: Department name
    phone: string            // Optional: Phone number
  }
}
```

**Returns:**
```javascript
{
  success: boolean,
  user: User object,
  error: string (on failure)
}
```

**Example:**
```javascript
const result = await registerUser(
  "john@company.com",
  "SecurePass123",
  { name: "John Doe", department: "HR" }
);
```

---

### 2. `loginUser(email, password)`
Authenticates user with email and password

**Parameters:**
```javascript
{
  email: string,
  password: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  user: User object,
  error: string (on failure)
}
```

---

### 3. `loginWithGoogle()`
Authenticates user with Google OAuth

**Parameters**: None

**Returns:**
```javascript
{
  success: boolean,
  user: User object,
  error: string (on failure)
}
```

---

### 4. `resetPassword(email)`
Sends password reset email

**Parameters:**
```javascript
{
  email: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 5. `updateUserProfile(user, updates)`
Updates user profile information

**Parameters:**
```javascript
{
  user: User object,
  updates: {
    displayName: string,        // Optional
    photoURL: string,           // Optional
    phone: string,              // Optional
    department: string          // Optional
  }
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 6. `logout()`
Signs out current user

**Parameters**: None

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

## 👥 Employee Service

**File**: `src/firebase/employeeService.js`

### 1. `addEmployee(employeeData)`
Creates new employee record

**Parameters:**
```javascript
{
  name: string,
  email: string,
  phone: string,
  department: string,
  position: string,
  joinDate: date,
  salary: {
    basic: number,
    hra: number,
    da: number
  }
}
```

**Returns:**
```javascript
{
  success: boolean,
  id: string (employee ID),
  error: string (on failure)
}
```

---

### 2. `getEmployees(departmentId = null)`
Fetches all employees or by department

**Parameters:**
```javascript
{
  departmentId: string (optional)
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: [
    {
      id: string,
      name: string,
      email: string,
      department: string,
      position: string,
      ...
    }
  ],
  error: string (on failure)
}
```

---

### 3. `getEmployee(employeeId)`
Fetches single employee details

**Parameters:**
```javascript
{
  employeeId: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: { id, name, email, ... },
  error: string (on failure)
}
```

---

### 4. `updateEmployee(employeeId, updates)`
Updates employee information

**Parameters:**
```javascript
{
  employeeId: string,
  updates: {
    name: string,
    phone: string,
    department: string,
    position: string,
    salary: { ... },
    ...
  }
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 5. `deleteEmployee(employeeId)`
Marks employee as inactive

**Parameters:**
```javascript
{
  employeeId: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 6. `searchEmployees(query)`
Searches employees by name, email, or department

**Parameters:**
```javascript
{
  query: string  // Search term
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: [ employees ],
  error: string (on failure)
}
```

---

### 7. `uploadProfilePicture(employeeId, file)`
Uploads profile picture to Firebase Storage

**Parameters:**
```javascript
{
  employeeId: string,
  file: File object  // From file input
}
```

**Returns:**
```javascript
{
  success: boolean,
  url: string (image URL),
  error: string (on failure)
}
```

---

### 8. `getEmployeeStats()`
Gets employee statistics

**Returns:**
```javascript
{
  success: boolean,
  data: {
    totalEmployees: number,
    activeEmployees: number,
    departmentCount: number,
    averageSalary: number
  },
  error: string (on failure)
}
```

---

## 📋 Attendance Service

**File**: `src/firebase/attendanceService.js`

### 1. `checkIn(employeeId, location = null)`
Records check-in for employee

**Parameters:**
```javascript
{
  employeeId: string,
  location: string (optional)
}
```

**Returns:**
```javascript
{
  success: boolean,
  id: string (attendance ID),
  message: string,
  error: string (on failure)
}
```

---

### 2. `checkOut(employeeId, location = null)`
Records check-out for employee

**Parameters:**
```javascript
{
  employeeId: string,
  location: string (optional)
}
```

**Returns:**
```javascript
{
  success: boolean,
  id: string,
  workingHours: number,
  error: string (on failure)
}
```

---

### 3. `getAttendanceRecord(employeeId, date)`
Gets attendance for specific date

**Parameters:**
```javascript
{
  employeeId: string,
  date: date  // Format: YYYY-MM-DD
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: {
    id: string,
    date: date,
    checkInTime: timestamp,
    checkOutTime: timestamp,
    status: string,
    workingHours: number
  },
  error: string (on failure)
}
```

---

### 4. `getAttendanceHistory(employeeId, startDate, endDate)`
Gets attendance records in date range

**Parameters:**
```javascript
{
  employeeId: string,
  startDate: date,
  endDate: date
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: [ attendance records ],
  error: string (on failure)
}
```

---

### 5. `markAttendance(employeeId, date, status)`
Manually marks attendance

**Parameters:**
```javascript
{
  employeeId: string,
  date: date,
  status: string  // "present" | "absent" | "leave" | "wfh"
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 6. `getAttendanceSummary(departmentId, date)`
Gets department attendance summary

**Parameters:**
```javascript
{
  departmentId: string,
  date: date
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: {
    present: number,
    absent: number,
    leave: number,
    wfh: number
  },
  error: string (on failure)
}
```

---

### 7. `getPresentCountToday()`
Gets count of present employees today

**Returns:**
```javascript
{
  success: boolean,
  data: number,
  error: string (on failure)
}
```

---

### 8. `getAttendance()`
Gets all attendance records (pagination recommended)

**Returns:**
```javascript
{
  success: boolean,
  data: [ all attendance records ],
  error: string (on failure)
}
```

---

## 📅 Leave Service

**File**: `src/firebase/leaveService.js`

### 1. `applyLeave(leaveData)`
Submits leave request

**Parameters:**
```javascript
{
  employeeId: string,
  leaveType: string,      // "PL" | "CL" | "SL"
  startDate: date,
  endDate: date,
  reason: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  id: string (leave ID),
  error: string (on failure)
}
```

---

### 2. `getLeaveRequestsForApproval(managerId)`
Gets pending leaves for manager

**Parameters:**
```javascript
{
  managerId: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: [ leave requests ],
  error: string (on failure)
}
```

---

### 3. `approveLeave(leaveId, managerId, comments = "")`
Approves leave request

**Parameters:**
```javascript
{
  leaveId: string,
  managerId: string,
  comments: string (optional)
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 4. `rejectLeave(leaveId, reason)`
Rejects leave request

**Parameters:**
```javascript
{
  leaveId: string,
  reason: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 5. `getLeaveHistory(employeeId)`
Gets employee's leave history

**Parameters:**
```javascript
{
  employeeId: string
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: [ leave records ],
  error: string (on failure)
}
```

---

### 6. `getLeaveBalance(employeeId, year)`
Gets leave balance for specific year

**Parameters:**
```javascript
{
  employeeId: string,
  year: number  // e.g., 2026
}
```

**Returns:**
```javascript
{
  success: boolean,
  data: {
    pl: number,      // Paid leave
    cl: number,      // Casual leave
    sl: number,      // Sick leave
    plUsed: number,
    clUsed: number,
    slUsed: number
  },
  error: string (on failure)
}
```

---

### 7. `updateLeaveBalance(employeeId, year, leaveType, days)`
Updates leave balance

**Parameters:**
```javascript
{
  employeeId: string,
  year: number,
  leaveType: string,  // "pl" | "cl" | "sl"
  days: number
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 8. `initializeLeaveBalance(employeeId, year)`
Creates leave balance for new year

**Parameters:**
```javascript
{
  employeeId: string,
  year: number
}
```

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  error: string (on failure)
}
```

---

### 9. `getPendingLeaveCount()`
Gets count of pending leave requests

**Returns:**
```javascript
{
  success: boolean,
  data: number,
  error: string (on failure)
}
```

---

### 10. `getLeaves()`
Gets all leave requests

**Returns:**
```javascript
{
  success: boolean,
  data: [ all leaves ],
  error: string (on failure)
}
```

---

## 💰 Payroll Service

**File**: `src/firebase/payrollService.js`

### Documentation Template
Similar structure for remaining services...

### Key Functions:
- `calculateSalary(basicSalary, hra, da, deductions)`
- `processSalary(employeeId, month, salaryData)`
- `generatePayslip(payrollId)`
- `getSalaryHistory(employeeId)`
- `getPayrollReport(month)`
- `updatePayrollStatus(payrollId, status)`

---

## 🏢 Department Service

**File**: `src/firebase/departmentService.js`

- `addDepartment(departmentData)`
- `getDepartments()`
- `getDepartment(departmentId)`
- `updateDepartment(departmentId, updates)`
- `deleteDepartment(departmentId)`
- `assignEmployeeToDepartment(employeeId, departmentId)`

---

## 👔 Recruitment Service

**File**: `src/firebase/recruitmentService.js`

- `postJob(jobData)`
- `getJobs(status = "open")`
- `addApplicant(applicantData)`
- `getApplicants(jobId)`
- `scheduleInterview(interviewData)`
- `getInterviews()`

---

## 🔧 Utility Functions

**File**: `src/utils/`

### formatDate.js
```javascript
formatDate(date)              // DD-MM-YYYY
formatDateTime(date)          // DD-MM-YYYY HH:MM
formatTime(date)              // HH:MM:SS
formatDateLong(date)          // Long format
getCurrentMonthYear()         // MM/YYYY
getMonthYear(date)            // MM/YYYY
getDayOfWeek(date)            // Day name
```

### calculateSalary.js
```javascript
calculateNetSalary(basic, hra, da, ta, deductions)
calculatePF(salary)           // 12%
calculateTax(salary)          // Based on slabs
calculateHRA(salary)          // 50%
calculateDA(salary)           // 50%
calculateOvertime(rate, hours) // 1.5x rate
calculateBonus(salary, percent)
calculateGrossSalary(basic, hra, da, ta)
```

### helpers.js
```javascript
validateEmail(email)
validatePhone(phone)
validatePassword(password)
validatePasswordStrength(password)
validateAadhar(aadhar)
validatePAN(pan)
capitalizeFirstLetter(str)
truncateText(text, length)
generateId()
formatCurrency(amount)
```

---

## 📡 Response Format

All services follow this format:

### Success Response
```javascript
{
  success: true,
  data: { /* result data */ },
  message: "Operation successful"
}
```

### Error Response
```javascript
{
  success: false,
  error: "Error message",
  message: "Operation failed"
}
```

---

## 🔑 Authentication Header

All requests automatically include:
```javascript
Authorization: Bearer {firebase-token}
```

Managed by Firebase SDK automatically.

---

## ⚡ Rate Limiting

Firestore limits (per user):
- Reads: 1 per second (soft limit)
- Writes: 1 per second (soft limit)
- Use batch operations for bulk updates

---

## 🐛 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| auth/user-not-found | Invalid email | Check email format |
| auth/wrong-password | Incorrect password | Verify password |
| permission-denied | No access | Check security rules |
| not-found | Document doesn't exist | Verify ID |
| unavailable | Service temporarily down | Retry later |

---

## 📚 Examples

### Register and Login
```javascript
import { registerUser, loginUser } from './firebase/authService';

// Register
const result = await registerUser(
  "user@company.com",
  "Password123",
  { name: "John", department: "IT" }
);

if (result.success) {
  // Then login
  const loginResult = await loginUser("user@company.com", "Password123");
}
```

### Add and Get Employee
```javascript
import { addEmployee, getEmployees } from './firebase/employeeService';

// Add
const addResult = await addEmployee({
  name: "Jane Doe",
  email: "jane@company.com",
  department: "HR",
  position: "HR Manager",
  joinDate: new Date(),
  salary: { basic: 50000, hra: 15000, da: 10000 }
});

// Get all
const getResult = await getEmployees();
console.log(getResult.data);
```

### Check In and Get Record
```javascript
import { checkIn, getAttendanceRecord } from './firebase/attendanceService';

// Check in
const checkInResult = await checkIn("emp001");

// Get record
const recordResult = await getAttendanceRecord("emp001", "2026-03-16");
```

---

**API Version**: 1.0  
**Last Updated**: March 16, 2026  
**Status**: Production Ready ✅
