# CivicHub Design System

Welcome to the CivicHub Design System documentation. This system provides a comprehensive set of UI primitives built specifically for the CivicHub platform, ensuring a consistent, beautiful, and accessible user experience.

## Principles

1. **Glassmorphism First**: The entire design system is built around a dynamic glass physics model.
2. **Accessible**: Built on top of Radix UI primitives, ensuring keyboard navigation, screen reader support, and ARIA compliance.
3. **Composable**: Components are highly modular and can be composed to build complex interfaces.
4. **Themeable**: Powered by CSS variables, allowing seamless dark mode, light mode, and high contrast themes.

## Architecture

- **`@civichub/ui`**: The core component library.
- **`@civichub/animations`**: Shared motion curves and transitions used across the platform.
- **Tokens**: Found in `src/tokens/`, these define the colors, spacing, typography, and glass physics (levels 1, 2, and 3).

## Glass Physics Levels

The design system uses a 3-level depth system:

- **Level 1 (Deepest)**: Used for base surfaces, sidebars, and backgrounds. Lowest opacity, highest blur. (`--ch-glass-1-*`)
- **Level 2 (Middle)**: Used for cards, panels, and floating elements. Medium opacity, medium blur. (`--ch-glass-2-*`)
- **Level 3 (Highest)**: Used for dialogs, popovers, and interactive focus states. Highest opacity, crispest blur. (`--ch-glass-3-*`)

## Usage

### 1. Installation

Ensure the UI package is installed in your app:
```bash
pnpm add @civichub/ui --filter your-app
```

### 2. Import Global Styles

Import the token CSS in your app's entry file (e.g., `main.tsx` or `_app.tsx`):
```tsx
import '@civichub/ui/src/tokens/index.css';
```

### 3. Use Components

```tsx
import { GlassCard, GlassButton } from '@civichub/ui';

function Example() {
  return (
    <GlassCard>
      <h2>Hello CivicHub</h2>
      <GlassButton variant="primary">Click Me</GlassButton>
    </GlassCard>
  );
}
```

## Playground

To interactively test and view all components, run the web app and navigate to `/design`:
```bash
pnpm run dev --filter @civichub/web
```
Open `http://localhost:5173/design` to access the Design Playground.
