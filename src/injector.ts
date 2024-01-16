import { QuickConst } from './types.js';
import { QUICK_INJECTOR } from './symbols.js';

/**
 * Argument injector
 */
export interface QuickInjector<A = any, R = A, K extends string = string> { // eslint-disable-line @typescript-eslint/no-explicit-any
  (arg: A): R;

  /**
   * Mark, indicating kind of injector
   */
  [QUICK_INJECTOR]: K;
}

/**
 * Injects quick function's argument
 */
export function qarg<T>(): QuickInjector<T, T, 'arg'> {
  return Object.assign((a: T) => a, {
    [QUICK_INJECTOR]: 'arg' as const,
  });
}

/**
 * Injects last condition value. Injects `null` if used outside a condition.
 */
export const q$: QuickInjector<QuickConst, QuickConst, '$'> = Object.assign((a: QuickConst) => a, {
  [QUICK_INJECTOR]: '$' as const,
});
