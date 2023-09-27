import { quick } from '@/src/quick.js';

// Tests
describe('quick', () => {
  it('should inject args into string as with classic templates', () => {
    expect(quick`life=${42}`).toBe('life=42');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      expect(quick`test #?:${true}is so cool that it ?#is successful`).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      expect(quick`test #?:${false}is so cool that it ?#is successful`).toBe('test is successful');
    });
  });
});
