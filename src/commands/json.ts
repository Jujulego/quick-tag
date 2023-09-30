import { QuickCommand, QuickConst } from '../types.js';

// Commands
export const QuickJsonCommand: QuickCommand = {
  name: 'json',
  format: (arg: QuickConst) => JSON.stringify(arg, null, 2),
};