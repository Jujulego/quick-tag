import { QuickArgInjector, QuickConditionInjector, QuickConst } from './types.js';
import { QUICK_ARG_INJECTOR, QUICK_CONDITION_INJECTOR } from './symbols.js';

/**
 * Injects quick function's argument
 */
export function qarg<T>(): QuickArgInjector<T> {
  return Object.assign((a: T) => a, {
    [QUICK_ARG_INJECTOR]: true as const,
  });
}

/**
 * Injects quick function's argument property
 */
export function qprop<T = Record<string, unknown>, const K extends keyof T = keyof T>(key: K): QuickArgInjector<T, T[K]> {
  return Object.assign((a: T) => a[key], {
    [QUICK_ARG_INJECTOR]: true as const,
  });
}

/**
 * Injects last condition value. Injects `null` if used outside a condition.
 */
export const q$: QuickConditionInjector = Object.assign((a: QuickConst) => a, {
  [QUICK_CONDITION_INJECTOR]: true as const,
});
