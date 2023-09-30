import { beforeEach } from 'vitest';

import { Quick } from '@/src/quick.js';
import { QuickCommand } from '@/src/types.js';

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

  it('should inject extracted args into string', () => {
    // const formatter = quickFunction<TestArg>`life=${(arg) => arg.value}`;
    const formatter = quick.function<TestArg>`life=${(arg) => arg.value}`;

    expect(formatter({ value: 42 })).toBe('life=42');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      const formatter = quick.function<TestArg>`test #?:${(arg) => arg.value}is so cool that it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      const formatter = quick.function<TestArg>`test #?:${(arg) => arg.value}is so cool that it ?#is successful`;

      expect(formatter({ value: false })).toBe('test is successful');
    });

    it('should inject reference to condition value', () => {
      const formatter = quick.function<TestArg>`test #?:${(arg) => arg.value}is #$ so it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is true so it is successful');
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

  describe('quick commands', () => {
    it('should format object with JSON.stringify', () => {
      const command: QuickCommand = {
        name: 'test',
        format: vi.fn(() => 'life')
      };

      quick.register(command);

      expect(quick.string`#!test:${42}`).toBe('life');
      expect(command.format).toHaveBeenCalledWith(42);
    });

    it('should leave mark if command is unknown', () => {
      expect(quick.string`#!test:${42}`).toBe('#!test:42');
    });
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

    it('should format reference with JSON.stringify', () => {
      const command: QuickCommand = {
        name: 'test',
        format: vi.fn(() => 'life')
      };

      quick.register(command);

      expect(quick.string`test #?:${42}with some #!test$ ?#is successful`)
        .toBe('test with some life is successful');

      expect(command.format).toHaveBeenCalledWith(42);
    });
  });
});
