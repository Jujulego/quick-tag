import { QuickConst } from './types.js';

/**
 * Quick format function type
 */
export type QuickFormat<in A extends any[]> = (...args: A) => QuickConst; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Helper to define valid quick format function
 */
export function defineQuickFormat<A extends []>(fn: (...args: A) => QuickConst): QuickFormat<A> {
  return fn;
}