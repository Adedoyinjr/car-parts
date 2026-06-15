# Turbine - Automotive Parts Platform - Technical Specification

## Dependencies

### Core
- react, react-dom, react-router-dom
- typescript, vite
- tailwindcss, postcss, autoprefixer

### UI & Animation
- gsap (ScrollTrigger, DrawSVG)
- three, @react-three/fiber, @react-three/drei
- lenis
- lucide-react
- framer-motion

### Charts & Data Visualization
- recharts

### PDF Generation
- jspdf, jspdf-autotable

### Data Export
- papaparse, xlsx

### Date & Time
- date-fns

### Forms & Validation
- zod
- react-hook-form

## Component Inventory

### Layout Components
- **Navigation** — Sticky navbar with transparent-to-blur transition, role-based links
- **Footer** — Multi-column footer with branding
- **PageTransition** — Sharp wipe transition between routes
- **Sidebar** — Admin dashboard sidebar navigation
- **ProtectedRoute** — Route guard with role-based access
- **LayoutPublic** — Public storefront wrapper (Navbar + Footer)
- **LayoutAdmin** — Admin dashboard wrapper (Sidebar + Header)

### Hero Effects
- **VelocityCanvas** — Core WebGL effect with Three.js orthographic scene, custom vertex/fragment shaders, bloom post-processing
- **ScrollMorphVideo** — Pinned video transition with WebGL wipe shader
- **LuminaCarousel** — 3D radial card carousel with glass materials
- **BlueprintSVGDraw** — Scroll-driven SVG stroke animation

### Storefront Components
- **HeroSection** — Hero with VelocityCanvas background
- **VehicleSearch** — Year/Make/Model/Part selector
- **CategoryGrid** — Category cards with icons
- **ProductCard** — Product listing card with hover effects
- **ProductCarousel** — Featured products slider
- **Newsletter** — Email subscription section
- **TrustBadges** — Feature highlights (shipping, returns, etc.)

### Admin Components
- **StatsCards** — Dashboard KPI cards
- **Charts** — Recharts area/bar/pie charts
- **DataTable** — Sortable, filterable table with pagination
- **SearchBar** — Global search with filters
- **StatusBadge** — Colored status indicators
- **DateRangePicker** — Date range selection for reports
- **ExportMenu** — PDF/CSV/Excel export dropdown
- **NotificationPanel** — In-app notification dropdown

### Shared Components
- **Modal** — Dialog for forms and confirmations
- **ConfirmDialog** — Danger action confirmation
- **Toast** — Success/error/warning notifications
- **SkeletonLoader** — Loading state placeholder
- **EmptyState** — No data illustration

## Animation Implementation Plan

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Velocity Canvas (Hero WebGL) | Three.js + UnrealBloomPass | Orthographic scene, custom shaders, instanced geometry for shards, mouse raycasting for interaction trail | High |
| Scroll Morph Video | Three.js + GSAP ScrollTrigger | Two video textures, custom wipe fragment shader, ScrollTrigger pin/scrub | High |
| Lumina Carousel | Three.js | Perspective camera, radial positioning with trig, dual-pass luminance blur materials, drag rotation | High |
| Blueprint SVG Draw | GSAP + ScrollTrigger | stroke-dashoffset animation on SVG paths, scrub-linked timeline | Medium |
| Page Transitions | GSAP | Full-screen overlay with sharp wipe animation | Medium |
| Nav Blur Transition | CSS + Scroll Listener | backdrop-filter blur transition on scroll | Low |
| Product Card Hover | Framer Motion | Scale, shadow, and translateY on hover | Low |
| Carousel Drag | Custom + GSAP | Pointer events with GSAP tween on release | Medium |
| Toast Notifications | Framer Motion | AnimatePresence enter/exit | Low |
| Modal Open/Close | Framer Motion | Scale + opacity with spring physics | Low |
| Stats Counter | GSAP | Number counting animation on mount | Low |
| Table Row Hover | CSS | Background color transition | Low |

## State & Logic Plan

### Authentication State
- useAuth hook with context
- Roles: super-admin, inventory-manager, sales-staff, customer
- Token management in localStorage
- Protected routes with role-based access control

### Cart State
- useCart hook with React context
- localStorage persistence
- Add/remove/update quantity operations
- Cart count badge sync

### Data Management
- Mock data services simulating API calls
- Product catalog with search, filter, sort
- Order management with status workflows
- Inventory tracking with transaction history
- Customer management
- Supplier management
- Reporting with date range filtering

### Admin Dashboard State
- Sidebar collapse/expand
- Notification count
- Active section tracking
- Filter/sort state for tables
- Modal open/close state

## Key Implementation Notes

1. **Velocity Canvas**: Use raw Three.js (not R3F) for the hero effect to have full control over the orthographic camera, custom shaders, and post-processing pipeline. The canvas sits as a fixed background with z-index layering.

2. **Scroll Morph Video**: Uses GSAP ScrollTrigger to pin the section and scrub a `uProgress` uniform from 0 to 1, controlling the wipe transition between two video textures.

3. **Admin Dashboard**: Full CRUD operations for all modules. Tables support sorting, pagination, and bulk actions. Charts use Recharts with custom theming to match the dark aesthetic.

4. **Role-Based Access**: Each route checks user role before rendering. Admin layout only renders for authorized roles. Navigation items are conditionally rendered based on permissions.

5. **Responsive**: Mobile-first approach. Admin sidebar becomes a drawer on mobile. Storefront grid adapts from 1 to 4 columns. Touch-friendly interactions throughout.

6. **Performance**: Code split heavy Three.js scenes. Lazy load admin dashboard. Virtualize long tables. Memoize expensive computations.
