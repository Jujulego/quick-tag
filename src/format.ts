import { QuickConst } from './types.js';

/**
 * Quick format function type
 */
export type QuickFormat<in A extends unknown[], R extends QuickConst> = (...args: A) => R;

/**
 * Helper to define valid quick format function
 */
export function defineQuickFormat<A extends unknown[], R extends QuickConst>(fn: (...args: A) => R): QuickFormat<A, R> {
  return fn;
}