import { QuickCommandNode, QuickParentNode } from './nodes.js';
import { qjson } from '../formats/index.js';
import { QuickCommand, QuickConst } from '../types.js';
import { isQuickInjector } from '../utils/predicates.js';
import { QUICK_INJECTOR } from '../symbols.js';

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
  private _renderArg(arg: QuickConst): string {
    if (Array.isArray(arg) || arg?.toString === Object.prototype.toString) {
      arg = qjson(arg);
    }

    return arg === undefined || arg === null ? '' : arg.toString();
  }

  private _renderCommand(child: QuickCommandNode, args: QuickConst[]): string {
    const cmd = this.commands.get(child.name);

    if (!cmd) {
      return '';
    }

    return cmd.format(args[child.arg.index]);
  }

  renderToString(tree: QuickParentNode, args: QuickConst[], condition_value?: QuickConst): string {
    let result = '';

    for (const child of tree.children) {
      switch (child.type) {
        case 'command':
          result += this._renderCommand(child, args);
          break;

        case 'condition':
          if (args[child.value.index]) {
            result += this.renderToString(child, args, args[child.value.index]);
          }

          break;

        case 'text':
          result += child.text;
          break;

        case 'arg': {
          const arg = args[child.index];

          if (isQuickInjector<QuickConst>(arg)) {
            if (arg[QUICK_INJECTOR] !== '$') {
              throw new Error('Quick string only supports q$ injector');
            }

            result += this._renderArg(arg(condition_value));
          } else {
            result += this._renderArg(arg);
          }

          break;
        }
      }
    }

    return result;
  }

  renderToTemplateTag(tree: QuickParentNode, args: QuickConst[]): TemplateTagArgs {
    const strings: string[] = [];
    const tagArgs: QuickConst[] = [];

    for (const child of tree.children) {
      switch (child.type) {
        case 'command': {
          const arg = this._renderCommand(child, args);

          if (arg) {
            tagArgs.push(arg);
          }

          if (tagArgs.length > strings.length) {
            strings.push('');
          }

          break;
        }

        case 'condition':
          if (args[child.value.index]) {
            const cond = this.renderToTemplateTag(child, args);

            if (strings.length > tagArgs.length) {
              strings[strings.length - 1] += cond.strings[0];
              strings.push(...cond.strings.slice(1));
            } else {
              strings.push(...cond.strings);
            }

            tagArgs.push(...cond.args);
          }

          break;

        case 'text':
          if (strings.length > tagArgs.length) {
            strings[strings.length - 1] += child.text;
          } else {
            strings.push(child.text);
          }

          break;

        case 'arg':
          tagArgs.push(args[child.index]);

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
