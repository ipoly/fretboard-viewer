/**
 * Production-safe logging utility
 * Console logs are automatically removed in production builds via esbuild configuration
 */

declare const __DEV__: boolean;

export const logger = {
  log: (...args: any[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },

  debug: (...args: any[]) => {
    if (__DEV__) {
      console.debug(...args);
    }
  }
};