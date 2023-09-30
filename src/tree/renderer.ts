import { QuickCommandNode, QuickParentNode } from './nodes.js';
import { QuickCommand, QuickConst } from '../types.js';

// Renderer
export class QuickRenderer {
  // Constructor
  constructor(
    private readonly commands: Map<string, QuickCommand>
  ) {}

  // Methods
  private _renderCommand(child: QuickCommandNode, args: QuickConst[]): string {
    const cmd = this.commands.get(child.name);

    if (!cmd) {
      return '';
    }

    return cmd.format(args[child.arg.index]);
  }

  renderToString(tree: QuickParentNode, args: QuickConst[]): string {
    let text = '';

    for (const child of tree.children) {
      switch (child.type) {
        case 'command':
          text += this._renderCommand(child, args);
          break;

        case 'condition':
          if (args[child.value.index]) {
            text += this.renderToString(child, args);
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
}
