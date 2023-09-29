import { quickFunction } from '@/src/quick-function.js';

// Type
export interface TestArg {
  value: number | boolean;
}

// Tests
describe('quickFunction', () => {
  it('should inject constants into string as with classic templates', () => {
    const formatter = quickFunction`life=${42}`;

    expect(formatter()).toBe('life=42');
  });

  it('should inject extracted args into string', () => {
    // const formatter = quickFunction<TestArg>`life=${(arg) => arg.value}`;
    const formatter = quickFunction<TestArg>`life=${(arg) => arg.value}`;

    expect(formatter({ value: 42 })).toBe('life=42');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      const formatter = quickFunction<TestArg>`test #?:${(arg) => arg.value}is so cool that it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      const formatter = quickFunction<TestArg>`test #?:${(arg) => arg.value}is so cool that it ?#is successful`;

      expect(formatter({ value: false })).toBe('test is successful');
    });

    it('should inject reference to condition value', () => {
      const formatter = quickFunction<TestArg>`test #?:${(arg) => arg.value}is #$ so it ?#is successful`;

      expect(formatter({ value: true })).toBe('test is true so it is successful');
    });
  });
});
