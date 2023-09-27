import { parseQuickNodes, renderQuickNodes } from './tree/index.js';

// Tag
export function quickString(strings: TemplateStringsArray, ...args: unknown[]): string {
  const root = parseQuickNodes(strings);
  return renderQuickNodes(root, args);
}
