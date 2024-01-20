// Types
export interface QuickRootNode {
  type: 'root';
  children: QuickChildrenNode[];
}

export interface QuickTextNode {
  type: 'text';
  text: string;
}

export interface QuickArgNode {
  type: 'arg';
  index: number;
}

export interface QuickConditionNode {
  type: 'condition';
  value: QuickArgNode;
  children: QuickChildrenNode[];
}

export type QuickParentNode = QuickRootNode | QuickConditionNode;
export type QuickChildrenNode = QuickTextNode | QuickArgNode | QuickConditionNode;
