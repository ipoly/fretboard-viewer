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
- `pnpm build:prod` - Build for production with optimizations
- `pnpm build:gh-pages` - Build for GitHub Pages deployment
- `pnpm preview` - Preview production build
- `pnpm lint` - Type check with TypeScript

## Build Optimizations

The production build includes several optimizations:

- **Bundle Splitting**: Separate chunks for vendors (React, Emotion, Zustand) and music utilities
- **Asset Optimization**: Inline small assets (<4KB), optimize chunk naming for caching
- **Code Elimination**: Remove console logs and debugger statements in production
- **Compression**: Enable CSS code splitting and esbuild minification
- **Caching**: Optimized service worker caching strategies for different asset types
- **PWA Enhancements**: Advanced caching with cleanup of outdated caches

## Deployment

### GitHub Pages

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment workflow:

1. Builds the application with the correct base URL
2. Uploads the build artifacts to GitHub Pages
3. Deploys the application with HTTPS support

To manually deploy:
1. Ensure your repository has GitHub Pages enabled
2. Push changes to the main branch
3. The GitHub Actions workflow will automatically build and deploy

### Local Testing for GitHub Pages

To test the GitHub Pages build locally:

```bash
pnpm run build:gh-pages
pnpm preview
```

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

## PWA (Progressive Web App)

This application is a fully functional PWA that can be installed on your device:

### Installation
- **Desktop**: Look for the install icon in your browser's address bar
- **Mobile**: Use "Add to Home Screen" from your browser menu

### Automatic Updates
The app automatically checks for updates and will notify you when a new version is available. Updates include:
- New features and improvements
- Icon and visual updates
- Performance enhancements

### Offline Support
Once installed, the app works offline and caches all necessary resources for a smooth experience without internet connection.

## License

MIT