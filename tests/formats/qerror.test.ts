import { describe, expect, it, vi } from 'vitest';

import { qerror } from '@/src/formats/qerror.js';

// Tests
describe('qerror', () => {
  it('should print error\'s stack property', () => {
    const err= new Error('Test !');
    vi.spyOn(err, 'stack', 'get').mockReturnValue('Error: Test!');

    expect(qerror(err)).toBe('Error: Test!');
  });

  it('should print object\'s stack property', () => {
    const err= { stack: 'Error: Test!' };

    expect(qerror(err)).toBe('Error: Test!');
  });

  it('should return object if it has no stack property', () => {
    const obj= { life: 42 };

    expect(qerror(obj)).toBe(obj);
  });
});