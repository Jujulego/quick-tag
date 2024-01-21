import { QuickParentNode } from '../parser/index.js';
import { QuickConditionInjector, QuickConst } from '../types.js';
import { isQuickConditionInjector } from '../utils/predicates.js';

// Types
export type QuickRenderArg = QuickConst | QuickConditionInjector;

export interface QuickRenderContext {
  readonly conditionValue?: QuickConst;
}

/**
 * Base class for quick renderers.
 *
 * Offers utils to help with rendering tree.
 */
export abstract class QuickRenderer<R> {
  // Utils
  protected callInjector(arg: QuickRenderArg, ctx: QuickRenderContext): QuickConst {
    if (isQuickConditionInjector(arg)) {
      return arg(ctx.conditionValue);
    }

    return arg;
  }

  // Methods
  abstract render(tree: QuickParentNode, args: QuickRenderArg[], ctx?: QuickRenderContext): R;
}