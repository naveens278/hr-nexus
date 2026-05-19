# 📊 Firestore Database Schema | HR-NEXUS

## Database Overview

**Project**: hr-nexus-7cd0b  
**Type**: Firestore (NoSQL Document Database)  
**Region**: Auto-managed by Firebase  

---

## Collections & Documents Schema

### 1. `users` Collection
**Purpose**: Store user accounts and profiles  
**Access**: Personal user data + admin data

```javascript
Document ID: {uid} - Firebase Auth UID

Fields:
{
  uid: string,                    // Primary key (Firebase Auth UID)
  email: string,                  // User email (unique)
  name: string,                   // Full name
  phone: string,                  // Contact number
  role: string,                   // "admin" | "manager" | "employee"
  department: string,             // Department assigned
  photoURL: string,               // Profile picture URL
  createdAt: timestamp,           // Account creation date
  lastLogin: timestamp,           // Last login time
  isActive: boolean,              // Account status
  preferences: {
    theme: string,                // "light" | "dark"
    language: string,             // Language code
    notifications: boolean        // Notification preference
  }
}

Example:
{
  uid: "abc123xyz",
  email: "john@company.com",
  name: "John Doe",
  phone: "+919876543210",
  role: "manager",
  department: "HR",
  photoURL: "https://...",
  createdAt: 2026-03-16T10:00:00Z,
  lastLogin: 2026-03-16T15:30:00Z,
  isActive: true
}
```

---

### 2. `employees` Collection
**Purpose**: Detailed employee records  
**Access**: All authenticated users can read, managers/admins can write

```javascript
Document ID: {employeeId} - Auto-generated

Fields:
{
  id: string,                     // Document ID
  userId: string,                 // Reference to users collection
  name: string,                   // Employee name
  email: string,                  // Work email
  phone: string,                  // Contact number
  personalPhone: string,          // Personal phone
  personalEmail: string,          // Personal email
  department: string,             // Department
  position: string,               // Job title
  reportingManager: string,       // Manager's user ID
  joinDate: timestamp,            // Date of joining
  salary: {
    basic: number,                // Basic salary
    hra: number,                  // House Rent Allowance
    da: number,                   // Dearness Allowance
    ta: number,                   // Travel Allowance
    gross: number,                // Gross salary
    net: number                   // Net salary after deductions
  },
  address: {
    current: string,              // Current address
    permanent: string,            // Permanent address
    city: string,                 // City
    state: string,                // State
    pincode: string               // Postal code
  },
  documents: {
    aadhar: string,               // Aadhar number
    pan: string,                  // PAN number
    bankAccount: string,          // Bank account
    ifsc: string                  // IFSC code
  },
  profilePicture: string,         // Image URL in Firebase Storage
  achievements: array,            // List of achievements
  status: string,                 // "active" | "inactive" | "suspended"
  createdAt: timestamp,           // Record creation date
  updatedAt: timestamp            // Last update date
}

Example:
{
  id: "emp_001",
  userId: "user_abc123",
  name: "Alice Smith",
  email: "alice@company.com",
  department: "Engineering",
  position: "Senior Developer",
  joinDate: 2024-01-15,
  salary: {
    basic: 50000,
    hra: 15000,
    da: 10000,
    gross: 75000,
    net: 65000
  },
  status: "active"
}
```

---

### 3. `attendance` Collection
**Purpose**: Track daily attendance and work hours  
**Access**: All authenticated users

```javascript
Document ID: {attendanceId} - Auto-generated

Fields:
{
  id: string,                     // Document ID
  employeeId: string,             // Reference to employee
  date: date,                     // Attendance date (YYYY-MM-DD)
  checkInTime: timestamp,         // Check-in time
  checkOutTime: timestamp,        // Check-out time (nullable)
  status: string,                 // "present" | "absent" | "leave" | "wfh"
  workingHours: number,           // Total working hours
  overtime: number,               // Overtime hours (0 if none)
  location: string,               // Check-in location
  latitude: number,               // GPS latitude
  longitude: number,              // GPS longitude
  notes: string,                  // Additional notes
  createdAt: timestamp,           // Record creation
  updatedAt: timestamp            // Last update
}

Example:
{
  id: "att_001",
  employeeId: "emp_001",
  date: 2026-03-16,
  checkInTime: 2026-03-16T09:00:00Z,
  checkOutTime: 2026-03-16T18:00:00Z,
  status: "present",
  workingHours: 8.5,
  location: "Office",
  createdAt: 2026-03-16T09:00:00Z
}
```

---

### 4. `leaves` Collection
**Purpose**: Manage leave requests and approvals  
**Access**: All authenticated users

```javascript
Document ID: {leaveId} - Auto-generated

Fields:
{
  id: string,                     // Document ID
  employeeId: string,             // Employee requesting leave
  managerId: string,              // Manager approving leave
  leaveType: string,              // "PL" | "CL" | "SL" | "Unpaid"
  startDate: date,                // Leave start date
  endDate: date,                  // Leave end date
  noOfDays: number,               // Number of leave days
  reason: string,                 // Reason for leave
  status: string,                 // "pending" | "approved" | "rejected"
  appliedBy: string,              // Admin who created (if manual)
  approvalDate: timestamp,        // Approval/rejection date
  approverComments: string,       // Comments from approver
  appliedAt: timestamp,           // Application date
  updatedAt: timestamp            // Last update
}

Example:
{
  id: "leave_001",
  employeeId: "emp_001",
  managerId: "user_mgr001",
  leaveType: "PL",
  startDate: 2026-03-20,
  endDate: 2026-03-22,
  noOfDays: 3,
  reason: "Family event",
  status: "pending",
  appliedAt: 2026-03-16T10:30:00Z
}
```

---

### 5. `leaveBalance` Collection
**Purpose**: Track annual leave balance per employee  
**Access**: Admin and managers

```javascript
Document ID: {year}_{employeeId}

Fields:
{
  employeeId: string,
  year: number,
  pl: number,                     // Paid leave balance
  cl: number,                     // Casual leave balance
  sl: number,                     // Sick leave balance
  plUsed: number,
  clUsed: number,
  slUsed: number,
  carryForward: number,           // Balance carried from last year
  lastUpdated: timestamp
}

Example:
{
  employeeId: "emp_001",
  year: 2026,
  pl: 20,
  cl: 12,
  sl: 10,
  plUsed: 3,
  clUsed: 2,
  slUsed: 0,
  carryForward: 5
}
```

---

### 6. `payroll` Collection
**Purpose**: Monthly salary and payroll records  
**Access**: Admin and managers only

```javascript
Document ID: {payrollId} - Auto-generated

Fields:
{
  id: string,
  employeeId: string,
  month: string,                  // MM/YYYY format
  basicSalary: number,
  hra: number,
  da: number,
  ta: number,
  bonus: number,
  grossSalary: number,
  pf: number,                     // Provident Fund (12%)
  tax: number,                    // Income tax
  insurance: number,              // Health insurance
  otherDeductions: number,
  netSalary: number,
  status: string,                 // "pending" | "processed" | "paid"
  paymentMethod: string,          // "bank" | "cash" | "cheque"
  processedBy: string,            // Admin who processed
  processedDate: timestamp,
  paidDate: timestamp,
  createdAt: timestamp
}

Example:
{
  id: "payroll_001",
  employeeId: "emp_001",
  month: "03/2026",
  basicSalary: 50000,
  hra: 15000,
  da: 10000,
  grossSalary: 75000,
  pf: 6000,
  tax: 4000,
  netSalary: 65000,
  status: "processed"
}
```

---

### 7. `departments` Collection
**Purpose**: Company departments and teams  
**Access**: All authenticated users can read, admins can write

```javascript
Document ID: {departmentId} - Auto-generated

Fields:
{
  id: string,
  name: string,                   // Department name (unique)
  head: string,                   // Manager's user ID
  description: string,            // Department description
  employeeCount: number,          // Number of employees
  budget: number,                 // Annual budget
  location: string,               // Office location
  createdAt: timestamp,
  updatedAt: timestamp
}

Example:
{
  id: "dept_001",
  name: "Engineering",
  head: "user_mgr001",
  description: "Software development team",
  employeeCount: 15,
  budget: 5000000,
  location: "Building A, Floor 3"
}
```

---

### 8. `jobs` Collection
**Purpose**: Job postings and vacancies  
**Access**: All authenticated users can read, admins can write

```javascript
Document ID: {jobId} - Auto-generated

Fields:
{
  id: string,
  title: string,                  // Job title
  description: string,            // Job description
  department: string,             // Related department
  positions: number,              // Number of openings
  salary: {
    min: number,
    max: number,
    currency: string              // "INR", "USD", etc.
  },
  requirements: array,            // List of requirements
  qualifications: array,          // Education & qualifications
  experience: string,             // Years of experience required
  jobType: string,                // "Full-time" | "Part-time" | "Contract"
  location: string,
  status: string,                 // "open" | "closed" | "filled"
  postedBy: string,               // Admin who posted
  createdAt: timestamp,
  closedAt: timestamp,
  updatedAt: timestamp
}

Example:
{
  id: "job_001",
  title: "Senior Software Engineer",
  department: "Engineering",
  positions: 2,
  salary: { min: 80000, max: 120000 },
  status: "open",
  createdAt: 2026-03-16T10:00:00Z
}
```

---

### 9. `applicants` Collection
**Purpose**: Job applicants and their status  
**Access**: Admins and recruiters

```javascript
Document ID: {applicantId} - Auto-generated

Fields:
{
  id: string,
  jobId: string,                  // Related job posting
  name: string,                   // Applicant name
  email: string,
  phone: string,
  resume: string,                 // Resume URL in Storage
  coverLetter: string,            // Cover letter text
  qualifications: array,          // Their qualifications
  experience: string,             // Work experience
  expectedSalary: number,
  status: string,                 // "applied" | "screening" | "interview" | 
                                  // "selected" | "rejected" | "onboard"
  rating: number,                 // 1-5 star rating
  notes: string,                  // Recruiter notes
  appliedAt: timestamp,
  updatedAt: timestamp
}

Example:
{
  id: "app_001",
  jobId: "job_001",
  name: "Bob Wilson",
  email: "bob@email.com",
  resume: "gs://bucket/resume_bob.pdf",
  status: "interview",
  rating: 4,
  appliedAt: 2026-03-15T14:30:00Z
}
```

---

## 🔗 Collection Relationships

```
users (1) ──→ (Many) employees
users (1) ──→ (Many) attendance
users (1) ──→ (Many) leaves
users (1) ──→ (Many) payroll
departments (1) ──→ (Many) employees
jobs (1) ──→ (Many) applicants
```

---

## 📑 Indexes for Query Performance

### Recommended Composite Indexes

```javascript
// 1. attendance collection
Fields: employeeId + date + status

// 2. leaves collection
Fields: employeeId + status + appliedAt

// 3. payroll collection
Fields: employeeId + month + status

// 4. applicants collection
Fields: jobId + status + appliedAt

// 5. employees collection
Fields: department + status + name
```

### How to Create Indexes
1. Open Firebase Console
2. Go to Firestore → Indexes → Composite Indexes
3. Click "Create Index"
4. Select collection and fields
5. Click "Create"

---

## 🔐 Data Rules & Constraints

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| users.email | string | Yes | Yes | Validated format |
| users.role | enum | Yes | No | "admin", "manager", "employee" |
| employees.name | string | Yes | No | Max 100 chars |
| attendance.date | date | Yes | No | Format: YYYY-MM-DD |
| leaves.status | enum | Yes | No | "pending", "approved", "rejected" |
| payroll.month | string | Yes | No | Format: MM/YYYY |
| departments.name | string | Yes | Yes | Unique per company |

---

## 💾 Data Retention Policy

| Collection | Retention | Notes |
|-----------|-----------|-------|
| users | Indefinite | Active users only |
| employees | 7 years | Post-separation retention |
| attendance | 7 years | Legal compliance |
| leaves | 7 years | Record keeping |
| payroll | 7 years | Tax compliance |
| departments | Indefinite | History maintained |
| jobs | 2 years | Archival after closure |
| applicants | 1 year | After resolution |

---

## 📊 Document Sizes

| Collection | Avg Size | Max Size |
|-----------|----------|----------|
| users | 2 KB | 5 KB |
| employees | 5 KB | 10 KB |
| attendance | 1 KB | 2 KB |
| leaves | 2 KB | 3 KB |
| payroll | 1.5 KB | 2.5 KB |
| departments | 1 KB | 2 KB |
| jobs | 3 KB | 5 KB |
| applicants | 4 KB | 8 KB |

---

## 🚀 Scaling Considerations

### Current Capacity
- **Users**: 10,000+
- **Employees**: 5,000+
- **Attendance Records**: 2M+ annually
- **Documents**: 50M+

### If scaling beyond limits:
1. Archive old data (> 5 years)
2. Implement data sharding
3. Use Cloud Datastore for historical data
4. Implement Cloud Functions for aggregation
5. Use BigQuery for analytics

---

## 📝 Backup & Recovery

### Firestore Backup
- **Frequency**: Daily (automatic)
- **Retention**: 30 days
- **Method**: To Google Cloud Storage

### Procedure:
1. Enable automatic backups in Firebase Console
2. Configure backup location (Cloud Storage bucket)
3. Set retention period (7-30 days)
4. Test restoration quarterly

### Manual Backup:
```bash
gcloud firestore export gs://bucket-name/backup_date
```

---

**Schema Version**: 1.0  
**Last Updated**: March 16, 2026  
**Status**: Production Ready ✅
