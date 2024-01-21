import { QuickParentNode } from '../parser/index.js';
import { QuickConditionInjector, QuickConst } from '../types.js';
import { QuickRenderContext, QuickRenderer } from './renderer.js';

/**
 * Renders quick tree with args to a string;
 */
export class QuickStringRenderer extends QuickRenderer<string> {
  // Methods
  render(tree: QuickParentNode, args: (QuickConst | QuickConditionInjector)[], ctx: QuickRenderContext = {}): string {
    let result = '';

    for (const child of tree.children) {
      switch (child.type) {
        case 'condition': {
          const value = this.callInjector(args[child.value.index], ctx);

          if (value) {
            result += this.render(child, args, { conditionValue: value });
          }

          break;
        }

        case 'text':
          result += child.text;
          break;

        case 'arg': {
          result += this._renderArg(this.callInjector(args[child.index], ctx));
          break;
        }
      }
    }

    return result;
  }

  private _renderArg(arg: QuickConst): string {
    return arg === undefined || arg === null ? '' : arg.toString();
  }
}