import { QuickRenderArg } from './renderers/renderer.js';
import { QuickParser } from './parser/index.js';
import { QuickStringRenderer } from './renderers/string-renderer.js';
import { QuickArgInjector, QuickConst, QuickFun } from './types.js';
import { isQuickArgInjector } from './utils/predicates.js';

/**
 * Parses quick marks and builds a formatter function.
 */
export function qfun<T>(strings: TemplateStringsArray, ...fns: (QuickRenderArg | QuickArgInjector<T, QuickConst>)[]): QuickFun<T> {
  const tree = (new QuickParser()).parse(strings);
  const renderer = new QuickStringRenderer();

  return (arg: T) => {
    const args = fns.map((fn) => {
      return isQuickArgInjector<T, QuickConst>(fn) ? fn(arg) : fn;
    });

    return renderer.render(tree, args);
  };
}

/**
 * Parses quick marks and renders template into a string.
 */
export function qstr(strings: TemplateStringsArray, ...args: QuickRenderArg[]): string {
  const tree = (new QuickParser()).parse(strings);
  const renderer = new QuickStringRenderer();

  return renderer.render(tree, args);
}