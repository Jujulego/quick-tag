import { QuickParser, QuickRenderer } from './tree/index.js';
import { QuickArg, QuickCommand, QuickConst, QuickFun, QuickKey } from './types.js';
import { QuickWrapper } from './quick-wrapper.js';

// Class
export class Quick {
  // Attributes
  private readonly _commands = new Map<string, QuickCommand>();

  // Methods
  register(command: QuickCommand): this {
    this._commands.set(command.name, command);
    return this;
  }

  parser(): QuickParser {
    return new QuickParser(this._commands);
  }

  renderer(): QuickRenderer {
    return new QuickRenderer(this._commands);
  }

  wrap<R>(tag: (strings: TemplateStringsArray, ...args: QuickConst[]) => R): QuickWrapper<R> {
    return new QuickWrapper<R>(tag, this._commands);
  }

  /**
   * Parses quick marks and builds a formatter function
   */
  function<T = void>(strings: TemplateStringsArray, ...fns: (QuickArg<T> | QuickConst)[]): QuickFun<T> {
    const tree = this.parser().parse(strings);
    const renderer = this.renderer();

    return (arg: T) => {
      const args = fns.map((fn) => typeof fn === 'function' ? fn(arg) : fn);
      return renderer.renderToString(tree, args);
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
  string(strings: TemplateStringsArray, ...args: QuickConst[]): string {
    return this.renderer().renderToString(this.parser().parse(strings), args);
  }
}
