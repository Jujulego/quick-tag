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

  it('should return json object if object has no stack property', () => {
    const obj= { life: 42 };

    expect(qerror(obj)).toMatchInlineSnapshot('"{"life":42}"');
  });

  it('should return value', () => {
    expect(qerror(42)).toBe(42);
  });
});