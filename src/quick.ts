import { QuickParser, renderQuickNodes } from './tree/index.js';
import { QuickArg, QuickCommand, QuickConst, QuickFun, QuickKey } from './types.js';

// Class
export class Quick {
  // Attributes
  private readonly _commands = new Map<string, QuickCommand>();

  // Methods
  register(command: QuickCommand): Quick {
    this._commands.set(command.name, command);
    return this;
  }

  parser(): QuickParser {
    return new QuickParser(this._commands);
  }

  /**
   * Parses quick marks and builds a formatter function
   */
  function<T = void>(strings: TemplateStringsArray, ...fns: (QuickArg<T> | QuickConst)[]): QuickFun<T> {
    const tree = this.parser().parse(strings);

    return (arg: T) => {
      const args = fns.map((fn) => typeof fn === 'function' ? fn(arg) : fn);
      return renderQuickNodes(tree, args, this._commands);
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
    return renderQuickNodes(this.parser().parse(strings), args, this._commands);
  }
}