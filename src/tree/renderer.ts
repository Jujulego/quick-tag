import { QuickParentNode } from './nodes.js';
import { QuickConst } from '../types.js';

// Renderer
export function renderQuickNodes(node: QuickParentNode, args: QuickConst[]): string {
  let text = '';

  for (const child of node.children) {
    switch (child.type) {
      case 'command':
        if (child.name === 'json') {
          text += JSON.stringify(args[child.arg.index]);
        }

        break;

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
