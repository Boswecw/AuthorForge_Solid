# Global Font Scale System

## Overview

AuthorForge now includes a global font scale system that allows users to adjust the text size across the entire application. This is particularly useful for accessibility and user preference customization.

## Implementation

### 1. Font Scale State Management

**File**: `src/state/fontScale.ts`

A global SolidJS signal-based state management system that:
- Provides 4 font scale options: `small` (0.9x), `normal` (1.0x), `large` (1.2x), `xlarge` (1.4x)
- Persists user preference to localStorage (`authorforge:fontScale`)
- Automatically applies scale to document via CSS custom property (`--font-scale`)
- Initializes from localStorage on app load

**Key Functions**:
- `useFontScale()` - Hook to access font scale state and setter
- `setGlobalFontScale(key)` - Updates font scale and persists to localStorage

### 2. Font Size Control Component

**File**: `src/routes/hearth/FontSizeControl.tsx`

A reusable UI component that displays font scale options as a button group:
- **A−** - Small (0.9x)
- **Default** - Normal (1.0x)
- **A+** - Large (1.2x)
- **A++** - Extra Large (1.4x)

Features:
- Visual feedback for active selection (ember gradient)
- Accessible with `aria-pressed` and `aria-label` attributes
- Matches AuthorForge design system (forge-steel borders, forge-ember highlights)

### 3. CSS Integration

**File**: `src/app.css`

The font scale is applied globally via CSS custom properties:

```css
:root {
  --font-scale: 1; /* Default, overridden by fontScale.ts */
}

html {
  font-size: calc(16px * var(--font-scale));
}

body {
  font-size: 1rem; /* Inherits scaled size from html */
}
```

This approach:
- Scales all `rem`-based font sizes throughout the app
- Maintains relative sizing relationships
- Works with Tailwind's rem-based utilities
- Affects all text, headings, and UI elements consistently

### 4. App Initialization

**File**: `src/app.tsx`

The font scale is initialized on app mount:
- Imports `useFontScale()` hook
- Calls `onMount()` to log initialization (for debugging)
- The `createEffect()` in `fontScale.ts` automatically applies the scale

## Usage

### In the Hearth Page

The `FontSizeControl` component is displayed in the header with a helpful disclaimer:

```tsx
import { FontSizeControl } from "./FontSizeControl";

<header class="flex items-start justify-between">
  <div>
    <h1>Welcome back to the Hearth</h1>
    <p>Pick up where you left off...</p>
  </div>
  <div class="flex flex-col items-end gap-1.5">
    <FontSizeControl />
    <p class="text-xs text-[rgb(var(--fg))]/60 italic max-w-[16rem] text-right">
      Adjusts text size across all pages. Your preference is saved automatically.
    </p>
  </div>
</header>
```

**User Guidance Design**:
- Subtle disclaimer beneath the control
- Small text size (`text-xs`) for minimal visual weight
- Muted color (`text-[rgb(var(--fg))]/60`) to avoid distraction
- Italic styling to differentiate from primary content
- Right-aligned to match the control above it
- Max width constraint for readability
- Explains both the global scope and auto-save behavior

### Adding to Other Pages

To add font size control to other pages:

1. Import the component:
   ```tsx
   import { FontSizeControl } from "~/routes/hearth/FontSizeControl";
   ```

2. Place it in your page header or settings area:
   ```tsx
   <FontSizeControl />
   ```

### Accessing Font Scale in Code

To read or modify font scale programmatically:

```tsx
import { useFontScale } from "~/state/fontScale";

function MyComponent() {
  const { fontScaleKey, setGlobalFontScale } = useFontScale();
  
  // Read current scale
  console.log(fontScaleKey()); // "normal", "large", etc.
  
  // Change scale
  setGlobalFontScale("large");
}
```

## How It Works

1. **User clicks a font size button** in `FontSizeControl`
2. **`setGlobalFontScale(key)` is called** with the selected key
3. **Signal updates** - `fontScaleKey` signal changes
4. **`createEffect` triggers** in `fontScale.ts`
5. **CSS variable updates** - `--font-scale` is set on `:root`
6. **Browser recalculates** all `rem` values based on new `html` font-size
7. **Preference persists** - Saved to localStorage for next session

## Benefits

✅ **Accessibility** - Users with visual impairments can increase text size  
✅ **User Preference** - Customize reading comfort  
✅ **Consistent Scaling** - All text scales proportionally  
✅ **Persistent** - Preference saved across sessions  
✅ **Performance** - CSS-based scaling is instant and efficient  
✅ **Maintainable** - Single source of truth for font scaling  

## Future Enhancements

Potential improvements:
- Add font scale control to Boundary (settings) page
- Add keyboard shortcuts (Cmd/Ctrl + Plus/Minus)
- Add more granular scale options
- Integrate with Smithy's font size controls (use rem instead of px)
- Add animation/transition when scale changes

## Technical Notes

- Uses SolidJS signals for reactive state management
- CSS custom properties for global styling
- localStorage for persistence
- Follows AuthorForge design system conventions
- Accessible with ARIA attributes
- Works with SSR (checks for `window` and `document` availability)

