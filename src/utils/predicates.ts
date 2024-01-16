import { QUICK_INJECTOR } from '../symbols.js';
import { QuickInjector } from '../injector.js';

/**
 * Tests if given arg is of QuickInjector type.
 * @param arg
 */
export function isQuickInjector<T, R>(arg: unknown): arg is QuickInjector<T, R> {
  return !!arg && typeof arg === 'function' && QUICK_INJECTOR in arg;
}
