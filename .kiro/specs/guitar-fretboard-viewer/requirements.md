# Requirements Document

## Introduction

A web-based guitar fretboard application that allows users to visualize scale degrees and notes for different keys on a guitar fretboard. The application works offline and provides an interactive interface for guitar players to study scales and understand fretboard patterns.

## Glossary

- **Fretboard**: The guitar neck showing frets and strings where notes are played
- **Scale_Degree**: Numerical representation of notes within a scale (1, 2, 3, 4, 5, 6, 7)
- **Key_Selector**: UI component allowing users to choose the musical key
- **Display_Toggle**: UI component to switch between showing notes or scale degrees
- **Fret**: Vertical metal strips on guitar neck that divide the strings into semitone intervals
- **Application**: The guitar fretboard viewer web application
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript for better development experience

## Requirements

### Requirement 1: Fretboard Visualization

**User Story:** As a guitar player, I want to see a visual representation of the guitar fretboard, so that I can understand the layout of notes and frets.

#### Acceptance Criteria

1. THE Application SHALL display a guitar fretboard diagram with 6 strings and at least 24 frets
2. WHEN the fretboard is displayed, THE Application SHALL show clear visual separation between frets and strings
3. THE Application SHALL provide horizontal scrolling to view different sections of the fretboard
4. THE Application SHALL display fret number markers for easy position reference
5. THE Application SHALL display strings in standard guitar tuning order (E-A-D-G-B-E from lowest to highest)

### Requirement 2: Key Selection

**User Story:** As a musician, I want to select different musical keys, so that I can study scales in various keys.

#### Acceptance Criteria

1. THE Application SHALL provide a key selector with all 12 chromatic keys (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
2. WHEN a user selects a key, THE Application SHALL update the fretboard display to show notes/degrees for that key
3. THE Application SHALL highlight the selected key in the interface
4. WHEN the application starts, THE Application SHALL default to the key of C major

### Requirement 3: Display Mode Toggle

**User Story:** As a guitar student, I want to switch between viewing note names and scale degrees, so that I can learn both the note positions and their theoretical relationships.

#### Acceptance Criteria

1. THE Application SHALL provide a toggle control to switch between note display and scale degree display
2. WHEN displaying notes, THE Application SHALL show note names (C, D, E, F, G, A, B) on the fretboard
3. WHEN displaying scale degrees, THE Application SHALL show numerical degrees (1, 2, 3, 4, 5, 6, 7) on the fretboard
4. WHEN the toggle is activated, THE Application SHALL immediately update the fretboard display
5. THE Application SHALL maintain the current key selection when switching display modes
6. THE Application SHALL use consistent colors for the same scale degree or note across the entire fretboard

### Requirement 4: Scale Degree Calculation

**User Story:** As a music theory student, I want accurate scale degree calculations, so that I can trust the theoretical information displayed.

#### Acceptance Criteria

1. WHEN a key is selected, THE Application SHALL calculate correct scale degrees for the major scale of that key
2. THE Application SHALL display only notes that belong to the selected key's major scale
3. WHEN calculating scale degrees, THE Application SHALL use the chromatic interval pattern for major scales (W-W-H-W-W-W-H)
4. THE Application SHALL handle enharmonic equivalents correctly (e.g., F# and Gb)

### Requirement 5: Offline Functionality

**User Story:** As a musician who practices in various locations, I want the application to work without internet connection, so that I can use it anywhere.

#### Acceptance Criteria

1. THE Application SHALL function completely without internet connectivity after initial load
2. THE Application SHALL store all necessary data locally
3. THE Application SHALL not require external API calls for core functionality
4. WHEN offline, THE Application SHALL maintain full functionality for key selection and display toggling

### Requirement 6: User Interface Design

**User Story:** As a user, I want an intuitive and clean interface, so that I can focus on learning without distractions.

#### Acceptance Criteria

1. THE Application SHALL provide a clean, uncluttered interface layout
2. THE Application SHALL use clear visual indicators for interactive elements
3. THE Application SHALL ensure sufficient contrast between fretboard elements and background
4. THE Application SHALL be responsive and work on different screen sizes including iPad
5. WHEN displaying information on the fretboard, THE Application SHALL use readable font sizes and clear positioning
6. THE Application SHALL provide touch-friendly interface elements for tablet users

### Requirement 7: Technical Architecture

**User Story:** As a developer, I want to use modern, maintainable technologies, so that the application is robust and easy to develop.

#### Acceptance Criteria

1. THE Application SHALL be built using React as the primary UI framework
2. THE Application SHALL use TypeScript for type safety and better development experience
3. THE Application SHALL use modern 2025 JavaScript/TypeScript libraries for enhanced functionality
4. THE Application SHALL NOT use Tailwind CSS for styling
5. THE Application SHALL use CSS-in-JS or CSS modules for component styling
6. THE Application SHALL follow React best practices and modern patterns
7. THE Application SHALL use pnpm as the package manager for dependency management
8. THE Application SHALL use proto for toolchain management and version control

### Requirement 8: Progressive Web App Features

**User Story:** As a mobile user, I want to install the application on my device and use it like a native app, so that I can access it quickly and reliably.

#### Acceptance Criteria

1. THE Application SHALL be installable as a Progressive Web App (PWA)
2. THE Application SHALL provide an app manifest for proper installation
3. THE Application SHALL work offline after installation
4. THE Application SHALL display properly when launched from the home screen
5. THE Application SHALL cache all necessary resources for offline use

### Requirement 9: Visual Authenticity and Branding

**User Story:** As a guitar player, I want the fretboard to look realistic and the app to have a memorable identity, so that I can have an engaging and authentic learning experience.

#### Acceptance Criteria

1. THE Application SHALL display realistic string textures that differentiate between plain and wound strings
2. WHEN displaying low strings (4th, 5th, 6th strings), THE Application SHALL show wound string texture with spiral winding pattern
3. WHEN displaying high strings (1st, 2nd, 3rd strings), THE Application SHALL show smooth steel string appearance
4. THE Application SHALL include a distinctive app icon with gradient background and shadow effects
5. THE Application SHALL use consistent visual hierarchy with controls at top, fretboard in center, and legend at bottom
6. THE Application SHALL maintain visual authenticity while ensuring accessibility and readability

### Requirement 10: Deployment and Updates

**User Story:** As a developer, I want to deploy the application on GitHub Pages and provide update mechanisms, so that users can access the latest version.

#### Acceptance Criteria

1. THE Application SHALL be deployable on GitHub Pages as a static site
2. THE Application SHALL be accessible via HTTPS
3. THE Application SHALL use service worker caching strategies for offline functionality
4. WHEN users revisit the application, THE Application SHALL check for new versions by comparing cached resources
5. WHEN new versions are detected, THE Application SHALL prompt users to refresh for updates