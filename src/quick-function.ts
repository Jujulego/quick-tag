import { parseQuickNodes, renderQuickNodes } from './tree/index.js';

// Types
export type QuickArg<T> = (arg: T) => unknown;
export type QuickFun<T> = (arg: T) => string;

// Builder
export function quickFunction<T>(strings: TemplateStringsArray, ...fns: QuickArg<T>[]): QuickFun<T> {
  const root = parseQuickNodes(strings);

  return (arg: T) => renderQuickNodes(root, fns.map((fn) => fn(arg)));
}

