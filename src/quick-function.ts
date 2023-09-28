import { parseQuickNodes, renderQuickNodes } from './tree/index.js';
import { QuickArg, QuickConst } from './types.js';

// Types
export type QuickFun<T = void> = (arg: T) => string;

// Builder
export function quickFunction<T = void>(strings: TemplateStringsArray, ...fns: (QuickArg<T> | QuickConst)[]): QuickFun<T> {
  const root = parseQuickNodes(strings);

  return (arg: T) => {
    const args = fns.map((fn) => typeof fn === 'function' ? fn(arg) : fn);
    return renderQuickNodes(root, args);
  };
}

// Alias
export const qfun = quickFunction;
