import { QuickConditionNode, QuickParentNode, QuickRootNode } from './nodes.js';

// Parser
export function parseQuickNodes(strings: TemplateStringsArray): QuickRootNode {
  const root: QuickRootNode = { type: 'root', children: [] };
  const stack: QuickParentNode[] = [root];

  for (let i = 0; i < strings.length; ++i) {
    let node = stack[stack.length - 1]!;
    let text = strings[i]!;
    let startIdx = 0;

    while (startIdx < text.length) {
      const sheIdx = text.indexOf('#', startIdx);

      // Nothing to parse
      if (sheIdx === -1) {
        break;
      }

      // End of condition => ?#
      if (sheIdx > 0 && text[sheIdx - 1] === '?') {
        // Add final text
        node.children.push({ type: 'text', text: text.slice(0, sheIdx - 1) });

        // Update current node to parent
        stack.pop();
        node = stack[stack.length - 1]!;

        // Reduce current text
        text = text.slice(sheIdx + 1);
        startIdx = 0;

        continue;
      }

      // Condition value reference => #$
      if (node.type === 'condition' && text[sheIdx + 1] === '$') {
        // Add previous text
        node.children.push({ type: 'text', text: text.slice(0, sheIdx) });

        // Add referenced node
        node.children.push(node.value);

        // Reduce current text
        text = text.slice(sheIdx + 2);
        startIdx = 0;

        continue;
      }

      // Ignore this # and search next one
      startIdx = sheIdx + 1;
    }

    // Start of condition
    if (text.endsWith('#?:')) {
      node.children.push({ type: 'text', text: text.slice(0, -3) });

      const condition: QuickConditionNode = {
        type: 'condition',
        value: { type: 'arg', index: i },
        children: [],
      };

      node.children.push(condition);
      stack.push(condition);

      continue;
    }

    // Only text
    node.children.push({ type: 'text', text });

    if (i < strings.length - 1) {
      node.children.push({ type: 'arg', index: i });
    }
  }

  return root;
}
