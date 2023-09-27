import { QuickArg } from './quick-function.js';

// Utils
export function quickProperty<T>(key: keyof T): QuickArg<T> {
  return (arg: T) => arg[key];
}