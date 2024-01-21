import { QuickArgInjector, QuickConditionInjector, QuickConst } from '../types.js';
import { QUICK_ARG_INJECTOR, QUICK_CONDITION_INJECTOR } from '../symbols.js';

/**
 * Tests if given arg is a quick const
 * @param obj
 */
export function isQuickConst(obj: unknown): obj is QuickConst {
  return obj === null || ['boolean', 'number', 'string', 'undefined'].includes(typeof obj);
}

/**
 * Tests if given arg is of QuickArgInjector type.
 * @param arg
 */
export function isQuickArgInjector<A, R = A>(arg: unknown): arg is QuickArgInjector<A, R> {
  return !!arg && typeof arg === 'function' && QUICK_ARG_INJECTOR in arg;
}

/**
 * Tests if given arg is of QuickConditionInjector type.
 * @param arg
 */
export function isQuickConditionInjector<R = QuickConst>(arg: unknown): arg is QuickConditionInjector<R> {
  return !!arg && typeof arg === 'function' && QUICK_CONDITION_INJECTOR in arg;
}
