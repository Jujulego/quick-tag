import { qstr } from '@/src/alias.js';

// Tests
describe('qstr', () => {
  it('should inject args into string as with classic templates', () => {
    expect(qstr`life=${42}`).toBe('life=42');
  });

  describe('quick conditions', () => {
    it('should inject text between #? and ?# has given value is truthy', () => {
      expect(qstr`test #?:${true}is so cool that it ?#is successful`).toBe('test is so cool that it is successful');
    });

    it('should inject text between #? and ?# has given value is falsy', () => {
      expect(qstr`test #?:${false}is so cool that it ?#is successful`).toBe('test is successful');
    });
  });
});
