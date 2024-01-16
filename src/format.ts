import { QuickConst } from './types.js';
import { QuickInjector } from './injector.js';
import { QUICK_INJECTOR } from './symbols.js';
import { isQuickInjector } from './utils/predicates.js';

/**
 * Quick format function type
 */
export type QuickFormat<in out A, in O, out R extends QuickConst = QuickConst> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends A | QuickInjector<any, A>>(arg: T, opts?: O) => T extends QuickInjector<infer T, A, infer K> ? QuickInjector<T, R, K> : R;

/**
 * Defines a quick format function.
 * Adds support for quick injector.
 */
export function defineQuickFormat<A, O, R extends QuickConst = QuickConst>(fn: (arg: A, opts?: O) => R): QuickFormat<A, O, R> {
  return ((arg: A | QuickInjector<unknown, A>, opts?: O) => {
    if (isQuickInjector<unknown, A>(arg)) {
      return Object.assign((val: unknown) => fn(arg(val), opts), {
        [QUICK_INJECTOR]: arg[QUICK_INJECTOR]
      });
    } else {
      return fn(arg, opts);
    }
  }) as QuickFormat<A, O, R>;
}
