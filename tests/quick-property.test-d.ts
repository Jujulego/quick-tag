import { expectTypeOf } from 'vitest';

import { quickProperty } from '@/src/quick-property.js';

// Type
export interface TestArg {
  int: number;
  boo: boolean;
  str: string;
  fun: () => string;
}

// Tests
describe('quickProperty', () => {
  it('should accept every key except "fun"', () => {
    expectTypeOf(quickProperty<TestArg>).parameter(0).toEqualTypeOf<'int' | 'boo' | 'str'>();
  });
});
