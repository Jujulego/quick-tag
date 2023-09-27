import { parseQuickNodes } from './quick-nodes.js';

// Tag
export function quick(strings: TemplateStringsArray, ...args: unknown[]): string {
  let text = '';

  for (const node of parseQuickNodes(strings)) {
    switch (node.type) {
      case 'text':
        text += node.text;
        break;

      case 'arg':
        text += args[node.index]!;
        break;
    }
  }

  return text;
}
