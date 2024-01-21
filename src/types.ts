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
 * Dynamic argument
 */
export type QuickArg<in T> = (arg: T) => QuickConst;

/**
 * Quick formatter function
 */
export type QuickFun<in T = void> = (arg: T) => string;
