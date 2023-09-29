import { QuickConditionNode, QuickParentNode, QuickRootNode } from './nodes.js';

// Parser
export class QuickParser {
  // Attributes
  readonly root: QuickRootNode = {
    type: 'root',
    children: []
  };

  private readonly stack: QuickParentNode[] = [this.root];

  // Methods
  private _addArgNode(index: number) {
    this.node.children.push({ type: 'arg', index });
  }

  private _addTextNode(text: string) {
    this.node.children.push({ type: 'text', text });
  }

  private _addConditionNode(argIndex: number) {
    const condition: QuickConditionNode = {
      type: 'condition',
      value: { type: 'arg', index: argIndex },
      children: [],
    };

    this.node.children.push(condition);
    this.stack.push(condition);
  }

  private _searchInsideMarks(text: string): string {
    let startIdx = 0;
    let usedIdx = 0;

    while (startIdx < text.length) {
      const sheIdx = text.indexOf('#', startIdx);

      // Nothing to parse
      if (sheIdx === -1) {
        break;
      }

      if (this.node.type === 'condition') {
        // End of condition => ?#
        if (sheIdx > 0 && text[sheIdx - 1] === '?') {
          // Add final text part
          this._addTextNode(text.slice(usedIdx, sheIdx - 1));
          usedIdx = startIdx = sheIdx + 1;

          // Update current node to parent
          this.stack.pop();

          continue;
        }

        // Condition value reference => #$
        if (text[sheIdx + 1] === '$') {
          // Add previous text
          this._addTextNode(text.slice(0, sheIdx));
          usedIdx = startIdx = sheIdx + 2;

          // Add referenced node
          this.node.children.push(this.node.value);

          continue;
        }
      }

      // Ignore this # and search next one
      startIdx = sheIdx + 1;
    }

    return text.slice(usedIdx);
  }

  parse(strings: readonly string[]): QuickRootNode {
    for (let i = 0; i < strings.length; ++i) {
      const text = this._searchInsideMarks(strings[i]!);

      // Start of condition
      if (text.endsWith('#?:')) {
        this._addTextNode(text.slice(0, -3));
        this._addConditionNode(i);

        continue;
      }

      // Only text
      this._addTextNode(text);

      if (i < strings.length - 1) {
        this._addArgNode(i);
      }
    }

    return this.root;
  }

  // Properties
  private get node(): QuickParentNode {
    return this.stack[this.stack.length - 1]!;
  }
}