import { QuickConst } from './types.js';
import { QuickArgInjector, QuickConditionInjector } from './injector.js';
import { QUICK_ARG_INJECTOR, QUICK_CONDITION_INJECTOR } from './symbols.js';
import { isQuickArgInjector, isQuickConditionInjector } from './utils/predicates.js';

/**
 * Quick format function type
 */
export type QuickFormat<in out A, in O, out R extends QuickConst = QuickConst> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends A | QuickArgInjector<any, A> | QuickConditionInjector<A>>(arg: T, opts?: O) => T extends QuickArgInjector<infer I, A>
    ? QuickArgInjector<I, R>
    : (T extends QuickConditionInjector ? QuickConditionInjector<R> : R);

/**
 * Defines a quick format function. Adds support for quick injector.
 *
 * Quick format functions can only have 2 arguments:
 * - an objet to format.
 * - an optional option object.
 */
export function defineQuickFormat<A, O, R extends QuickConst = QuickConst>(fn: (arg: A, opts?: O) => R): QuickFormat<A, O, R> {
  return ((arg: A | QuickArgInjector<unknown, A> | QuickConditionInjector, opts?: O) => {
    if (isQuickArgInjector<unknown, A>(arg)) {
      return Object.assign((val: unknown) => fn(arg(val), opts), {
        [QUICK_ARG_INJECTOR]: true as const
      });
    } else if (isQuickConditionInjector(arg)) {
      return Object.assign((val: unknown) => fn(arg(val as QuickConst) as A, opts), {
        [QUICK_CONDITION_INJECTOR]: true as const
      });
    } else {
      return fn(arg, opts);
    }
  }) as QuickFormat<A, O, R>;
}
