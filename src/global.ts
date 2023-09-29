import { Quick } from './quick.js';

// Global instance
export const quick = new Quick();

// Aliases
/**
 * Parses quick marks and builds a formatter function
 */
export const qfun = quick.function.bind(quick);

/**
 * Quick property extractor
 */
export const qprop = quick.property.bind(quick);

/**
 * Parses quick marks and renders template into a string
 */
export const qstr = quick.string.bind(quick);