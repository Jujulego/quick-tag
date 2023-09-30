import { QuickParser, QuickRenderer } from './tree/index.js';
import { QuickArg, QuickCommand, QuickConst, QuickKey } from './types.js';

// Class
export class QuickWrapper<R> {
  // Constructor
  constructor(
    private readonly wrapped: (strings: TemplateStringsArray, ...args: QuickConst[]) => R,
    private readonly commands: Map<string, QuickCommand>
  ) {}

  // Methods
  parser(): QuickParser {
    return new QuickParser(this.commands);
  }

  renderer(): QuickRenderer {
    return new QuickRenderer(this.commands);
  }

  /**
   * Parses quick marks and builds a formatter function
   */
  function<T = void>(strings: TemplateStringsArray, ...fns: (QuickArg<T> | QuickConst)[]): (arg: T) => R {
    const tree = this.parser().parse(strings);
    const renderer = this.renderer();

    return (arg: T) => {
      const args = fns.map((fn) => typeof fn === 'function' ? fn(arg) : fn);
      const tag = renderer.renderToTemplateTag(tree, args);

      return this.wrapped(tag.strings, ...tag.args);
    };
  }

  /**
   * Quick property extractor
   */
  property<T>(key: QuickKey<T>): QuickArg<T> {
    return (arg: T) => arg[key] as QuickConst;
  }

  /**
   * Parses quick marks and renders template into a string
   */
  string(strings: TemplateStringsArray, ...args: QuickConst[]): R {
    const tag = this.renderer().renderToTemplateTag(this.parser().parse(strings), args);

    return this.wrapped(tag.strings, ...tag.args);
  }
}
