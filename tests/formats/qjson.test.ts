import { describe, expect, it, vi } from 'vitest';

import { qjson } from '@/src/formats/qjson.js';

// Tests
describe('qjson', () => {
  it('should use JSON.stringify on arg', () => {
    vi.spyOn(JSON, 'stringify');
    const obj = { life: 42 };

    expect(qjson(obj)).toMatchInlineSnapshot('"{"life":42}"');
  });

  it('should pretty print result', () => {
    vi.spyOn(JSON, 'stringify');
    const obj = { life: 42 };

    expect(qjson(obj, { pretty: true })).toMatchInlineSnapshot(`
      "{
        "life": 42
      }"
    `);
  });

  it('should pretty print result using given indentation', () => {
    vi.spyOn(JSON, 'stringify');
    const obj = { life: 42 };

    expect(qjson(obj, { pretty: 4 })).toMatchInlineSnapshot(`
      "{
          "life": 42
      }"
    `);
  });
});
