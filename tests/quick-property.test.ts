import { quickProperty } from '@/src/quick-property.js';

// Type
export interface TestArg {
  value: number | boolean;
}

// Tests
describe('quickProperty', () => {
  it('should return function extracting key from object', () => {
    const fn = quickProperty<TestArg>('value');

    expect(fn({ value: 42 })).toBe(42);
  });
});
