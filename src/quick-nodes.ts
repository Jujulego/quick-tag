// Types
export interface QuickTextNode {
  type: 'text';
  text: string;
}

export interface QuickArgNode {
  type: 'arg';
  index: number;
}

export type QuickNode = QuickTextNode | QuickArgNode;

// Parser
export function* parseQuickNodes(strings: TemplateStringsArray): Generator<QuickNode> {
  yield { type: 'text', text: strings[0]! };

  for (let i = 1; i < strings.length; ++i) {
    yield { type: 'arg', index: i - 1 };
    yield { type: 'text', text: strings[i]! };
  }
}
