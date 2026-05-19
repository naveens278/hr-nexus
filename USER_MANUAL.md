# 👥 HR-NEXUS | USER MANUAL

Complete guide for HR-NEXUS system end users.

---

## 📖 TABLE OF CONTENTS

1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Employee Management](#employee-management)
5. [Attendance Management](#attendance-management)
6. [Leave Management](#leave-management)
7. [Payroll System](#payroll-system)
8. [Reports & Analytics](#reports--analytics)
9. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## 🚀 GETTING STARTED

### System Requirements

- **Browser**: Chrome, Firefox, Edge, Safari (latest versions)
- **Internet**: Stable connection required
- **Display**: 1024x768 or larger (recommended: 1920x1080)
- **Operating System**: Windows, Mac, Linux

### Accessing HR-NEXUS

1. **Local Access** (Development):
   - Open browser
   - Go to: `http://localhost:3000`
   - System loads in 2-3 seconds

2. **Production Access** (After Deployment):
   - Your IT team will provide URL
   - Bookmark the page for quick access

### First Login

You'll receive:
- Email address
- Temporary password (first time only)
- Login credentials documentation

---

## 🔐 LOGIN & AUTHENTICATION

### Email/Password Login

1. **Go to Login Page**
   - URL: `http://localhost:3000/login`
   - Or click "Sign In" if logged out

2. **Enter Credentials**
   - Email: Your work email
   - Password: Your password

3. **Click "Login"**
   - Wait for authentication (2-3 seconds)
   - System verifies your credentials with Firebase

4. **First Time Setup**
   - Update your password (change temporary password)
   - Add phone number
   - Set department preference

### Google OAuth Login

1. **Click "Sign In with Google"**
2. **Select Your Google Account**
   - Choose your work email if multiple accounts
3. **Accept Permissions**
   - System needs: Email, name, profile picture
4. **You're Logged In!**
   - Automatic profile creation

### Password Reset

**Forgot Password?**

1. On Login page, click "Forgot Password?"
2. Enter your email address
3. Check your email for reset link
4. Click link (valid for 1 hour)
5. Enter new password (min 8 characters)
6. Return to login with new password

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

---

## 📊 DASHBOARD OVERVIEW

### Main Dashboard

**Location**: After login, home page

**Key Elements:**

1. **Navigation Sidebar** (Left)
   - Main menu navigation
   - Quick links to all modules
   - User profile at bottom
   - Logout option

2. **Top Navbar** (Top)
   - Company logo/name
   - Search bar
   - Notifications bell
   - User dropdown menu

3. **Dashboard Cards** (Center)
   - **Total Employees**: Count of all employees
   - **Present Today**: Employees checked in
   - **Pending Leaves**: Awaiting approval
   - **Monthly Payroll**: Current month status

4. **Quick Actions** (Right side)
   - Add Employee
   - Apply Leave
   - Check In
   - View Reports

### Dashboard Navigation

**Main Menu Items:**

```
📊 Dashboard (Home)
👥 Employees
   ├─ Employee List
   ├─ Add Employee
   └─ Employee Profile

📋 Attendance
   ├─ Check In/Out
   ├─ Attendance Report
   └─ History

📅 Leave
   ├─ Apply Leave
   ├─ Leave History
   ├─ Leave Approval
   └─ Balance

💰 Payroll
   ├─ Payroll Processing
   ├─ Payslip
   └─ Reports

🏢 Departments
   ├─ Department List
   └─ Add Department

👔 Recruitment
   ├─ Job Posting
   ├─ Applicants
   └─ Interview Schedule

📈 Reports
   ├─ Employee Report
   ├─ Attendance Report
   └─ Payroll Report

⚙️ Settings
   └─ User Preferences
```

---

## 👥 EMPLOYEE MANAGEMENT

### View Employee List

1. **Click**: Employees → Employee List
2. **Display**: Table showing all employees
3. **Columns**: Name, Email, Department, Position, Phone

### Search & Filter Employees

1. **Search Box** (top of table)
   - Type employee name, email, or department
   - Results update instantly
   - Case-insensitive search

2. **Filter Options**
   - By Department
   - By Position
   - By Status (Active/Inactive)

### Add New Employee

1. **Click**: Employees → Add Employee
2. **Fill Form**:
   - Full Name *
   - Email *
   - Phone Number
   - Department * (select from dropdown)
   - Position *
   - Join Date *
   - Salary Information:
     - Basic Salary *
     - HRA (House Rent Allowance)
     - DA (Dearness Allowance)
     - Other Allowances

3. **Upload Photo** (Optional)
   - Drag & drop or click to upload
   - Formats: JPG, PNG, WebP
   - Max size: 5 MB

4. **Click "Add Employee"**
   - Confirmation message appears
   - Employee added to system
   - Can login immediately

### View Employee Profile

1. **Click**: Employee from Employee List
2. **Profile Shows**:
   - Photo and personal details
   - Contact information
   - Department and position
   - Salary breakdown
   - Recent attendance
   - Leave balance
   - Documents

3. **Edit Profile**
   - Click "Edit" button
   - Modify information
   - Upload new photo
   - Click "Save"

### Update Employee Information

**HRs/Managers Can Update:**

1. Go to Employee List
2. Click employee name → Profile
3. Click "Edit" button
4. Modify fields as needed
5. Click "Save Changes"

**Employees Can Update:**
- Their own phone number
- Password
- Profile photo
- Contact preferences

---

## 📋 ATTENDANCE MANAGEMENT

### Check In

**Morning Routine:**

1. Dashboard → Attendance → Check In
2. Click "Check In" button
3. System records:
   - Exact time
   - Date
   - Location (if GPS enabled)
4. Confirmation message appears
5. Status shows "Checked In"

### Check Out

**End of Day:**

1. Dashboard → Attendance → Check Out
2. Click "Check Out" button
3. System calculates:
   - Working hours
   - Attendance status
4. Payslip updated automatically

### View Attendance History

1. Click: Attendance → History
2. **Calendar View** shows:
   - Green: Present days
   - Red: Absent days
   - Yellow: Leave days
   - Blue: Work from home

3. **Click Day** for details:
   - Check in time
   - Check out time
   - Working hours
   - Location

### Generate Attendance Report

**For Managers/HRs:**

1. Click: Reports → Attendance Report
2. **Select Filters**:
   - Date Range
   - Department
   - Employee
   - Status

3. **Click "Generate"**
4. **View Report**:
   - Attendance summary
   - Present/Absent count
   - Average working hours

5. **Export Options**:
   - Download as PDF
   - Download as Excel
   - Print

---

## 📅 LEAVE MANAGEMENT

### Apply Leave

**Step 1: Navigate**
- Dashboard → Leave → Apply Leave

**Step 2: Select Leave Type**
- PL (Paid Leave)
- CL (Casual Leave)
- SL (Sick Leave)

**Step 3: Fill Details**
- Start Date *
- End Date *
- Reason for leave
- Contact number during leave
- Attachments (optional, for medical leaves)

**Step 4: Submit**
- Click "Apply"
- Confirmation message
- Manager gets notification

**Step 5: Track Status**
- Go to Leave History
- View "Pending", "Approved", or "Rejected"

### Check Leave Balance

**Current Year Balance:**

1. Click: Leave → Leave Balance
2. View remaining leaves:
   - PL (Paid Leave)
   - CL (Casual Leave)
   - SL (Sick Leave)
3. Shows used and available days

### View Leave History

1. Click: Leave → Leave History
2. **All Leave Records** shows:
   - Leave type
   - Dates
   - Duration (days)
   - Status (Approved/Pending/Rejected)
   - Applied on (date)

3. **Filter by**:
   - Status
   - Leave Type
   - Date Range

### Approve/Reject Leaves (Managers Only)

**For Pending Leaves:**

1. Click: Leave → Leave Approval
2. **Pending Requests List** shows:
   - Employee name
   - Leave type
   - Dates
   - Reason
   - Applied date

3. **To Approve:**
   - Click "Approve" button
   - Add optional comments
   - Confirm
   - Employee notified

4. **To Reject:**
   - Click "Reject" button
   - Provide reason (required)
   - Confirm
   - Employee notified with reason

---

## 💰 PAYROLL SYSTEM

### View Payslip

**Monthly Payslip:**

1. Dashboard → Payroll → Payslip
2. **Select Month** from dropdown
3. **View Payslip Contents**:
   - Employee details
   - Basic salary
   - Allowances (HRA, DA, etc.)
   - Deductions (PF, Tax, etc.)
   - Net salary
   - YTD (Year To Date) totals

4. **Download/Print**:
   - Click "Download PDF"
   - Or "Print" to paper

### Understand Salary Components

**Earnings:**
- **Basic**: Base salary (fixed)
- **HRA**: House Rent Allowance (50% of basic)
- **DA**: Dearness Allowance (50% of basic)
- **Allowances**: Other bonuses/benefits

**Deductions:**
- **PF**: Provident Fund (12% of basic)
- **Income Tax**: Based on salary slabs
- **Professional Tax**: Optional based on state

**Calculation:**
```
Gross Salary = Basic + HRA + DA + Allowances
Net Salary = Gross Salary - Deductions
```

### View Salary History

1. Dashboard → Payroll → Payroll History
2. **All Payslips** for year shown
3. Click any month to view details
4. Compare month-on-month changes

### Generate Payroll Report (HRs Only)

1. Click: Reports → Payroll Report
2. **Select Options**:
   - Month
   - Department
   - Employees

3. **Generate**
4. **View**:
   - Summary statistics
   - Individual salaries
   - Total company payroll

5. **Export**:
   - Download Excel
   - PDF report

---

## 📈 REPORTS & ANALYTICS

### Employee Report

**Shows:**
- Total employees
- By department
- By position
- By status (Active/Inactive)
- Headcount trends

**Generate:**
1. Reports → Employee Report
2. Select Department (optional)
3. Click Generate
4. View charts and tables
5. Export if needed

### Attendance Report

**Shows:**
- Attendance percentages
- Absent days
- Leave taken
- Work from home days
- Individual and department summaries

**Generate:**
1. Reports → Attendance Report
2. Select date range
3. Select department/employee
4. Generate
5. Download report

### Payroll Report

**Shows:**
- Total payroll amount
- Salary heads (Basic, HRA, DA, etc.)
- Deductions
- Department-wise breakdown
- Monthly comparison

**Generate:**
1. Reports → Payroll Report
2. Select month
3. Select department
4. Generate
5. Download for accounting

---

## ⚙️ SETTINGS

### Update Profile

1. Click: Profile icon (top right)
2. Click "Settings"
3. **Update:**
   - Phone number
   - Department preference
   - Email preferences
   - Theme (Light/Dark)

4. Click "Save"

### Change Password

1. Settings → Security
2. Enter current password
3. Enter new password (8+ chars)
4. Confirm new password
5. Click "Update Password"

### Notification Preferences

1. Settings → Notifications
2. Toggle notifications for:
   - Leave approval
   - Payslip release
   - Attendance reminders
   - System updates

3. Save preferences

### Download Data

1. Settings → Data Export
2. Select data to export:
   - Profile information
   - Leave history
   - Attendance records
   - Payslips

3. Click "Download"
4. File downloads as ZIP

---

## ❓ FAQ & TROUBLESHOOTING

### Q: I forgot my password. What do I do?

**A:** On login page, click "Forgot Password?" and follow these steps:
1. Enter email address
2. Check email for reset link
3. Click link in email
4. Set new password
5. Login with new password

### Q: How do I check in for the day?

**A:** 
1. Go to Dashboard
2. Click "Check In" button
3. System records time automatically
4. You'll see confirmation

### Q: Can I apply leave retroactively (for past dates)?

**A:** Yes, but:
- Manager approval required
- Valid reason must be provided
- Must be within last 30 days
- Contact HR for assistance

### Q: My payslip shows incorrect salary. What do I do?

**A:**
1. Check salary components are correct
2. Contact your manager or HR
3. They can review and correct
4. Updated payslip regenerates automatically

### Q: I can't login. Error: "User not found"

**A:**
- Verify email is correct
- Check CAPS LOCK is off
- Reset password if needed
- Contact IT support if issue persists

### Q: System is running slow. How do I fix it?

**A:**
1. Refresh page (F5)
2. Clear browser cache
3. Try different browser
4. Check internet connection
5. Close unnecessary tabs

### Q: Can I edit my check-in time after check-in?

**A:**
- Not directly by employees
- Contact manager who can request adjustment
- HR reviews and approves
- Changes tracked for audit

### Q: How many leaves do I have remaining?

**A:**
1. Dashboard → Leave → Balance
2. Shows all leave types:
   - PL (Paid Leave)
   - CL (Casual Leave)
   - SL (Sick Leave)
3. Shows used and available

### Q: Can I view other employees' salary information?

**A:**
- **Employees**: Only your own
- **Managers**: Their team members
- **HRs**: All employees
- Confidential by design

### Q: When does my leave balance reset?

**A:**
- January 1st each year
- Unused leaves don't carry over (policy dependent)
- Sick leave is per calendar year
- Special leaves have specific rules

---

## 🔒 SECURITY BEST PRACTICES

### Protect Your Account

1. **Strong Password**
   - Use 12+ characters
   - Include uppercase, numbers, symbols
   - Don't share with anyone

2. **Keep Login Private**
   - Don't share credentials
   - Logout when done
   - Close browser on shared computers

3. **Watch for Phishing**
   - HR-NEXUS won't ask for password via email
   - Always login via official URL
   - Report suspicious emails

4. **Session Security**
   - Auto logout after 30 minutes inactivity
   - Login again for security
   - Logout manually when leaving

---

## 📞 GET HELP

### Contact IT Support

- **Email**: support@company.com
- **Phone**: +1-XXX-XXX-XXXX
- **Hours**: 9 AM - 6 PM, Monday-Friday
- **Response Time**: Usually within 2 hours

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Can't login | Reset password or contact IT |
| Page not loading | Refresh page or clear cache |
| Payslip not showing | Contact HR/Payroll team |
| Leave not approved | Check with manager |
| Attendance not recorded | Click Check In button again |

---

## 📚 ADDITIONAL RESOURCES

- **System Policies**: Available in Settings → Policies
- **Training Videos**: Shared by HR team
- **Quick Start Guide**: First time user guide
- **API Documentation**: For developers

---

**HR-NEXUS User Manual**  
**Version**: 1.0  
**Last Updated**: March 16, 2026  
**Status**: Production Ready ✅
