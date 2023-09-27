import { QuickConditionNode, QuickParentNode, QuickRootNode } from './nodes.js';

// Parser
export function parseQuickNodes(strings: TemplateStringsArray): QuickRootNode {
  const root: QuickRootNode = { type: 'root', children: [] };
  const stack: QuickParentNode[] = [root];

  for (let i = 0; i < strings.length; ++i) {
    let node = stack[stack.length - 1]!;
    let text = strings[i]!;

    // End of condition
    const endConditionIdx = text.indexOf('?#');

    if (endConditionIdx !== -1) {
      node.children.push({ type: 'text', text: text.slice(0, endConditionIdx) });
      text = text.slice(endConditionIdx + 2);

      stack.pop();
      node = stack[stack.length - 1]!;
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

    node.children.push({ type: 'text', text });

    if (i < strings.length - 1) {
      node.children.push({ type: 'arg', index: i });
    }
  }

  return root;
}
