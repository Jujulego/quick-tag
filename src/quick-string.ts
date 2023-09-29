import { QuickParser, renderQuickNodes } from './tree/index.js';
import { QuickConst } from './types.js';

// Tag
export function quickString(strings: TemplateStringsArray, ...args: QuickConst[]): string {
  const parser = new QuickParser();
  return renderQuickNodes(parser.parse(strings), args);
}

// Alias
export const qstr = quickString;