import { beforeEach, describe, expect, it } from 'vitest';

import { QuickRootNode } from '@/src/parser/index.js';
import { QuickStringRenderer } from '@/src/renderers/string-renderer.js';

// Setup
let renderer: QuickStringRenderer;

beforeEach(() => {
  renderer = new QuickStringRenderer();
});

// Tests
describe('QuickRenderer.renderToString', () => {
  it('should concatenates text nodes with arg nodes into a string', () => {
    const root: QuickRootNode = { // qstr`a${1}b${2}c`
      type: 'root',
      children: [
        { type: 'text', text: 'a' },
        { type: 'arg', index: 0 },
        { type: 'text', text: 'b' },
        { type: 'arg', index: 1 },
        { type: 'text', text: 'c' },
      ]
    };

    expect(renderer.render(root, [1, 2]))
      .toBe('a1b2c');
  });

  describe('with a condition', () => {
    it('should render inside of the condition as its value is true', () => {
      const root: QuickRootNode = { // qstr`a${1}#?:${true}b?#${2}c`
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          { type: 'arg', index: 0 },
          {
            type: 'condition',
            value: { type: 'arg', index: 1 },
            children: [
              { type: 'text', text: 'b' },
            ]
          },
          { type: 'arg', index: 2 },
          { type: 'text', text: 'c' },
        ]
      };

      expect(renderer.render(root, [1, true, 2]))
        .toBe('a1b2c');
    });

    it('should not render inside of the condition as its value is false', () => {
      const root: QuickRootNode = { // qstr`a${1}#?:${false}b?#${2}c`
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          { type: 'arg', index: 0 },
          {
            type: 'condition',
            value: { type: 'arg', index: 1 },
            children: [
              { type: 'text', text: 'b' },
            ]
          },
          { type: 'arg', index: 2 },
          { type: 'text', text: 'c' },
        ]
      };

      expect(renderer.render(root, [1, false, 2]))
        .toBe('a12c');
    });
  });
});
