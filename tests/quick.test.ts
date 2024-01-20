import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defineQuickFormat } from '@/src/format.js';
import { q$, qarg, qprop } from '@/src/injector.js';
import { Quick } from '@/src/quick.js';

// Type
export interface TestArg {
  value: number | boolean;
}

// Setup
let quick: Quick;

beforeEach(() => {
  quick = new Quick();
});

// Tests
describe('Quick.function', () => {
  it('should inject constants into string as with classic templates', () => {
    const formatter = quick.function`life=${42}`;

    expect(formatter()).toBe('life=42');
  });

  it('should inject extracted arg into string', () => {
    // const formatter = quickFunction<TestArg>`life=${(arg) => arg.value}`;
    const formatter = quick.function<TestArg>`life=${qprop('value')}`;

    expect(formatter({ value: 42 })).toBe('life=42');
  });

  it('should inject formatted arg into string', () => {
    const format = defineQuickFormat((n: number) => n / 7);
    const formatter = quick.function<number>`life=${format(qarg<number>())}`;

    expect(formatter(42)).toBe('life=6');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      const formatter = quick.function<TestArg>`test #?:${qprop('value')}is so cool that it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      const formatter = quick.function<TestArg>`test #?:${qprop('value')}is so cool that it ?#is successful`;

      expect(formatter({ value: false })).toBe('test is successful');
    });

    it('should inject reference to condition value', () => {
      const formatter = quick.function<TestArg>`test #?:${qprop('value')}is #$ so it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is true so it is successful');
    });

    it('should inject reference to condition value using injector', () => {
      const formatter = quick.function<boolean>`test #?:${qarg()}is ${q$} so it ?#is successful`;

      expect(formatter(true)).toBe('test is true so it is successful');
    });

    it('should format condition value with format', () => {
      const fn = vi.fn(() => 'perfect');
      const format = defineQuickFormat(fn);
      const formatter = quick.function<TestArg>`test #?:${qprop('value')}is ${format(q$, { life: 42 })} so it ?#is successful`;

      expect(formatter({ value: true }))
        .toBe('test is perfect so it is successful');

      expect(fn).toHaveBeenCalledWith(true, { life: 42 });
    });
  });
});

describe('Quick.property', () => {
  it('should return function extracting key from object', () => {
    const fn = quick.property<TestArg>('value');

    expect(fn({ value: 42 })).toBe(42);
  });
});

describe('Quick.string', () => {
  it('should inject args into string as with classic templates', () => {
    expect(quick.string`life=${42}`).toBe('life=42');
  });

  it('should inject formatted args into string', () => {
    const format = defineQuickFormat((n: number) => n / 7);

    expect(quick.string`life=${format(42)}`).toBe('life=6');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      expect(quick.string`test #?:${true}is so cool that it ?#is successful`).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      expect(quick.string`test #?:${false}is so cool that it ?#is successful`).toBe('test is successful');
    });

    it('should inject reference to condition value', () => {
      expect(quick.string`test #?:${true}is #$ so it ?#is successful`).toBe('test is true so it is successful');
    });

    it('should inject reference to condition value using injector', () => {
      expect(quick.string`test #?:${true}is ${q$} so it ?#is successful`).toBe('test is true so it is successful');
    });

    it('should format condition value with format', () => {
      const fn = vi.fn(() => 'perfect');
      const format = defineQuickFormat(fn);

      expect(quick.string`test #?:${true}is ${format(q$, { life: 42 })} so it ?#is successful`)
        .toBe('test is perfect so it is successful');

      expect(fn).toHaveBeenCalledWith(true, { life: 42 });
    });
  });
});
