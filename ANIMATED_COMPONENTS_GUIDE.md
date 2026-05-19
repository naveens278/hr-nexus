# 🎨 HR-NEXUS Animated Platform - Component Guide

Welcome to the enhanced animated platform! This guide shows all available animated components and their usage.

## 📦 Available Animated Components

### 1. **AnimatedPageWrapper**
Wraps pages with fade-in animations
```jsx
import AnimatedPageWrapper from "./components/AnimatedPageWrapper";

<AnimatedPageWrapper delay={0.1}>
  <YourPageContent />
</AnimatedPageWrapper>
```

### 2. **AnimatedCard**
Reusable card component with hover animations
```jsx
import AnimatedCard from "./components/AnimatedCard";

<AnimatedCard
  title="Total Employees"
  value="250"
  icon="👥"
  color="blue"
  trend={5}
  delay={0}
/>
```
**Props:**
- `title`: Card title
- `value`: Main value to display
- `icon`: Emoji or icon
- `color`: "blue", "green", "red", "purple", "yellow", "indigo"
- `trend`: Percentage change (optional)
- `subtitle`: Subtitle text
- `delay`: Animation delay in seconds
- `onClick`: Click handler
- `children`: Additional content

### 3. **AnimatedButton**
Enhanced button with loading states and variants
```jsx
import AnimatedButton from "./components/AnimatedButton";

<AnimatedButton
  variant="primary"
  size="md"
  loading={isLoading}
  onClick={handleClick}
>
  Click Me
</AnimatedButton>
```
**Props:**
- `variant`: "primary", "secondary", "success", "danger", "warning", "outline"
- `size`: "sm", "md", "lg"
- `loading`: Show loading spinner
- `disabled`: Disable button
- `icon`: React icon component

### 4. **SkeletonLoader**
Animated skeleton for loading states
```jsx
import SkeletonLoader from "./components/SkeletonLoader";

<SkeletonLoader count={5} variant="card" />
```
**Variants:**
- "card": Card skeleton
- "table": Table skeleton
- "badge": Badge skeleton
- "text": Text skeleton

### 5. **AnimatedAlert**
Toast notification with auto-dismiss
```jsx
import AnimatedAlert from "./components/AnimatedAlert";

<AnimatedAlert
  message="Operation successful!"
  type="success"
  duration={5000}
  onClose={() => {}}
/>
```
**Types:** "success", "error", "warning", "info"

### 6. **AnimatedModal**
Dialog modal with smooth animations
```jsx
import AnimatedModal from "./components/AnimatedModal";

<AnimatedModal
  isOpen={isOpen}
  title="Confirm Action"
  onClose={() => setIsOpen(false)}
  size="md"
  footer={<YourFooter />}
>
  Modal content here
</AnimatedModal>
```
**Sizes:** "sm", "md", "lg", "xl"

### 7. **AnimatedNavbar**
Navigation bar with dropdown menu
```jsx
import AnimatedNavbar from "./components/AnimatedNavbar";

<AnimatedNavbar
  title="HR-NEXUS"
  user={{ name: "John Doe" }}
  onLogout={handleLogout}
  menuItems={[
    { label: "Dashboard", action: "dashboard" }
  ]}
/>
```

### 8. **AnimatedSidebar**
Collapsible sidebar navigation
```jsx
import AnimatedSidebar from "./components/AnimatedSidebar";

<AnimatedSidebar
  items={[
    { id: "1", icon: "📊", label: "Dashboard", badge: 3 }
  ]}
  activeItem="1"
  onItemClick={handleClick}
  collapsed={false}
/>
```

### 9. **AnimatedStats**
Statistics display with animated counters
```jsx
import AnimatedStats from "./components/AnimatedStats";

<AnimatedStats
  stats={[
    { label: "Total Employees", value: "250", icon: "👥", change: 5 }
  ]}
  layout="grid"
/>
```
**Layouts:** "grid", "horizontal", "vertical"

### 10. **AnimatedList**
List with smooth item animations
```jsx
import AnimatedList from "./components/AnimatedList";

<AnimatedList
  items={items}
  renderItem={(item) => <div>{item.name}</div>}
  onItemClick={handleClick}
  emptyMessage="No items found"
/>
```

### 11. **AnimatedTable**
Table with animated rows and headers
```jsx
import AnimatedTable from "./components/AnimatedTable";

<AnimatedTable
  headers={["Name", "Email", "Position"]}
  rows={[
    { id: 1, cells: ["John", "john@example.com", "Manager"] }
  ]}
  onRowClick={handleClick}
/>
```

### 12. **AnimatedProgress**
Animated progress bar
```jsx
import AnimatedProgress from "./components/AnimatedProgress";

<AnimatedProgress
  value={75}
  max={100}
  label="Completion"
  color="blue"
  size="md"
/>
```
**Colors:** "blue", "green", "red", "yellow", "purple"

### 13. **AnimatedBadge**
Animated badge/pill component
```jsx
import AnimatedBadge from "./components/AnimatedBadge";

<AnimatedBadge
  variant="success"
  size="md"
  removable={true}
  onRemove={handleRemove}
>
  Active
</AnimatedBadge>
```
**Variants:** "primary", "secondary", "success", "danger", "warning", "purple"

## 🎬 CSS Animation Classes

Use these utility classes directly in your components:

### Entrance Animations
- `.animate-fade-in` - Fade in smoothly
- `.animate-slide-in-down` - Slide down from top
- `.animate-slide-in-up` - Slide up from bottom
- `.animate-slide-in-left` - Slide from left
- `.animate-slide-in-right` - Slide from right
- `.animate-scale-in` - Scale in from small
- `.animate-zoom-in` - Zoom in effect

### Continuous Animations
- `.animate-pulse` - Pulsing effect
- `.animate-spin` - Rotating spin
- `.animate-bounce` - Bouncing effect
- `.animate-bounce-slow` - Slow bounce
- `.animate-glow` - Glowing shadow

### Interactive Animations
- `.animate-shake` - Shake effect
- `.animate-wiggle` - Wiggle effect
- `.animate-success` - Success checkmark animation
- `.animate-button-press` - Button press animation

### Hover Effects
- `.hover-lift` - Lift on hover
- `.hover-scale` - Scale on hover
- `.hover-glow` - Glow on hover
- `.hover-shadow` - Shadow on hover
- `.hover-darken` - Darken on hover

### Focus States
- `.focus-ring` - Focus ring
- `.focus-glow` - Glow on focus

### Transitions
- `.transition-all` - All properties (0.3s)
- `.transition-all-slow` - All properties (0.5s)
- `.transition-colors` - Color properties
- `.transition-transform` - Transform properties
- `.transition-opacity` - Opacity property

### Status Classes
- `.status-loading` - Loading pulse
- `.status-success` - Success animation
- `.status-error` - Error shake
- `.status-warning` - Warning wiggle

## 🎯 Usage Examples

### Example 1: Dashboard Page
```jsx
import AnimatedPageWrapper from "./components/AnimatedPageWrapper";
import AnimatedStats from "./components/AnimatedStats";
import AnimatedCard from "./components/AnimatedCard";

export default function Dashboard() {
  return (
    <AnimatedPageWrapper>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 animate-slide-in-down">
          Dashboard
        </h1>
        
        <AnimatedStats
          stats={[
            { label: "Total Employees", value: "250", icon: "👥", change: 5 },
            { label: "Present Today", value: "245", icon: "✓", change: 2 }
          ]}
          layout="grid"
        />
      </div>
    </AnimatedPageWrapper>
  );
}
```

### Example 2: List Page
```jsx
import AnimatedList from "./components/AnimatedList";
import SkeletonLoader from "./components/SkeletonLoader";

export default function EmployeeList() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  return (
    <div className="p-6">
      <AnimatedList
        items={employees}
        loading={loading}
        SkeletonComponent={() => <SkeletonLoader count={5} variant="card" />}
        renderItem={(emp) => (
          <div>
            <p className="font-bold">{emp.name}</p>
            <p className="text-sm text-gray-600">{emp.position}</p>
          </div>
        )}
      />
    </div>
  );
}
```

### Example 3: Form Page
```jsx
import AnimatedButton from "./components/AnimatedButton";
import AnimatedAlert from "./components/AnimatedAlert";

export default function AddEmployee() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Submit logic
      setAlert({ message: "Employee added successfully!", type: "success" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="block font-semibold mb-2">Name</label>
          <input type="text" className="border rounded px-3 py-2 w-full" />
        </div>
        
        <div className="form-group">
          <label className="block font-semibold mb-2">Email</label>
          <input type="email" className="border rounded px-3 py-2 w-full" />
        </div>

        <AnimatedButton type="submit" loading={loading}>
          Add Employee
        </AnimatedButton>
      </form>

      {alert && (
        <AnimatedAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
```

## ⚙️ Customization

### Adding Custom Animations
Edit `src/assets/styles/animations.css` to add your own keyframes:

```css
@keyframes myCustomAnimation {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-my-animation {
  animation: myCustomAnimation 0.5s ease-out;
}
```

### Tweaking Animation Timings
Modify animation durations in the CSS classes or pass custom `style` props:

```jsx
<div style={{ animation: `fadeIn 1s ease-out` }}>
  Custom timing
</div>
```

### Respecting Prefers-Reduced-Motion
The animations automatically respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

## 🚀 Performance Tips

1. **Use proper keys**: Always provide unique keys for lists
2. **Lazy load components**: Use React.lazy for route-based code splitting
3. **Debounce handlers**: Debounce click handlers in lists
4. **Optimize images**: Use optimized image formats
5. **Monitor animations**: Use Chrome DevTools Performance tab

## 🎨 Color Palette

The animations use this consistent color palette:
- Primary: `#3b82f6` (Blue)
- Success: `#22c55e` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Yellow)
- Purple: `#a855f7`
- Indigo: `#6366f1`

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [React Motion Patterns](https://react.dev)

---

**Happy Animating!** ✨
