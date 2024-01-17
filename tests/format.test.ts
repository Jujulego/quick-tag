import { describe, expect, it, vi } from 'vitest';

import { defineQuickFormat } from '@/src/format.js';
import { qarg } from '@/src/injector.js';
import { QUICK_INJECTOR } from '@/src/symbols.js';

// Tests
describe('defineQuickFormat', () => {
  it('should call fn with given arg and options', () => {
    const fn = vi.fn(() => 42);
    const format = defineQuickFormat(fn);

    expect(format('life', { as: 'number' })).toBe(42);

    expect(fn).toHaveBeenCalledWith('life', { as: 'number' });
  });

  it('should return an injector wrapping fn', () => {
    const fn = vi.fn(() => 42);
    const format = defineQuickFormat(fn);

    const injector = format(qarg(), { as: 'number' });
    expect(fn).not.toHaveBeenCalled();
    expect(injector[QUICK_INJECTOR]).toBe('arg');

    expect(injector('life')).toBe(42);
    expect(fn).toHaveBeenCalledWith('life', { as: 'number' });
  });
});