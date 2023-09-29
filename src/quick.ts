import { QuickParser, renderQuickNodes } from './tree/index.js';
import { QuickArg, QuickConst, QuickFun, QuickKey } from './types.js';

// Class
export class Quick {
  // Methods
  parser(): QuickParser {
    return new QuickParser();
  }

  /**
   * Parses quick marks and builds a formatter function
   */
  function<T = void>(strings: TemplateStringsArray, ...fns: (QuickArg<T> | QuickConst)[]): QuickFun<T> {
    const tree = this.parser().parse(strings);

    return (arg: T) => {
      const args = fns.map((fn) => typeof fn === 'function' ? fn(arg) : fn);
      return renderQuickNodes(tree, args);
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
    return renderQuickNodes(this.parser().parse(strings), args);
  }
}