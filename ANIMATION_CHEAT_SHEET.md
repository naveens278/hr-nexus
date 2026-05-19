# 🎨 Animation Cheat Sheet - Quick Visual Guide

## 📌 Quick Access - Copy & Paste Ready

### **Button Variants**
```jsx
<AnimatedButton variant="primary">Primary</AnimatedButton>
<AnimatedButton variant="secondary">Secondary</AnimatedButton>
<AnimatedButton variant="success">Success</AnimatedButton>
<AnimatedButton variant="danger">Danger</AnimatedButton>
<AnimatedButton variant="warning">Warning</AnimatedButton>
<AnimatedButton variant="outline">Outline</AnimatedButton>
```

### **Button Sizes**
```jsx
<AnimatedButton size="sm">Small</AnimatedButton>
<AnimatedButton size="md">Medium</AnimatedButton>
<AnimatedButton size="lg">Large</AnimatedButton>
```

### **Card Colors**
```jsx
<AnimatedCard color="blue">Blue Card</AnimatedCard>
<AnimatedCard color="green">Green Card</AnimatedCard>
<AnimatedCard color="red">Red Card</AnimatedCard>
<AnimatedCard color="purple">Purple Card</AnimatedCard>
<AnimatedCard color="yellow">Yellow Card</AnimatedCard>
<AnimatedCard color="indigo">Indigo Card</AnimatedCard>
```

### **Toast Alerts**
```jsx
<AnimatedAlert type="success" message="Success!" />
<AnimatedAlert type="error" message="Error occurred!" />
<AnimatedAlert type="warning" message="Warning!" />
<AnimatedAlert type="info" message="Information" />
```

### **Skeleton Variants**
```jsx
<SkeletonLoader variant="card" count={5} />
<SkeletonLoader variant="table" count={5} />
<SkeletonLoader variant="badge" count={5} />
<SkeletonLoader variant="text" count={5} />
```

### **Progress Colors**
```jsx
<AnimatedProgress value={75} color="blue" />
<AnimatedProgress value={75} color="green" />
<AnimatedProgress value={75} color="red" />
<AnimatedProgress value={75} color="yellow" />
<AnimatedProgress value={75} color="purple" />
```

### **Badge Variants**
```jsx
<AnimatedBadge variant="primary">Primary</AnimatedBadge>
<AnimatedBadge variant="secondary">Secondary</AnimatedBadge>
<AnimatedBadge variant="success">Success</AnimatedBadge>
<AnimatedBadge variant="danger">Danger</AnimatedBadge>
<AnimatedBadge variant="warning">Warning</AnimatedBadge>
<AnimatedBadge variant="purple">Purple</AnimatedBadge>
```

---

## 🎬 CSS Animation Classes - Copy Ready

### **Entrance Animations**
```jsx
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-in-down">Slide down</div>
<div className="animate-slide-in-up">Slide up</div>
<div className="animate-slide-in-left">Slide left</div>
<div className="animate-slide-in-right">Slide right</div>
<div className="animate-scale-in">Scale in</div>
<div className="animate-zoom-in">Zoom in</div>
```

### **Continuous Animations**
```jsx
<div className="animate-pulse">Pulsing</div>
<div className="animate-spin">Spinning</div>
<div className="animate-bounce">Bouncing</div>
<div className="animate-bounce-slow">Slow bounce</div>
<div className="animate-glow">Glowing</div>
```

### **Interactive Animations**
```jsx
<div className="animate-shake">Shake</div>
<div className="animate-wiggle">Wiggle</div>
<div className="animate-success">Success checkmark</div>
<div className="animate-button-press">Button press</div>
```

### **Hover Effects**
```jsx
<div className="hover-lift">Hover lift</div>
<div className="hover-scale">Hover scale</div>
<div className="hover-glow">Hover glow</div>
<div className="hover-shadow">Hover shadow</div>
<div className="hover-darken">Hover darken</div>
```

### **Transitions - Smooth Changes**
```jsx
<div className="transition-all">All transitions</div>
<div className="transition-all-slow">Slow transitions</div>
<div className="transition-colors">Color transitions</div>
<div className="transition-transform">Transform transitions</div>
<div className="transition-opacity">Opacity transitions</div>
```

### **Status Indicators**
```jsx
<div className="status-loading">Loading...</div>
<div className="status-success">✓ Success</div>
<div className="status-error">✗ Error</div>
<div className="status-warning">⚠ Warning</div>
```

### **Combined Effects Ready to Copy**
```jsx
<button className="animate-bounce hover-scale transition-all active:scale-95">
  Fully Animated Button
</button>

<div className="animate-slide-in-up hover-lift transition-all">
  Animated Card
</div>

<div className="list-item-stagger">
  Staggered list item
</div>
```

---

## 🔧 Customization Snippets

### **Custom Duration**
```jsx
<div style={{ animation: "fadeIn 2s ease-out" }}>
  Custom duration (2 seconds)
</div>
```

### **Custom Delay**
```jsx
<div style={{ animation: "slideInUp 0.5s ease-out 0.2s both" }}>
  0.2 second delay
</div>
```

### **Custom Easing**
```jsx
<div className="animate-fade-in" style={{ animationTimingFunction: "linear" }}>
  Linear timing
</div>
```

### **Combine Multiple Animations**
```jsx
<div style={{
  animation: "slideInUp 0.5s ease-out, pulse 2s 0.5s infinite"
}}>
  Entrance then pulse
</div>
```

---

## 📊 Common Patterns - Copy & Use

### **Loading State Pattern**
```jsx
const [loading, setLoading] = useState(false);

return (
  <>
    {loading && <SkeletonLoader count={5} variant="card" />}
    {!loading && <YourComponent />}
  </>
);
```

### **Button with Loading**
```jsx
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  try {
    await performAction();
  } finally {
    setLoading(false);
  }
};

<AnimatedButton loading={loading} onClick={handleClick}>
  Click Me
</AnimatedButton>
```

### **Form with Alert**
```jsx
const [alert, setAlert] = useState(null);

return (
  <>
    <form onSubmit={async (e) => {
      e.preventDefault();
      try {
        await submitForm();
        setAlert({ message: "Success!", type: "success" });
      } catch (err) {
        setAlert({ message: "Error!", type: "error" });
      }
    }}>
      {/* form fields */}
    </form>
    {alert && <AnimatedAlert {...alert} onClose={() => setAlert(null)} />}
  </>
);
```

### **Stats Dashboard**
```jsx
<AnimatedStats
  stats={[
    { label: "Total", value: "250", icon: "👥", change: 5 },
    { label: "Active", value: "245", icon: "✓", change: 2 },
    { label: "Inactive", value: "5", icon: "✗", change: -1 }
  ]}
  layout="grid"
/>
```

### **Animated List**
```jsx
<AnimatedList
  items={employees}
  renderItem={(emp) => (
    <div>
      <p className="font-bold">{emp.name}</p>
      <p className="text-sm text-gray-600">{emp.position}</p>
    </div>
  )}
  onItemClick={(emp) => console.log(emp)}
/>
```

### **Modal Dialog**
```jsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <AnimatedButton onClick={() => setIsOpen(true)}>
      Open Modal
    </AnimatedButton>
    <AnimatedModal
      isOpen={isOpen}
      title="Confirm Action"
      onClose={() => setIsOpen(false)}
      footer={
        <>
          <AnimatedButton variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </AnimatedButton>
          <AnimatedButton variant="success">Confirm</AnimatedButton>
        </>
      }
    >
      Are you sure?
    </AnimatedModal>
  </>
);
```

### **Table with Animations**
```jsx
<AnimatedTable
  headers={["Name", "Email", "Position"]}
  rows={[
    { id: 1, cells: ["John", "john@email.com", "Manager"] },
    { id: 2, cells: ["Jane", "jane@email.com", "Developer"] }
  ]}
  onRowClick={(row) => console.log(row)}
/>
```

### **Sidebar Navigation**
```jsx
<div className="flex">
  <AnimatedSidebar
    items={[
      { id: "1", icon: "📊", label: "Dashboard" },
      { id: "2", icon: "👥", label: "Employees", badge: 3 },
      { id: "3", icon: "📋", label: "Reports" }
    ]}
    activeItem={activeItem}
    onItemClick={(item) => setActiveItem(item.id)}
  />
  <div className="flex-1">
    {/* Page content */}
  </div>
</div>
```

---

## 🎯 Quick Reference Table

| Need | Component | Code |
|------|-----------|------|
| Click feedback | AnimatedButton | `variant="primary"` |
| Info display | AnimatedCard | `color="blue"` |
| Stats | AnimatedStats | `layout="grid"` |
| Loading | SkeletonLoader | `variant="card"` |
| Notification | AnimatedAlert | `type="success"` |
| Pop-up | AnimatedModal | `size="md"` |
| Menu | AnimatedSidebar | Auto animated |
| Progress | AnimatedProgress | `color="blue"` |
| List | AnimatedList | Auto staggered |
| Table | AnimatedTable | Auto animated |
| Label | AnimatedBadge | `variant="success"` |
| Fade in | CSS class | `.animate-fade-in` |
| Enter from left | CSS class | `.animate-slide-in-left` |
| Hover effect | CSS class | `.hover-lift` |

---

## 🚀 Quick Start Template

### **New Animated Page**
```jsx
import React, { useState } from "react";
import {
  AnimatedPageWrapper,
  AnimatedButton,
  AnimatedCard,
  AnimatedStats,
  SkeletonLoader,
  AnimatedAlert
} from "../components/animated";

export default function MyPage() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const stats = [
    { label: "Stat 1", value: "100", icon: "📊" },
    { label: "Stat 2", value: "200", icon: "👥" }
  ];

  return (
    <AnimatedPageWrapper>
      <div className="p-6">
        <h1 className="text-3xl font-bold animate-slide-in-down mb-6">
          My Page
        </h1>

        {loading ? (
          <SkeletonLoader count={5} variant="card" />
        ) : (
          <>
            <AnimatedStats stats={stats} layout="grid" />
            
            <div className="mt-8">
              <AnimatedButton
                variant="primary"
                onClick={() => {
                  setAlert({ message: "Clicked!", type: "success" });
                }}
              >
                Click Me
              </AnimatedButton>
            </div>
          </>
        )}

        {alert && (
          <AnimatedAlert
            {...alert}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </AnimatedPageWrapper>
  );
}
```

---

## 🎨 Color Palette Reference

**Primary Colors:**
- Blue: `#3b82f6`
- Green: `#22c55e`
- Red: `#ef4444`
- Yellow: `#f59e0b`
- Purple: `#a855f7`
- Indigo: `#6366f1`

**Gradients:**
- Blue Gradient: `from-blue-600 to-blue-700`
- Green Gradient: `from-green-600 to-green-700`
- Purple Gradient: `from-purple-600 to-purple-700`

---

## ⏱️ Animation Timing Reference

**Quick animations (0.2-0.3s):**
- `.animate-button-press` - Button click feedback

**Standard animations (0.4-0.5s):**
- `.animate-fade-in` - General fades
- `.animate-slide-in-*` - Direction slides
- `.animate-scale-in` - Component pop-in

**Slow animations (0.6-1.0s):**
- `.animate-zoom-in` - Large hero entrance
- `.animate-success` - Success checkmark

**Continuous animations (1-2s+):**
- `.animate-pulse` - Loading pulse
- `.animate-spin` - Loading spinner
- `.animate-bounce` - Attention seeker

---

## 📱 Mobile-First Tips

```jsx
// Animations auto-responsive
// Shorter duration on mobile
@media (max-width: 768px) {
  .animate-fade-in {
    animation-duration: 0.25s;
  }
}

// Use in component
<div className="animate-fade-in">
  Optimized for all screens
</div>
```

---

## ✨ Pro Tips Summary

1. **Use stagger for lists** - Add `idx * 0.1s` delay
2. **Combine classes** - `animate-fade-in hover-scale transition-all`
3. **Test on mobile** - All animations work responsively
4. **Respect preferences** - Automatically disables for reduced motion users
5. **Keep <1 second** - Best UX practice
6. **Use GPU properties** - Transform, opacity only
7. **Combine effects** - Chain multiple animations
8. **Custom durations** - Use style prop for tweaks

---

Start using these snippets immediately in your code! Copy, paste, and customize as needed.

**Happy Coding!** ✨
