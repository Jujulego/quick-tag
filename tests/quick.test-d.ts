import { expectTypeOf } from 'vitest';

import { Quick } from '@/src/quick.js';

// Type
export interface TestArg {
  int: number;
  boo: boolean;
  str: string;
  fun: () => string;
}

// Setup
const quick = new Quick();

// Tests
describe('Quick.property', () => {
  it('should accept every key except "fun"', () => {
    expectTypeOf(quick.property<TestArg>).parameter(0).toEqualTypeOf<'int' | 'boo' | 'str'>();
  });
});
