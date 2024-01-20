import { QuickParser } from './parser/index.js';
import { QuickArg, QuickConst } from './types.js';
import { QuickTemplateRenderer } from './renderers/template-renderer.js';

// Class
export class QuickWrapper<R> {
  // Attributes
  private readonly _renderer = new QuickTemplateRenderer();

  // Constructor
  constructor(
    private readonly wrapped: (strings: TemplateStringsArray, ...args: QuickConst[]) => R,
  ) {}

  // Methods
  /**
   * Parses quick marks and builds a formatter function
   */
  fun<T = void>(strings: TemplateStringsArray, ...fns: (QuickArg<T> | QuickConst)[]): (arg: T) => R {
    const tree = (new QuickParser()).parse(strings);

    return (arg: T) => {
      const args = fns.map((fn) => typeof fn === 'function' ? fn(arg) : fn);
      const tag = this._renderer.render(tree, args);

      return this.wrapped(tag.strings, ...tag.args);
    };
  }

  /**
   * Parses quick marks and renders template into a string
   */
  str(strings: TemplateStringsArray, ...args: QuickConst[]): R {
    const tree = (new QuickParser()).parse(strings);
    const tag = this._renderer.render(tree, args);

    return this.wrapped(tag.strings, ...tag.args);
  }
}

// Builder
export function qwrap<R>(wrapped: (strings: TemplateStringsArray, ...args: QuickConst[]) => R): QuickWrapper<R> {
  return new QuickWrapper<R>(wrapped);
}