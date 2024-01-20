import { describe, expect, it, vi } from 'vitest';

import { QuickJsonCommand } from '@/src/commands/json.js';
import { QuickConst } from '@/src/types.js';

// Tests
describe('QuickJsonCommand', () => {
  it('should use JSON.stringify on arg', () => {
    vi.spyOn(JSON, 'stringify');
    const obj = { life: 42 };

    expect(QuickJsonCommand.format(obj as unknown as QuickConst)).toMatchInlineSnapshot(`
      "{
        "life": 42
      }"
    `);

    expect(JSON.stringify).toHaveBeenCalledWith(obj, null, 2);
  });
});
