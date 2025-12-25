# Design Document: Guitar Fretboard Viewer

## Overview

The Guitar Fretboard Viewer is a Progressive Web Application built with React and TypeScript that provides an interactive visualization of guitar fretboards. The application allows users to explore different musical keys and switch between viewing note names and scale degrees, with consistent color coding for enhanced learning.

The application follows modern React patterns with functional components, hooks, and a lightweight state management approach. It's designed to work offline and can be installed as a native-like app on various devices including iPads.

## Architecture

### Technology Stack

- **Package Manager**: pnpm (fast, efficient package management)
- **Toolchain Management**: proto (unified toolchain version management)
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite (fast development and optimized builds)
- **Styling**: Emotion (CSS-in-JS for component-scoped styles)
- **State Management**: Zustand (lightweight, modern state management)
- **PWA**: vite-plugin-pwa with Workbox (service worker and caching)
- **Deployment**: GitHub Pages (static hosting)

### Application Structure

```
src/
├── components/           # React components
│   ├── Fretboard/       # Fretboard visualization components
│   ├── Controls/        # UI controls (key selector, toggle)
│   └── Layout/          # Layout and shell components
├── hooks/               # Custom React hooks
├── stores/              # Zustand stores
├── utils/               # Utility functions
│   ├── music/           # Music theory calculations
│   └── constants/       # Application constants
├── types/               # TypeScript type definitions
└── styles/              # Global styles and themes
```

### Component Hierarchy

```
App
├── Header
│   ├── AppIcon (🐽 with gradient background)
│   ├── Title
│   ├── KeySelector
│   └── DisplayToggle
├── FretboardContainer
│   ├── FretboardGrid
│   │   ├── FretMarkers
│   │   ├── StringLines (with wound string textures)
│   │   └── NotePositions[]
│   ├── FretNumbers
│   └── ScaleLegend
└── Footer
```

## Components and Interfaces

### Core Components

#### FretboardGrid Component
```typescript
interface FretboardGridProps {
  selectedKey: MusicalKey;
  displayMode: DisplayMode;
  fretCount: number;
}

interface NotePosition {
  fret: number;
  string: number;
  note: string;
  scaleDegree: number;
  color: string;
}
```

The main fretboard visualization component that renders the guitar neck with strings, frets, and note positions. Features realistic wound string textures for low strings (4th, 5th, 6th strings) using diagonal spiral gradients to simulate copper wire winding. Supports horizontal scrolling for viewing extended fret ranges.

#### KeySelector Component
```typescript
interface KeySelectorProps {
  selectedKey: MusicalKey;
  onKeyChange: (key: MusicalKey) => void;
}

type MusicalKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
```

Dropdown or button group for selecting the musical key. Updates the fretboard display when changed.

#### DisplayToggle Component
```typescript
interface DisplayToggleProps {
  displayMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
}

type DisplayMode = 'notes' | 'degrees';
```

Toggle switch between note names and scale degrees display.

### State Management

#### Application Store (Zustand)
```typescript
interface AppState {
  selectedKey: MusicalKey;
  displayMode: DisplayMode;
  fretCount: number;

  // Actions
  setSelectedKey: (key: MusicalKey) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setFretCount: (count: number) => void;
}
```

Centralized state management for application-wide settings and user preferences.

### Music Theory Utilities

#### Scale Calculation
```typescript
interface ScaleInfo {
  notes: string[];
  degrees: number[];
  intervals: number[];
}

function calculateMajorScale(rootNote: MusicalKey): ScaleInfo;
function getNoteAtPosition(string: number, fret: number): string;
function getScaleDegree(note: string, scale: ScaleInfo): number | null;
```

Core music theory functions for calculating scale notes, fretboard positions, and scale degrees.

#### Color Mapping
```typescript
interface ColorScheme {
  [key: number]: string; // Scale degree to color mapping
}

function getColorForScaleDegree(degree: number): string;
function getColorForNote(note: string, selectedKey: MusicalKey): string;
```

Consistent color coding system for visual learning enhancement.

## Visual Design Enhancements

### String Texture System

#### Wound String Visualization
The application implements realistic wound string textures for authentic guitar string appearance:

```typescript
interface StringTexture {
  stringIndex: number;
  isWound: boolean;
  gradient: string;
  thickness: number;
}

// Low strings (4th, 5th, 6th) use wound texture
const woundStringGradient = `repeating-linear-gradient(
  75deg,
  #A0826D 0px,
  #E8E8E8 0.8px,
  #F0F0F0 1.6px,
  #E8E8E8 2.4px,
  #A0826D 3.2px
)`;

// High strings (1st, 2nd, 3rd) use plain steel texture
const plainStringGradient = 'linear-gradient(to right, #F0F0F0, #D0D0D0, #F0F0F0)';
```

**Design Features:**
- **Diagonal Spiral Pattern**: 75-degree gradient angle simulates helical winding
- **Color Scheme**: Brown base (#A0826D) with light spiral texture (#E8E8E8, #F0F0F0)
- **Variable Thickness**: String thickness increases from 1st to 6th string (2px to 4.5px)
- **Enhanced Shadows**: Wound strings have additional box-shadow for 3D effect

### App Branding

#### Icon Design
```typescript
interface AppIcon {
  emoji: '🐽';
  background: LinearGradient;
  dimensions: ResponsiveDimensions;
  shadow: BoxShadow;
}

const iconBackground = `linear-gradient(135deg, #FFB6C1 0%, #FFA0B4 50%, #FF91A4 100%)`;
const iconShadow = `
  0 2px 8px rgba(0, 0, 0, 0.15),
  0 1px 3px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.2)
`;
```

**Design Features:**
- **Pig Nose Emoji**: Playful, memorable brand identity
- **Pink Gradient Background**: Three-stop gradient for depth and visual appeal
- **Rounded Corners**: 12px border-radius for modern app icon appearance
- **Multi-layer Shadow**: Outer shadow for depth, inner highlight for glossy effect
- **Responsive Sizing**: Scales from 36px to 48px based on screen size

### Layout Architecture

#### Information Hierarchy
The application follows a three-tier layout structure:

1. **Control Layer** (Top): Interactive elements for user input
   - App icon and title for branding
   - Key selector for musical key selection
   - Display toggle for note/degree switching

2. **Content Layer** (Center): Primary information display
   - Fretboard grid with scrollable interface
   - Realistic string textures and note positions
   - Fret number markers for position reference

3. **Reference Layer** (Bottom): Contextual information
   - Scale legend with color-coded degrees
   - Responsive layout for different screen sizes

This hierarchy ensures logical information flow and optimal user experience across devices.

## Data Models

### Musical Data Types

```typescript
// Core musical types
type MusicalKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type DisplayMode = 'notes' | 'degrees';

// Guitar-specific types
interface GuitarString {
  number: number;
  openNote: string;
  tuning: string;
}

interface FretPosition {
  string: number;
  fret: number;
  note: string;
  scaleDegree: number | null;
  isInScale: boolean;
}

// UI State types
interface ViewportState {
  scrollPosition: number;
  visibleFretRange: [number, number];
}

// Application configuration
interface AppConfig {
  defaultKey: MusicalKey;
  defaultDisplayMode: DisplayMode;
  maxFrets: number;
  standardTuning: string[];
  colorScheme: ColorScheme;
}
```

### Constants

```typescript
// Standard guitar tuning (low to high)
const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

// Major scale interval pattern (semitones)
const MAJOR_SCALE_INTERVALS = [2, 2, 1, 2, 2, 2, 1];

// Chromatic scale
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Color scheme for scale degrees
const SCALE_DEGREE_COLORS = {
  1: '#FF6B6B', // Root - Red
  2: '#4ECDC4', // Second - Teal
  3: '#45B7D1', // Third - Blue
  4: '#96CEB4', // Fourth - Green
  5: '#FFEAA7', // Fifth - Yellow
  6: '#DDA0DD', // Sixth - Purple
  7: '#98D8C8', // Seventh - Mint
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Display Mode Consistency
*For any* selected key and display mode toggle action, the fretboard should immediately update to show the correct information (notes or scale degrees) while maintaining the selected key, and all displayed elements should use the appropriate format for the current mode.
**Validates: Requirements 3.2, 3.3, 3.4, 3.5**

### Property 2: Key Selection Updates Fretboard
*For any* musical key selection, the fretboard display should update to show notes and scale degrees corresponding to that key's major scale, with all positions correctly calculated according to music theory.
**Validates: Requirements 2.2, 4.1**

### Property 3: Scale Theory Correctness
*For any* selected musical key, all displayed notes should belong to that key's major scale, calculated using the correct chromatic interval pattern (W-W-H-W-W-W-H), and enharmonic equivalents should be handled consistently.
**Validates: Requirements 4.2, 4.3, 4.4**

### Property 4: Color Consistency
*For any* scale degree or note displayed on the fretboard, all instances of the same degree or note should use identical colors across the entire fretboard interface.
**Validates: Requirements 3.6**

### Property 5: Version Update Detection
*For any* cached application state, when users revisit the application, version checking should correctly detect changes in resources and prompt users for updates when new versions are available.
**Validates: Requirements 9.4, 9.5**

## Error Handling

### Music Theory Errors
- **Invalid Key Selection**: Validate key inputs against the chromatic scale
- **Calculation Errors**: Handle edge cases in scale degree calculations
- **Tuning Variations**: Gracefully handle non-standard tuning inputs

### UI Interaction Errors
- **Touch/Click Failures**: Provide visual feedback for all user interactions
- **Scroll Boundaries**: Prevent scrolling beyond fretboard limits
- **Responsive Layout**: Handle extreme viewport sizes gracefully

### PWA and Offline Errors
- **Service Worker Registration**: Handle service worker registration failures
- **Cache Failures**: Provide fallback behavior when caching fails
- **Update Failures**: Handle network errors during update checks
- **Installation Errors**: Provide clear feedback for PWA installation issues

### Performance Considerations
- **Large Fretboard Rendering**: Optimize rendering for extended fret ranges
- **Color Calculation**: Cache color mappings to avoid repeated calculations
- **State Updates**: Debounce rapid state changes to prevent performance issues

## Testing Strategy

### Dual Testing Approach
The application will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs using randomized testing

### Unit Testing Focus Areas
- Component rendering with specific props
- User interaction handlers (clicks, scrolls, toggles)
- Music theory utility functions with known inputs
- PWA installation and offline functionality
- Error boundary behavior
- Responsive design at specific breakpoints

### Property-Based Testing Configuration
- **Testing Library**: fast-check for TypeScript property-based testing
- **Minimum Iterations**: 100 iterations per property test
- **Test Tagging**: Each property test tagged with format: **Feature: guitar-fretboard-viewer, Property {number}: {property_text}**

### Property Test Implementation
Each correctness property will be implemented as a property-based test:

1. **Property 1 Test**: Generate random key selections and display mode toggles, verify consistent behavior
2. **Property 2 Test**: Generate random musical keys, verify fretboard updates match music theory
3. **Property 3 Test**: Generate random keys, verify all displayed notes belong to correct scale
4. **Property 4 Test**: Generate random fretboard states, verify color consistency across positions
5. **Property 5 Test**: Generate random cache states, verify update detection logic

### Integration Testing
- End-to-end user workflows (key selection → display toggle → scroll)
- PWA installation and offline functionality
- Cross-device compatibility (desktop, tablet, mobile)
- Performance testing with extended fret ranges

### Accessibility Testing
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation
- Touch target size verification

This comprehensive testing strategy ensures both specific functionality works correctly and universal properties hold across all possible inputs, providing confidence in the application's correctness and reliability.