import { describe, expect, it, vi } from 'vitest';

import { defineQuickFormat } from '@/src/format.js';
import { q$, qarg, qprop } from '@/src/injector.js';
import { qfun, qstr } from '@/src/quick-tags.js';

// Type
export interface TestArg {
  value: number | boolean;
}

// Tests
describe('qfun', () => {
  it('should inject constants into string as with classic templates', () => {
    const formatter = qfun<void>`life=${42}`;

    expect(formatter()).toBe('life=42');
  });

  it('should inject extracted arg into string', () => {
    // const formatter = quickFunction<TestArg>`life=${(arg) => arg.value}`;
    const formatter = qfun<TestArg>`life=${qprop('value')}`;

    expect(formatter({ value: 42 })).toBe('life=42');
  });

  it('should inject formatted arg into string', () => {
    const format = defineQuickFormat((n: number) => n / 7);
    const formatter = qfun<number>`life=${format(qarg<number>())}`;

    expect(formatter(42)).toBe('life=6');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      const formatter = qfun<TestArg>`test #?:${qprop('value')}is so cool that it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      const formatter = qfun<TestArg>`test #?:${qprop('value')}is so cool that it ?#is successful`;

      expect(formatter({ value: false })).toBe('test is successful');
    });

    it('should inject reference to condition value', () => {
      const formatter = qfun<TestArg>`test #?:${qprop('value')}is #$ so it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is true so it is successful');
    });

    it('should inject reference to condition value using injector', () => {
      const formatter = qfun<boolean>`test #?:${qarg()}is ${q$} so it ?#is successful`;

      expect(formatter(true)).toBe('test is true so it is successful');
    });

    it('should format condition value with format', () => {
      const fn = vi.fn(() => 'perfect');
      const format = defineQuickFormat(fn);
      const formatter = qfun<TestArg>`test #?:${qprop('value')}is ${format(q$, { life: 42 })} so it ?#is successful`;

      expect(formatter({ value: true }))
        .toBe('test is perfect so it is successful');

      expect(fn).toHaveBeenCalledWith(true, { life: 42 });
    });
  });
});

describe('Quick.string', () => {
  it('should inject args into string as with classic templates', () => {
    expect(qstr`life=${42}`).toBe('life=42');
  });

  it('should inject formatted args into string', () => {
    const format = defineQuickFormat((n: number) => n / 7);

    expect(qstr`life=${format(42)}`).toBe('life=6');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      expect(qstr`test #?:${true}is so cool that it ?#is successful`).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      expect(qstr`test #?:${false}is so cool that it ?#is successful`).toBe('test is successful');
    });

    it('should inject reference to condition value', () => {
      expect(qstr`test #?:${true}is #$ so it ?#is successful`).toBe('test is true so it is successful');
    });

    it('should inject reference to condition value using injector', () => {
      expect(qstr`test #?:${true}is ${q$} so it ?#is successful`).toBe('test is true so it is successful');
    });

    it('should format condition value with format', () => {
      const fn = vi.fn(() => 'perfect');
      const format = defineQuickFormat(fn);

      expect(qstr`test #?:${true}is ${format(q$, { life: 42 })} so it ?#is successful`)
        .toBe('test is perfect so it is successful');

      expect(fn).toHaveBeenCalledWith(true, { life: 42 });
    });
  });
});
