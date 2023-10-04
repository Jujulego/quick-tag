/**
 * Accepted injected args
 */
export type QuickConst =
  | string
  | number
  | boolean
  | undefined
  | null
  | object;

/**
 * Dynamic argument
 */
export type QuickArg<T> = (arg: T) => QuickConst;

/**
 * Quick formatter function
 */
export type QuickFun<T = void> = (arg: T) => string;

/**
 * Extract keys of object to QuickConst values
 */
export type QuickKey<T> = { [K in keyof T]: T[K] extends QuickConst ? K : never }[keyof T];

/**
 * Registrable quick command
 */
export interface QuickCommand {
  name: string;
  format: (arg: QuickConst) => string;
}
