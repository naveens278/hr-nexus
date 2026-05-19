# HR-NEXUS: Firebase Services API Documentation

## Table of Contents
1. [Authentication Service](#authentication-service)
2. [Employee Service](#employee-service)
3. [Attendance Service](#attendance-service)
4. [Leave Service](#leave-service)
5. [Payroll Service](#payroll-service)
6. [Department Service](#department-service)
7. [Recruitment Service](#recruitment-service)
8. [Custom Hooks](#custom-hooks)
9. [Error Handling](#error-handling)

---

## Authentication Service

Location: `src/firebase/authService.js`

### Functions

#### `registerUser(email, password, displayName)`
Creates new user account with Firebase Auth.

**Parameters:**
- `email` (string): User email
- `password` (string): User password (min 6 chars)
- `displayName` (string): User's full name

**Returns:**
```javascript
{
  success: true,
  user: { uid, email, displayName },
  error: null
}
```

**Example:**
```javascript
const result = await registerUser("user@example.com", "password123", "John Doe");
if (result.success) {
  console.log("User registered:", result.user.uid);
}
```

#### `loginUser(email, password)`
Authenticates user with email and password.

**Parameters:**
- `email` (string): User email
- `password` (string): User password

**Returns:**
```javascript
{
  success: true,
  user: { uid, email, displayName },
  error: null
}
```

**Example:**
```javascript
const result = await loginUser("user@example.com", "password123");
if (result.success) {
  console.log("Login successful");
}
```

#### `googleLogin()`
Initiates Google OAuth login flow.

**Returns:**
```javascript
{
  success: true,
  user: { uid, email, displayName, photoURL },
  error: null
}
```

**Example:**
```javascript
const result = await googleLogin();
if (result.success) {
  // Redirect to dashboard
}
```

#### `resetPassword(email)`
Sends password reset email.

**Parameters:**
- `email` (string): User email

**Returns:**
```javascript
{
  success: true,
  message: "Password reset email sent",
  error: null
}
```

**Example:**
```javascript
const result = await resetPassword("user@example.com");
if (result.success) {
  alert("Check your email for reset link");
}
```

#### `logoutUser()`
Signs out current user.

**Returns:**
```javascript
{
  success: true,
  error: null
}
```

**Example:**
```javascript
await logoutUser();
```

#### `getUserData(uid)`
Retrieves user profile from Firestore.

**Parameters:**
- `uid` (string): User ID

**Returns:**
```javascript
{
  success: true,
  data: { uid, email, role, department, ... },
  error: null
}
```

**Example:**
```javascript
const result = await getUserData("user123");
if (result.success) {
  console.log(result.data);
}
```

---

## Employee Service

Location: `src/firebase/employeeService.js`

### Functions

#### `addEmployee(employeeData)`
Creates new employee record.

**Parameters:**
```javascript
{
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  department: string,
  position: string,
  baseSalary: number,
  dateOfJoining: timestamp,
  dateOfBirth: timestamp,
  address: string,
  // ... other fields
}
```

**Returns:**
```javascript
{
  success: true,
  employeeId: string,
  error: null
}
```

**Example:**
```javascript
const result = await addEmployee({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "9876543210",
  department: "IT",
  position: "Developer",
  baseSalary: 60000,
  dateOfJoining: new Date(),
  dateOfBirth: new Date("1990-01-15"),
  address: "123 Main St"
});
```

#### `getEmployees(limit = 100)`
Fetches all employees (with limit).

**Parameters:**
- `limit` (number): Max records to fetch

**Returns:**
```javascript
{
  success: true,
  data: [ { id, ...employeeData }, ... ],
  error: null
}
```

**Example:**
```javascript
const result = await getEmployees(50);
if (result.success) {
  console.log("Total employees:", result.data.length);
}
```

#### `getEmployeeById(employeeId)`
Fetches single employee by ID.

**Parameters:**
- `employeeId` (string): Employee ID

**Returns:**
```javascript
{
  success: true,
  data: { id, ...employeeData },
  error: null
}
```

**Example:**
```javascript
const result = await getEmployeeById("emp123");
if (result.success) {
  console.log(result.data);
}
```

#### `updateEmployee(employeeId, updates)`
Updates employee record.

**Parameters:**
- `employeeId` (string): Employee ID
- `updates` (object): Fields to update

**Returns:**
```javascript
{ success: true, error: null }
```

**Example:**
```javascript
await updateEmployee("emp123", {
  phone: "9876543211",
  position: "Senior Developer"
});
```

#### `deleteEmployee(employeeId)`
Deletes employee record (soft delete recommended).

**Parameters:**
- `employeeId` (string): Employee ID

**Returns:**
```javascript
{ success: true, error: null }
```

#### `searchEmployees(query)`
Searches employees by name or email.

**Parameters:**
- `query` (string): Search term

**Returns:**
```javascript
{
  success: true,
  data: [ { id, ...employeeData }, ... ],
  error: null
}
```

**Example:**
```javascript
const result = await searchEmployees("john");
console.log("Found:", result.data);
```

---

## Attendance Service

Location: `src/firebase/attendanceService.js`

### Functions

#### `checkIn(employeeId, location)`
Records employee check-in.

**Parameters:**
- `employeeId` (string): Employee ID
- `location` (object): { latitude, longitude, address }

**Returns:**
```javascript
{
  success: true,
  recordId: string,
  error: null
}
```

**Example:**
```javascript
const result = await checkIn("emp123", {
  latitude: 40.7128,
  longitude: -74.0060,
  address: "Office Building"
});
```

#### `checkOut(employeeId, recordId)`
Records employee check-out.

**Parameters:**
- `employeeId` (string): Employee ID
- `recordId` (string): Attendance record ID

**Returns:**
```javascript
{
  success: true,
  workingHours: number,
  error: null
}
```

**Example:**
```javascript
const result = await checkOut("emp123", "record123");
console.log("Working hours:", result.workingHours);
```

#### `getAttendanceRecord(employeeId, date)`
Gets attendance for specific date.

**Parameters:**
- `employeeId` (string): Employee ID
- `date` (Date): Date to query

**Returns:**
```javascript
{
  success: true,
  data: { checkInTime, checkOutTime, workingHours, ... },
  error: null
}
```

#### `getAttendanceSummary(employeeId, month, year)`
Gets monthly attendance summary.

**Parameters:**
- `employeeId` (string): Employee ID
- `month` (number): Month (1-12)
- `year` (number): Year

**Returns:**
```javascript
{
  success: true,
  data: { totalDays, presentDays, absentDays, ... },
  error: null
}
```

---

## Leave Service

Location: `src/firebase/leaveService.js`

### Functions

#### `applyLeave(leaveData)`
Creates leave application.

**Parameters:**
```javascript
{
  employeeId: string,
  leaveType: "sick" | "casual" | "annual" | "maternity",
  startDate: timestamp,
  endDate: timestamp,
  reason: string,
  managerId: string
}
```

**Returns:**
```javascript
{
  success: true,
  leaveId: string,
  error: null
}
```

#### `getLeaveRequestsForApproval(managerId)`
Gets pending leave requests for manager.

**Parameters:**
- `managerId` (string): Manager user ID

**Returns:**
```javascript
{
  success: true,
  data: [ { id, employeeId, leaveType, ... }, ... ],
  error: null
}
```

#### `approveLeave(leaveId)`
Approves leave request.

**Parameters:**
- `leaveId` (string): Leave request ID

**Returns:**
```javascript
{
  success: true,
  error: null
}
```

#### `rejectLeave(leaveId, reason)`
Rejects leave request.

**Parameters:**
- `leaveId` (string): Leave request ID
- `reason` (string): Rejection reason

**Returns:**
```javascript
{
  success: true,
  error: null
}
```

#### `getLeaveBalance(employeeId, year)`
Gets leave balance for employee.

**Parameters:**
- `employeeId` (string): Employee ID
- `year` (number): Year

**Returns:**
```javascript
{
  success: true,
  data: {
    annual: { total, used, balance },
    sick: { total, used, balance },
    casual: { total, used, balance }
  },
  error: null
}
```

---

## Payroll Service

Location: `src/firebase/payrollService.js`

### Functions

#### `calculateSalary(employeeId, month, year)`
Calculates monthly salary with deductions.

**Parameters:**
- `employeeId` (string): Employee ID
- `month` (number): Month (1-12)
- `year` (number): Year

**Returns:**
```javascript
{
  success: true,
  data: {
    baseSalary: number,
    hra: number,
    da: number,
    allowances: number,
    grossSalary: number,
    pf: number,
    tax: number,
    totalDeductions: number,
    netSalary: number
  },
  error: null
}
```

#### `createPayroll(payrollData)`
Creates payroll record for employee.

**Parameters:**
```javascript
{
  employeeId: string,
  month: number,
  year: number,
  baseSalary: number,
  deductions: number,
  netSalary: number,
  status: "pending" | "processed" | "paid"
}
```

**Returns:**
```javascript
{
  success: true,
  payrollId: string,
  error: null
}
```

#### `generatePayslip(payrollId)`
Generates payslip for payroll record.

**Parameters:**
- `payrollId` (string): Payroll record ID

**Returns:**
```javascript
{
  success: true,
  payslipUrl: string,
  error: null
}
```

#### `getPayrollHistory(employeeId, limit = 12)`
Gets payroll history.

**Parameters:**
- `employeeId` (string): Employee ID
- `limit` (number): Number of records

**Returns:**
```javascript
{
  success: true,
  data: [ { id, month, year, netSalary, status }, ... ],
  error: null
}
```

---

## Department Service

Location: `src/firebase/departmentService.js`

### Functions

#### `addDepartment(departmentData)`
Creates new department.

**Parameters:**
```javascript
{
  name: string,
  managerId: string,
  description: string,
  budget: number
}
```

**Returns:**
```javascript
{
  success: true,
  departmentId: string,
  error: null
}
```

#### `getDepartments()`
Fetches all departments.

**Returns:**
```javascript
{
  success: true,
  data: [ { id, name, managerId, ... }, ... ],
  error: null
}
```

#### `updateDepartment(departmentId, updates)`
Updates department.

**Parameters:**
- `departmentId` (string): Department ID
- `updates` (object): Fields to update

**Returns:**
```javascript
{ success: true, error: null }
```

#### `getDepartmentEmployees(departmentId)`
Gets all employees in department.

**Parameters:**
- `departmentId` (string): Department ID

**Returns:**
```javascript
{
  success: true,
  data: [ { id, firstName, lastName, ... }, ... ],
  error: null
}
```

---

## Recruitment Service

Location: `src/firebase/recruitmentService.js`

### Functions

#### `addJobPosting(jobData)`
Creates job posting.

**Parameters:**
```javascript
{
  title: string,
  department: string,
  description: string,
  requirements: string,
  salary: { min, max },
  position: number,
  postedBy: string
}
```

**Returns:**
```javascript
{
  success: true,
  jobId: string,
  error: null
}
```

#### `getJobPostings()`
Gets all active job postings.

**Returns:**
```javascript
{
  success: true,
  data: [ { id, title, department, ... }, ... ],
  error: null
}
```

#### `addApplicant(applicantData)`
Adds job applicant.

**Parameters:**
```javascript
{
  jobId: string,
  name: string,
  email: string,
  phone: string,
  resume: File,
  coverLetter: string
}
```

**Returns:**
```javascript
{
  success: true,
  applicantId: string,
  error: null
}
```

#### `getApplicantsForJob(jobId)`
Gets applicants for specific job.

**Parameters:**
- `jobId` (string): Job posting ID

**Returns:**
```javascript
{
  success: true,
  data: [ { id, name, email, status, ... }, ... ],
  error: null
}
```

#### `scheduleInterview(interviewData)`
Schedules interview.

**Parameters:**
```javascript
{
  applicantId: string,
  jobId: string,
  interviewDate: timestamp,
  interviewTime: string,
  interviewer: string,
  round: number
}
```

**Returns:**
```javascript
{
  success: true,
  interviewId: string,
  error: null
}
```

---

## Custom Hooks

Location: `src/hooks/`

### `useAuth()`
Provides authentication context.

**Returns:**
```javascript
{
  user: { uid, email, displayName, photoURL },
  loading: boolean,
  error: string,
  isAdmin: boolean,
  login: async function,
  logout: async function,
  register: async function,
  resetPassword: async function
}
```

**Example:**
```javascript
const { user, loading, login, logout } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <LoginPage />;

return (
  <div>
    <p>Welcome, {user.displayName}</p>
    <button onClick={logout}>Logout</button>
  </div>
);
```

### `useFirestore(collectionName, conditions = [])`
Real-time data fetching from Firestore.

**Parameters:**
- `collectionName` (string): Collection to fetch
- `conditions` (array): Query conditions (optional)

**Returns:**
```javascript
{
  data: [ { id, ...document }, ... ],
  loading: boolean,
  error: string
}
```

**Example:**
```javascript
const { data: employees, loading, error } = useFirestore("employees", [
  ["department", "==", "IT"],
  ["status", "==", "active"]
]);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return employees.map(emp => <div key={emp.id}>{emp.firstName}</div>);
```

---

## Error Handling

All services return structured responses:

```javascript
{
  success: boolean,
  data?: any,
  error?: string,
  code?: string,
  details?: any
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_EMAIL` | Invalid email format |
| `AUTH_WEAK_PASSWORD` | Password too weak |
| `AUTH_USER_EXISTS` | User already exists |
| `AUTH_INVALID_CREDENTIALS` | Wrong email/password |
| `DB_PERMISSION_DENIED` | Firestore access denied |
| `DB_NOT_FOUND` | Document not found |
| `STORAGE_UPLOAD_FAILED` | File upload failed |
| `NETWORK_ERROR` | Network connectivity issue |

### Error Handling Pattern

```javascript
try {
  const result = await someService(params);
  
  if (result.success) {
    // Handle success
    console.log(result.data);
  } else {
    // Handle error
    console.error(`Error (${result.code}): ${result.error}`);
    
    if (result.code === "AUTH_USER_EXISTS") {
      // Handle specific error
      alert("User already registered");
    }
  }
} catch (error) {
  // Unexpected error
  console.error("Unexpected error:", error);
}
```

---

## Best Practices

1. **Always check success flag** before using returned data
2. **Handle loading states** in UI for better UX
3. **Use custom hooks** for component data fetching
4. **Implement error boundaries** for graceful error handling
5. **Validate input data** before sending to Firebase
6. **Use Firestore listeners** for real-time updates
7. **Implement pagination** for large datasets
8. **Cache data** when appropriate to reduce queries
9. **Set proper security rules** in Firestore
10. **Test error scenarios** thoroughly

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Complete API Documentation ✅
