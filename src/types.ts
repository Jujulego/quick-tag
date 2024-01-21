import { QUICK_ARG_INJECTOR, QUICK_CONDITION_INJECTOR } from './symbols.js';

/**
 * Accepted injected args
 */
export type QuickConst =
  | string
  | number
  | boolean
  | undefined
  | null;

/**
 * Quick formatter function
 */
export type QuickFun<in T = void> = (arg: T) => string;

/**
 * Quick argument injector
 */
export interface QuickArgInjector<in A = any, out R = A> { // eslint-disable-line @typescript-eslint/no-explicit-any
  (arg: A): R;

  [QUICK_ARG_INJECTOR]: true;
}

/**
 * Quick condition injector
 */
export interface QuickConditionInjector<out R = QuickConst> {
  (arg: QuickConst): R;

  [QUICK_CONDITION_INJECTOR]: true;
}
