import { QuickParentNode } from './nodes.js';
import { QuickCommand, QuickConst } from '../types.js';

// Renderer
export function renderQuickNodes(node: QuickParentNode, args: QuickConst[], commands: Map<string, QuickCommand>): string {
  let text = '';

  for (const child of node.children) {
    switch (child.type) {
      case 'command': {
        const cmd = commands.get(child.name);

        if (cmd) {
          text += cmd.format(args[child.arg.index]);
        }

        break;
      }

      case 'condition':
        if (args[child.value.index]) {
          text += renderQuickNodes(child, args, commands);
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
