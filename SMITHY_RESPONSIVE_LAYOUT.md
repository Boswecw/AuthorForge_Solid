# Smithy Responsive Layout Implementation

## Overview

The Smithy editor now features a fully responsive layout that dynamically adjusts the editor canvas width based on the visibility state of the left rail (Binder) and right rail (Context panel).

## Implementation Details

### 1. ForgeShell Component Updates

**File**: `src/components/ForgeShell.tsx`

**Changes**:
- Modified `ForgeShellProps.children` to accept either a JSX element or a function that receives rail state
- Updated the main canvas rendering to pass rail state to function-based children:

```typescript
type ForgeShellProps = {
  // ... other props
  children: JSX.Element | ((railState: { leftOpen: boolean; rightOpen: boolean }) => JSX.Element);
};

// In the render:
<main id="main" class="min-h-[calc(100vh-3.5rem)] p-6">
  {typeof props.children === "function"
    ? props.children({ leftOpen: leftOpen(), rightOpen: rightOpen() })
    : props.children}
</main>
```

### 2. Smithy Component Updates

**File**: `src/routes/smithy/index.tsx`

**Changes**:
- Converted the ForgeShell children to a function that receives `railState`
- Implemented responsive grid layout with `classList` that adapts to rail visibility
- Added smooth transitions with `transition-all duration-300`
- Conditionally render the stats panel only when the right rail is open

**Responsive Grid Layout**:

```typescript
<div
  class="flex-1 pt-4 grid gap-4 transition-all duration-300"
  classList={{
    // Both rails open: normal 2:1 ratio (editor:stats)
    "grid-cols-[minmax(0,2fr)_minmax(0,1fr)]": railState.leftOpen && railState.rightOpen,
    
    // Left rail closed, right open: wider 3:1 ratio
    "grid-cols-[minmax(0,3fr)_minmax(0,1fr)]": !railState.leftOpen && railState.rightOpen,
    
    // Left rail open, right closed: single column (stats hidden)
    "grid-cols-1": railState.leftOpen && !railState.rightOpen,
    
    // Both rails closed: full width editor
    "max-w-none": !railState.leftOpen && !railState.rightOpen,
  }}
>
```

## Layout Behavior

### Scenario 1: Both Rails Open (Default)
- **Grid**: 2:1 ratio (editor:stats)
- **Editor Width**: ~66% of available space
- **Stats Panel**: ~33% of available space
- **Binder**: Visible on left (fixed 14rem width)

### Scenario 2: Left Rail Closed, Right Rail Open
- **Grid**: 3:1 ratio (editor:stats)
- **Editor Width**: ~75% of available space (expanded)
- **Stats Panel**: ~25% of available space
- **Binder**: Hidden

### Scenario 3: Left Rail Open, Right Rail Closed
- **Grid**: Single column
- **Editor Width**: 100% of available space
- **Stats Panel**: Hidden (not rendered)
- **Binder**: Visible on left

### Scenario 4: Both Rails Closed
- **Grid**: Single column with max-width removed
- **Editor Width**: 100% of viewport width (full screen)
- **Stats Panel**: Hidden (not rendered)
- **Binder**: Hidden

## User Controls

Users can toggle the rails using:

1. **Collapse Rail Button** (inside left rail)
   - Located at the bottom of the Binder
   - Collapses the left rail

2. **Hide Button** (inside right rail)
   - Located at the top-right of the Context panel
   - Collapses the right rail

3. **Floating Toggle Buttons** (bottom-right corner)
   - "Left rail" button - toggles Binder visibility
   - "Right rail" button - toggles Context panel visibility
   - State persists in localStorage

## Smooth Transitions

All layout changes include smooth CSS transitions:
- **Duration**: 300ms
- **Properties**: Grid column widths, element visibility
- **Effect**: Smooth expansion/contraction of editor canvas

## Benefits

1. **Distraction-Free Writing**: Close both rails for maximum writing space
2. **Flexible Workflow**: Adjust layout based on current task
3. **Persistent State**: Rail visibility preferences saved to localStorage
4. **Smooth UX**: Animated transitions prevent jarring layout shifts
5. **Responsive Design**: Editor adapts intelligently to available space

## Technical Notes

- Uses SolidJS's `classList` directive for conditional CSS classes
- Leverages Tailwind's grid utilities for responsive layouts
- Rail state managed by ForgeShell component
- State passed down via function-as-children pattern
- No additional state management needed in Smithy component

