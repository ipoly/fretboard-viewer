import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { musicalKeyArbitrary, displayModeArbitrary, propertyTestConfig } from './generators'

describe('Test Setup Verification', () => {
  it('should have vitest working correctly', () => {
    expect(true).toBe(true)
  })

  it('should have fast-check working correctly', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n
      }),
      propertyTestConfig
    )
  })

  it('should have musical key generator working', () => {
    fc.assert(
      fc.property(musicalKeyArbitrary, (key) => {
        const validKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        return validKeys.includes(key)
      }),
      propertyTestConfig
    )
  })

  it('should have display mode generator working', () => {
    fc.assert(
      fc.property(displayModeArbitrary, (mode) => {
        return mode === 'notes' || mode === 'degrees'
      }),
      propertyTestConfig
    )
  })
})