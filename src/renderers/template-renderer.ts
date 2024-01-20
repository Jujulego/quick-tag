import { QuickConst } from '../types.js';
import { QuickRenderArg, QuickRenderContext, QuickRenderer } from './renderer.js';
import { QuickParentNode } from '../parser/index.js';

// Types
export interface TemplateArgs {
  readonly strings: TemplateStringsArray;
  readonly args: QuickConst[];
}

interface TemplateRenderState {
  readonly strings: string[];
  readonly args: QuickConst[];
}

/**
 * Renders quick tree with args to template args;
 */
export class QuickTemplateRenderer extends QuickRenderer<TemplateArgs> {
  // Methods
  private _merge(state: TemplateRenderState, other: TemplateArgs) {
    if (state.strings.length > state.args.length) {
      state.strings[state.strings.length - 1] += other.strings[0];
      state.strings.push(...other.strings.slice(1));
    } else {
      state.strings.push(...other.strings);
    }

    state.args.push(...other.args);
  }

  render(tree: QuickParentNode, args: QuickRenderArg[], ctx: QuickRenderContext = {}): TemplateArgs {
    const state: TemplateRenderState = { strings: [], args: [] };

    for (const child of tree.children) {
      switch (child.type) {
        case 'condition': {
          const value = this.callInjector(args[child.value.index], ctx);

          if (value) {
            const result = this.render(child, args, { conditionValue: value });
            this._merge(state, result);
          }

          break;
        }

        case 'text':
          if (state.strings.length > state.args.length) {
            state.strings[state.strings.length - 1] += child.text;
          } else {
            state.strings.push(child.text);
          }

          break;

        case 'arg':
          state.args.push(this.callInjector(args[child.index], ctx));

          if (state.args.length > state.strings.length) {
            state.strings.push('');
          }

          break;
      }
    }

    if (state.args.length === state.strings.length) {
      state.strings.push('');
    }

    return {
      strings: Object.assign(state.strings, {
        raw: [...state.strings]
      }),
      args: state.args
    };
  }
}