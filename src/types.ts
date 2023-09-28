/**
 * Accepted injected args
 */
export type QuickConst =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, unknown>
  | Array<unknown>;

/**
 * Dynamic argument
 */
export type QuickArg<T> = (arg: T) => QuickConst;
