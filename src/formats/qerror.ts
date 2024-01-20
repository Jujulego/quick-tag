import { defineQuickFormat } from '../format.js';
import { isQuickConst } from '../utils/predicates.js';
import { qjson, QJsonOpts } from './qjson.js';

/**
 * Returns error's stack if any.
 * If err is a valid {@link QuickConst}, return it as is, else it will use {@link qjson} to stringify it.
 */
export const qerror = defineQuickFormat((err: unknown, opts?: QJsonOpts) => {
  if (err instanceof Error) {
    return err.stack;
  }

  if (!isQuickConst(err)) {
    if (hasStack(err)) {
      return err.stack;
    } else {
      return qjson(err, opts);
    }
  }

  return err;
});

// Utils
function hasStack(err: unknown): err is { stack: string } {
  return !!err && typeof err === 'object' && 'stack' in err && typeof err.stack === 'string';
}