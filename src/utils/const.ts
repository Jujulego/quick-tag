import { QuickConst } from '../types.js';

export function isQuickConst(obj: unknown): obj is QuickConst {
  return ['boolean', 'number', 'string', 'undefined', 'object'].includes(typeof obj);
}
