import { parseQuickNodes, renderQuickNodes } from './tree/index.js';

// Tag
export function quick(strings: TemplateStringsArray, ...args: unknown[]): string {
  const root = parseQuickNodes(strings);
  return renderQuickNodes(root, args);
}
