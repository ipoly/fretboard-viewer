# Guitar Fretboard Viewer

Interactive guitar fretboard viewer for learning scales and music theory.

## Technology Stack

- **Package Manager**: pnpm (fast, efficient package management)
- **Toolchain Management**: proto (unified toolchain version management)
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development and optimized builds)
- **Styling**: Emotion (CSS-in-JS for component-scoped styles)
- **State Management**: Zustand (lightweight, modern state management)

## Development Setup

### Prerequisites

- [proto](https://moonrepo.dev/proto) - Toolchain version manager
- Node.js 20.11.0 (managed by proto)
- pnpm 9.15.0 (managed by proto)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Type check with TypeScript

## Project Structure

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

## Features

- Interactive guitar fretboard visualization
- Key selection for different musical keys
- Toggle between note names and scale degrees
- Responsive design for desktop and tablet
- Progressive Web App capabilities
- Offline functionality

## License

MIT