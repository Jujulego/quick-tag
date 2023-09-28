import { QuickArg, QuickConst } from './types.js';

// Types
export type QuickKey<T> = { [K in keyof T]: T[K] extends QuickConst ? K : never }[keyof T];

// Utils
export function quickProperty<T>(key: QuickKey<T>): QuickArg<T> {
  return (arg: T) => arg[key] as QuickConst;
}
