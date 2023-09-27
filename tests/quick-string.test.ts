import { quickString } from '@/src/quick-string.js';

// Tests
describe('quickString', () => {
  it('should inject args into string as with classic templates', () => {
    expect(quickString`life=${42}`).toBe('life=42');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      expect(quickString`test #?:${true}is so cool that it ?#is successful`).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      expect(quickString`test #?:${false}is so cool that it ?#is successful`).toBe('test is successful');
    });
  });
});
