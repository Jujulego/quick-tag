import { QUICK_INJECTOR } from '../symbols.js';
import { QuickInjector } from '../injector.js';
import { QuickConst } from '../types.js';

/**
 * Tests if given arg is a quick const
 * @param obj
 */
export function isQuickConst(obj: unknown): obj is QuickConst {
  return ['boolean', 'number', 'string', 'undefined', 'object'].includes(typeof obj);
}

/**
 * Tests if given arg is of QuickInjector type.
 * @param arg
 */
export function isQuickInjector<A, R = A>(arg: unknown): arg is QuickInjector<A, R> {
  return !!arg && typeof arg === 'function' && QUICK_INJECTOR in arg;
}
