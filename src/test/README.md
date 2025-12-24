# Testing Setup

This directory contains the testing configuration and utilities for the Guitar Fretboard Viewer application.

## Testing Framework

- **Vitest**: Fast unit test runner that integrates with Vite
- **React Testing Library**: Testing utilities for React components
- **fast-check**: Property-based testing library for TypeScript
- **jsdom**: DOM environment for testing

## Files

- `setup.ts`: Global test setup and configuration
- `utils.tsx`: Custom render function and testing utilities
- `generators.ts`: fast-check generators for property-based testing
- `test-helpers.ts`: Additional test utilities and constants
- `setup.test.ts`: Verification tests for the testing setup

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Property-Based Testing

Property-based tests use fast-check to generate random inputs and verify universal properties. Each property test:

- Runs a minimum of 100 iterations
- Is tagged with the format: `Feature: {feature_name}, Property {number}: {property_text}`
- Validates requirements from the design document

## Writing Tests

### Unit Tests
Use React Testing Library for component testing:

```typescript
import { render, screen } from '../test/utils'
import MyComponent from './MyComponent'

test('should render correctly', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Property Tests
Use fast-check for property-based testing:

```typescript
import * as fc from 'fast-check'
import { testGenerators, propertyTestConfig } from '../test/test-helpers'

test('Property: Some universal behavior', () => {
  fc.assert(
    fc.property(testGenerators.musicalKey, (key) => {
      // Test universal property
      return someFunction(key) !== null
    }),
    propertyTestConfig
  )
})
```