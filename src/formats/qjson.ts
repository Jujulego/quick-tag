import safeStringify from 'safe-stringify';
import { defineQuickFormat } from '../format.js';

export interface QJsonOpts {
  /**
   * Set true to pretty print given object.
   * Set a number to control the indentation.
   */
  pretty?: boolean | number;
}

/**
 * Formats given object into json using JSON.stringify.
 * Handles circular references and Error object types.
 */
export const qjson = defineQuickFormat((arg: unknown, opts: QJsonOpts = {}) => {
  // Replacer
  if (arg instanceof Error) {
    const error: Record<string, unknown> = {};

    for (const propName of Object.getOwnPropertyNames(arg) as (keyof Error)[]) {
      Object.assign(error, { [propName]: arg[propName] });
    }

    arg = error;
  }

  return safeStringify(arg, { indentation: parsePrettyOpt(opts.pretty) });
});

// Utils
function parsePrettyOpt(pretty: boolean | number | undefined): number {
  switch (pretty) {
    case true:
      return 2;

    case false:
    case undefined:
      return 0;

    default:
      return Math.max(pretty, 0);
  }
}