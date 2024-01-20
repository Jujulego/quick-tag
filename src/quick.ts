import { QuickWrapper } from './quick-wrapper.js';
import { QuickParser, QuickRenderer } from './tree/index.js';
import { QuickArg, QuickConst, QuickFun, QuickKey } from './types.js';
import { isQuickConditionInjector } from './utils/predicates.js';
import { QuickArgInjector, QuickConditionInjector } from './injector.js';

// Class
export class Quick {
  // Methods
  parser(): QuickParser {
    return new QuickParser();
  }

  renderer(): QuickRenderer {
    return new QuickRenderer();
  }

  wrap<R>(tag: (strings: TemplateStringsArray, ...args: (QuickConst | QuickConditionInjector)[]) => R): QuickWrapper<R> {
    return new QuickWrapper<R>(tag);
  }

  /**
   * Parses quick marks and builds a formatter function
   */
  function<T = void>(strings: TemplateStringsArray, ...fns: (QuickConst | QuickArg<T> | QuickArgInjector<T, QuickConst> | QuickConditionInjector)[]): QuickFun<T> {
    const tree = this.parser().parse(strings);
    const renderer = this.renderer();

    return (arg: T) => {
      const args = fns.map((fn) => {
        if (isQuickConditionInjector(fn)) {
          return fn;
        } else if (typeof fn === 'function') {
          return (fn as QuickArg<T>)(arg);
        } else {
          return fn;
        }
      });
      return renderer.renderToString(tree, args);
    };
  }

  /**
   * Quick property extractor
   * @deprecated use qprop injector
   */
  property<T>(key: QuickKey<T>): QuickArg<T> {
    return (arg: T) => arg[key] as QuickConst;
  }

  /**
   * Parses quick marks and renders template into a string
   */
  string(strings: TemplateStringsArray, ...args: (QuickConst | QuickConditionInjector)[]): string {
    return this.renderer().renderToString(this.parser().parse(strings), args);
  }
}
