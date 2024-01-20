import { beforeEach, describe, expect, it } from 'vitest';

import { QuickRootNode } from '@/src/parser/index.js';
import { QuickTemplateRenderer } from '@/src/renderers/template-renderer.js';

// Setup
let renderer: QuickTemplateRenderer;

beforeEach(() => {
  renderer = new QuickTemplateRenderer();
});

// Tests
describe('QuickRenderer.render', () => {
  it('should prepare arguments for another template tag', () => {
    const root: QuickRootNode = { // qstr`a${1}b${2}c${3}`
      type: 'root',
      children: [
        { type: 'text', text: 'a' },
        { type: 'arg', index: 0 },
        { type: 'text', text: 'b' },
        { type: 'arg', index: 1 },
        { type: 'text', text: 'c' },
        { type: 'arg', index: 2 },
      ]
    };

    expect(renderer.render(root, [1, 2, 3]))
      .toEqual({
        strings: Object.assign(['a', 'b', 'c', ''], {
          raw: ['a', 'b', 'c', '']
        }),
        args: [1, 2, 3]
      });
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
        .toEqual({
          strings: Object.assign(['a', 'b', 'c'], {
            raw: ['a', 'b', 'c']
          }),
          args: [1, 2]
        });
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
        .toEqual({
          strings: Object.assign(['a', '', 'c'], {
            raw: ['a', '', 'c']
          }),
          args: [1, 2]
        });
    });

    it('should join text from outside condition', () => {
      const root: QuickRootNode = { // qstr`a#?${true}b?#c`
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          {
            type: 'condition',
            value: { type: 'arg', index: 0 },
            children: [
              { type: 'text', text: 'b' },
            ]
          },
          { type: 'text', text: 'c' },
        ]
      };

      expect(renderer.render(root, [true]))
        .toEqual({
          strings: Object.assign(['abc'], {
            raw: ['abc']
          }),
          args: []
        });
    });
  });
});
