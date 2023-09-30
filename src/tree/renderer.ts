import { QuickCommandNode, QuickParentNode } from './nodes.js';
import { QuickCommand, QuickConst } from '../types.js';

// Types
export interface TemplateTagArgs {
  strings: string[];
  args: QuickConst[];
}

// Renderer
export class QuickRenderer {
  // Constructor
  constructor(
    private readonly commands: Map<string, QuickCommand>
  ) {}

  // Methods
  private _renderCommand(child: QuickCommandNode, args: QuickConst[]): string {
    const cmd = this.commands.get(child.name);

    if (!cmd) {
      return '';
    }

    return cmd.format(args[child.arg.index]);
  }

  renderToString(tree: QuickParentNode, args: QuickConst[]): string {
    let result = '';

    for (const child of tree.children) {
      switch (child.type) {
        case 'command':
          result += this._renderCommand(child, args);
          break;

        case 'condition':
          if (args[child.value.index]) {
            result += this.renderToString(child, args);
          }

          break;

        case 'text':
          result += child.text;
          break;

        case 'arg':
          result += args[child.index];
          break;
      }
    }

    return result;
  }

  renderToTemplateTag(tree: QuickParentNode, args: QuickConst[]): TemplateTagArgs {
    const result: TemplateTagArgs = {
      strings: [],
      args: [],
    };

    for (const child of tree.children) {
      switch (child.type) {
        case 'command': {
          const arg = this._renderCommand(child, args);

          if (arg) {
            result.args.push(arg);
          }

          if (result.args.length > result.strings.length) {
            result.strings.push('');
          }

          break;
        }

        case 'condition':
          if (args[child.value.index]) {
            const cond = this.renderToTemplateTag(child, args);

            result.strings.push(...cond.strings);
            result.args.push(...cond.args);
          }

          break;

        case 'text':
          result.strings.push(child.text);
          break;

        case 'arg':
          result.args.push(args[child.index]);

          if (result.args.length > result.strings.length) {
            result.strings.push('');
          }

          break;
      }
    }

    if (result.args.length === result.strings.length) {
      result.strings.push('');
    }

    return result;
  }
}
