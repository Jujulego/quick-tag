import { quick } from '@/src/quick.js';

// Tests
describe('quick', () => {
  it('should inject args into string as with classic templates', () => {
    expect(quick`life=${42}`).toBe('life=42');
  });
});
