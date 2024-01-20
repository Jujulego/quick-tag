import { QuickCommandNode, QuickParentNode } from './nodes.js';
import { QuickCommand, QuickConst } from '../types.js';
import { isQuickConditionInjector } from '../utils/predicates.js';
import type { QuickConditionInjector } from '../injector.js';

// Types
export interface TemplateTagArgs {
  strings: TemplateStringsArray;
  args: QuickConst[];
}

// Renderer
export class QuickRenderer {
  // Constructor
  constructor(
    private readonly commands: Map<string, QuickCommand>
  ) {}

  // Methods
  private _callInjector(arg: QuickConst | QuickConditionInjector, conditionValue?: QuickConst): QuickConst {
    if (isQuickConditionInjector(arg)) {
      return arg(conditionValue);
    } else {
      return arg;
    }
  }

  private _renderArg(arg: QuickConst): string {
    return arg === undefined || arg === null ? '' : arg.toString();
  }

  private _renderCommand(child: QuickCommandNode, arg: QuickConst): string {
    const cmd = this.commands.get(child.name);

    if (!cmd) {
      return '';
    }

    return cmd.format(arg);
  }

  renderToString(tree: QuickParentNode, args: (QuickConst | QuickConditionInjector)[], conditionValue?: QuickConst): string {
    let result = '';

    for (const child of tree.children) switch (child.type) {
      case 'command':
        result += this._renderCommand(child, this._callInjector(args[child.arg.index], conditionValue));
        break;

      case 'condition': {
        const value = this._callInjector(args[child.value.index], conditionValue);

        if (args[child.value.index]) {
          result += this.renderToString(child, args, value);
        }

        break;
      }

      case 'text':
        result += child.text;
        break;

      case 'arg': {
        result += this._renderArg(this._callInjector(args[child.index], conditionValue));
        break;
      }
    }

    return result;
  }

  renderToTemplateTag(tree: QuickParentNode, args: (QuickConst | QuickConditionInjector)[], conditionValue?: QuickConst): TemplateTagArgs {
    const strings: string[] = [];
    const tagArgs: QuickConst[] = [];

    for (const child of tree.children) {
      switch (child.type) {
        case 'command': {
          const arg = this._renderCommand(child, this._callInjector(args[child.arg.index], conditionValue));

          if (arg) {
            tagArgs.push(arg);
          }

          if (tagArgs.length > strings.length) {
            strings.push('');
          }

          break;
        }

        case 'condition': {
          const value = this._callInjector(args[child.value.index], conditionValue);

          if (value) {
            const cond = this.renderToTemplateTag(child, args, value);

            if (strings.length > tagArgs.length) {
              strings[strings.length - 1] += cond.strings[0];
              strings.push(...cond.strings.slice(1));
            } else {
              strings.push(...cond.strings);
            }

            tagArgs.push(...cond.args);
          }

          break;
        }

        case 'text':
          if (strings.length > tagArgs.length) {
            strings[strings.length - 1] += child.text;
          } else {
            strings.push(child.text);
          }

          break;

        case 'arg':
          tagArgs.push(this._callInjector(args[child.index], conditionValue));

          if (tagArgs.length > strings.length) {
            strings.push('');
          }

          break;
      }
    }

    if (tagArgs.length === strings.length) {
      strings.push('');
    }

    return {
      strings: Object.assign(strings, {
        raw: [...strings]
      }),
      args: tagArgs
    };
  }
}
