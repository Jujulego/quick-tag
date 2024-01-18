import { defineQuickFormat } from '../format.js';
import { QuickConst } from '../types.js';

/**
 * Prints error's stack if any or use `toString()` to format object
 */
export const qerror = defineQuickFormat((err: QuickConst | Error) => {
  if (err instanceof Error || hasStack(err)) {
    return err.stack;
  }

  return err;
});

// Utils
function hasStack(err: unknown): err is { stack: string } {
  return !!err && typeof err === 'object' && 'stack' in err && typeof err.stack === 'string';
}