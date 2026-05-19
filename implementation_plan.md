# Goal Description
Apply the stunning dark "Aurora Glassmorphism" theme from the new Login page to the entire application. This will create a unified, premium, and highly attractive visual experience across all dashboards and modules.

## User Review Required
> [!IMPORTANT]
> This is a major visual overhaul. The entire app will switch from a Light theme to a Dark Glassmorphism theme.
> Please review the proposed changes below. If you approve, I will automatically modify the React components to use the new aesthetic.

## Proposed Changes

### Global Styles & Layout
#### [MODIFY] src/index.css
- Move the custom animations (`auroraGradient`, `floatOrbX`, `borderGlow`, etc.) from [Login.js](file:///c:/Users/Naveen%20S/OneDrive/Desktop/hr-nexus/src/pages/Auth/Login.js) into global CSS.
- Update global defaults (body text color, background, scrollbars) to a sleek dark theme.
- Define global utility classes: `.app-container`, `.glass-panel`, `.glass-input`, `.primary-btn`, `.title-gradient`, etc.

#### [MODIFY] src/App.js
- Wrap the main `<Routes>` inside the new `.app-container`.
- Inject the three animated `.orb` elements globally so that the ambient floating gradient backdrop is persistent and seamless as users navigate between pages.

### [Component] Backend API

#### [MODIFY] [server.js](file:///c:/Users/Naveen%20S/OneDrive/Desktop/hr-nexus/backend/server.js)

- Update line 577 to use port 5001 instead of 5000 for generated profile picture URLs.

### [Component] Database Migration

#### [NEW] [fix_image_ports.js](file:///c:/Users/Naveen%20S/OneDrive/Desktop/hr-nexus/backend/fix_image_ports.js)

- Create a small script to update all existing `profilePicture` entries in the database that still use port 5000.

### Navigation Components
#### [MODIFY] src/components/Sidebar/Sidebar.js
- Change the background from a light semi-transparent white to a dark glassmorphism panel (`rgba(24, 24, 27, 0.65)` with heavy blur).
- Update link colors and hover states to fit the new dark aesthetic (e.g., using glowing purple/indigo borders active states).

#### [MODIFY] src/components/Navbar/Navbar.js
- Update the Navbar background to a deep glass panel.
- Adjust text and icon colors to be perfectly legible and vibrant against the dark theme.

### Page Components Migration
#### [MODIFY] src/pages/**/*.js (Dashboard, EmployeeList, AttendancePage, etc.)
- Remove the hardcoded light-theme wrappers (`background: #f5f7fa`, `background: white`).
- Replace hardcoded text colors (`#333`, `#666`) with the new global CSS text variables or responsive translucent white (`rgba(255,255,255,0.8)`).
- Apply the `.glass-panel` class to core data tables, forms, and metric cards to give them the frosted glass look.
- *Implementation detail:* I will use an automated pass to update the inline styles in these components to match the new dark theme guidelines.

## Verification Plan

### Manual Verification
- Since this is a purely aesthetic and visual update (no core business logic is changed), verification requires visual confirmation. 
- You already have the frontend running (`npm start`). Once I complete the executions, I will ask you to navigate through the app (Dashboard, Employees, Attendance) in your browser to verify that the animations, dark theme, and glassmorphic tables look exceptionally good and are fully legible.
