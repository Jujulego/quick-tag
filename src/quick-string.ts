import { parseQuickNodes, renderQuickNodes } from './tree/index.js';
import { QuickConst } from './types.js';

// Tag
export function quickString(strings: TemplateStringsArray, ...args: QuickConst[]): string {
  return renderQuickNodes(parseQuickNodes(strings), args);
}

// Alias
export const qstr = quickString;