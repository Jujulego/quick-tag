import { QuickParentNode } from './nodes.js';

// Renderer
export function renderQuickNodes(node: QuickParentNode, args: unknown[]): string {
  let text = '';

  for (const child of node.children) {
    switch (child.type) {
      case 'condition':
        if (args[child.value.index]) {
          text += renderQuickNodes(child, args);
        }

        break;

      case 'text':
        text += child.text;
        break;

      case 'arg':
        text += args[child.index];
        break;
    }
  }

  return text;
}
