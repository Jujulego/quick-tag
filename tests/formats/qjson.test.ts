import { describe, expect, it, vi } from 'vitest';

import { qjson } from '@/src/formats/qjson.js';

// Tests
describe('qjson', () => {
  it('should use JSON.stringify on arg', () => {
    expect(qjson({ life: 42 })).toMatchInlineSnapshot('"{"life":42}"');
  });

  it('should pretty print result', () => {
    expect(qjson({ life: 42 }, { pretty: true })).toMatchInlineSnapshot(`
      "{
        "life": 42
      }"
    `);
  });

  it('should pretty print result using given indentation', () => {
    expect(qjson({ life: 42 }, { pretty: 4 })).toMatchInlineSnapshot(`
      "{
          "life": 42
      }"
    `);
  });

  it('should support circular references', () => {
    const obj = { life: 42 };
    Object.assign(obj, { obj });

    expect(qjson([obj, obj])).toMatchInlineSnapshot('"[{"life":42,"obj":"[Circular]"},{"life":42,"obj":"[Circular]"}]"');
  });

  it('should support error objects', () => {
    const err= new Error('Test !');
    vi.spyOn(err, 'stack', 'get').mockReturnValue('Error: Test!');

    expect(qjson(err)).toMatchInlineSnapshot('"{"message":"Test !","stack":"Error: Test!"}"');
  });
});
