# EmotionSense Design Guidelines

## Design Approach

**Reference-Based Approach** inspired by leading wellness and health applications (Calm, Headspace, Apple Health, Whoop) with emphasis on trust, clarity, and emotional comfort. The design prioritizes a calming user experience while maintaining functional clarity for health data visualization.

## Core Design Principles

1. **Emotional Safety**: Soft, rounded corners and generous spacing create a non-threatening environment
2. **Data Clarity**: Clear hierarchy for real-time feedback vs. historical insights
3. **Camera-First Design**: Prominent, unobstructed camera preview with minimal UI overlay
4. **Trust Signals**: Transparent privacy controls and secure session indicators

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) for UI elements and data
- Secondary: Lexend (Google Fonts) for headings - optimized for readability

**Hierarchy**:
- Hero/Page Titles: text-4xl to text-5xl, font-semibold
- Section Headers: text-2xl to text-3xl, font-medium
- Body Text: text-base to text-lg, font-normal
- Captions/Metadata: text-sm, font-medium
- Data Points/Scores: text-6xl to text-7xl, font-bold (for emotion scores)

---

## Layout System

**Spacing Primitives**: Consistently use Tailwind units of **2, 4, 6, 8, 12, 16**
- Tight spacing: p-2, gap-2 (between related elements)
- Standard spacing: p-4, gap-4, m-6 (component internal padding)
- Section spacing: p-8, py-12, gap-8 (between major sections)
- Large gaps: py-16, gap-12 (hero sections, page divisions)

**Container Strategy**:
- App Shell: max-w-7xl mx-auto for desktop content
- Camera Preview: max-w-2xl centered for optimal face detection
- Dashboard Cards: max-w-6xl with grid layouts
- Reading Content: max-w-prose for tips and insights

---

## Component Library

### A. Navigation & Shell

**Top Navigation Bar**:
- Fixed header with backdrop-blur effect (h-16)
- Logo left, user profile/settings right
- Mobile: Hamburger menu with slide-out drawer
- Privacy indicator (small green dot) showing secure session status

**Bottom Navigation (Mobile)**:
- Fixed bottom nav with 4 tabs: Live Session, Insights, Profile, Settings
- Icon + label, active state with elevated positioning
- Uses Heroicons for consistent iconography

### B. Camera & Detection Interface

**Live Camera Preview**:
- Full-width container with 16:9 aspect ratio maintained
- Rounded corners (rounded-2xl) for softer presentation
- Face detection overlay: Subtle animated outline when face detected
- Floating controls below camera with backdrop-blur panel

**Session Controls**:
- Large primary button for Start/Stop (w-32 h-32, rounded-full)
- Secondary Pause button (w-24 h-24, rounded-full)
- Button group uses gap-4 spacing
- Icons from Heroicons (play, pause, stop)

**Real-Time Emotion Display**:
- Floating card positioned top-right of camera (on desktop) or below camera (mobile)
- Glass-morphic effect with backdrop-blur
- Current emotion label: text-2xl font-semibold
- Emotion score: text-6xl font-bold
- Confidence indicator: progress bar (h-2)

**Live Trend Micro-Chart**:
- Positioned below camera preview
- Height: h-24 to h-32
- Simple line chart showing last 60 seconds
- Minimal axes, emphasis on the curve
- Use Chart.js or Recharts for implementation

### C. Insights & History Dashboard

**Dashboard Layout**:
- Grid system: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card-based design with rounded-xl, p-6
- Hover states with subtle elevation increase

**Time Period Selector**:
- Pill-style tabs for Day/Week/Month views
- Active state with filled background
- Spacing: gap-2 between pills, p-1.5 internal padding

**Mood History Chart**:
- Large chart card spanning full width (col-span-full)
- Height: h-64 to h-96 for detailed viewing
- Multi-line chart for different emotions over time
- Legend positioned top-right within card

**Statistics Cards**:
- 3-column grid on desktop (grid-cols-3)
- Icon (h-12 w-12) with stat value (text-4xl) and label (text-sm)
- Vertical rhythm: space-y-2 within cards

**Goal Tracking Section**:
- Progress rings or bars showing goal completion
- Target vs. actual comparison
- Spacing: py-8 section padding

### D. User Profile & Settings

**Profile Header**:
- Avatar (w-24 h-24, rounded-full) with edit overlay
- Name and user info below
- Edit button positioned top-right

**Settings Sections**:
- Grouped in cards with dividers (divide-y)
- Toggle switches for privacy controls
- Each setting item: flex justify-between items-center with py-4 padding

**Privacy Controls**:
- Prominent switches for data storage and anonymization
- Warning indicators (with Heroicons alert icon) for sensitive settings
- Clear explanatory text (text-sm) below each control

### E. Motivational & Tips Components

**Relaxation Tips Card**:
- Appears contextually when stress detected
- Soft background with rounded-2xl
- Icon (h-16 w-16) at top
- Quote/tip text: text-lg font-light, leading-relaxed
- Dismiss button (text-sm) in corner

**Daily Quote Banner**:
- Full-width banner at top of insights page
- Centered text with generous padding (py-12)
- Quotation marks as decorative elements

### F. Data Export Modal

**Export Dialog**:
- Centered modal with max-w-md
- Radio group for format selection (CSV/PDF)
- Date range picker for export scope
- Primary CTA button for download
- Preview of data to be exported (scrollable, max-h-64)

---

## Animations & Interactions

**Minimal Animation Philosophy**: Use sparingly for feedback only

**Approved Animations**:
- Face detection confirmation: Gentle pulse on outline (duration-300)
- Button press feedback: Scale transform (scale-95 on active)
- Card hover: Subtle shadow increase (transition-shadow duration-200)
- Page transitions: Simple fade (opacity transitions)
- Session start: Brief expand animation on camera preview

**Prohibited**: 
- Continuous background animations
- Parallax scrolling effects
- Complex page transitions
- Animated backgrounds during camera use (performance)

---

## Responsive Breakpoints

**Mobile-First Approach**:
- Base (< 640px): Single column, stacked camera and data
- md (768px+): Two-column layouts for dashboard
- lg (1024px+): Three-column grids, side-by-side camera and real-time data
- xl (1280px+): Optimized spacing with max-w-7xl container

**Camera Preview Adaptation**:
- Mobile: Full width minus p-4 margins
- Tablet+: Centered with max-w-2xl, camera takes 60% width on split layouts

---

## Iconography

**Icon Library**: Heroicons (via CDN)
- Outline style for navigation and secondary actions
- Solid style for active states and primary indicators
- Consistent sizing: h-5 w-5 for inline, h-6 w-6 for buttons, h-8 w-8 for large touch targets

---

## Images

**Hero Section**: Not applicable - camera preview serves as the primary visual element

**Onboarding/Welcome Screen**:
- Abstract illustration representing emotional wellness (calm face, peaceful landscape)
- Positioned center, max-w-md
- Used only on initial landing before authentication

**Empty States**:
- Simple illustrations for no history data
- Centered, max-w-xs
- Soft, minimal style matching overall aesthetic

---

## Accessibility

- Minimum touch targets: 44x44px (h-11 w-11 minimum)
- ARIA labels for all camera controls and emotion indicators
- Keyboard navigation support for all interactive elements
- Focus indicators with ring-2 ring-offset-2
- High contrast ratios maintained throughout
- Screen reader announcements for emotion state changes
- Form inputs with clear labels and error states