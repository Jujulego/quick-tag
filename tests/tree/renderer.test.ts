import { QuickRenderer } from '@/src/tree/renderer.js';
import { QuickCommand } from '@/src/types.js';
import { QuickRootNode } from '@/src/tree/index.js';

// Setup
let commands: Map<string, QuickCommand>;
let renderer: QuickRenderer;

beforeEach(() => {
  commands = new Map();
  renderer = new QuickRenderer(commands);
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

    expect(renderer.renderToString(root, [1, 2]))
      .toBe('a1b2c');
  });

  describe('with a command', () => {
    it('should call command format on argument and inject result in final string', () => {
      const root: QuickRootNode = { // qstr`a${1}#!life:${2}c`
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          { type: 'arg', index: 0 },
          {
            type: 'command',
            name: 'life',
            arg: { type: 'arg', index: 1 },
          },
          { type: 'text', text: 'c' },
        ]
      };

      const command: QuickCommand = {
        name: 'life',
        format: vi.fn(() => 'life'),
      };

      commands.set('life', command);

      expect(renderer.renderToString(root, [1, 42]))
        .toBe('a1lifec');

      expect(command.format).toHaveBeenCalledWith(42);
    });

    it('should ignore unknown command', () => {
      const root: QuickRootNode = { // qstr`a${1}#!life:${2}c`
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          { type: 'arg', index: 0 },
          {
            type: 'command',
            name: 'life',
            arg: { type: 'arg', index: 1 },
          },
          { type: 'text', text: 'c' },
        ]
      };

      expect(renderer.renderToString(root, [1, 42]))
        .toBe('a1c');
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

      expect(renderer.renderToString(root, [1, true, 2]))
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

      expect(renderer.renderToString(root, [1, false, 2]))
        .toBe('a12c');
    });
  });
});

describe('QuickRenderer.renderToTemplateTag', () => {
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

    expect(renderer.renderToTemplateTag(root, [1, 2, 3]))
      .toEqual({
        strings: Object.assign(['a', 'b', 'c', ''], {
          raw: ['a', 'b', 'c', '']
        }),
        args: [1, 2, 3]
      });
  });

  describe('with a command', () => {
    it('should call command format on argument and inject result in final string', () => {
      const root: QuickRootNode = { // qstr`a${1}#!life:${2}c`
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          { type: 'arg', index: 0 },
          {
            type: 'command',
            name: 'life',
            arg: { type: 'arg', index: 1 },
          },
          { type: 'text', text: 'c' },
        ]
      };

      const command: QuickCommand = {
        name: 'life',
        format: vi.fn(() => 'life'),
      };

      commands.set('life', command);

      expect(renderer.renderToTemplateTag(root, [1, 42]))
        .toEqual({
          strings: Object.assign(['a', '', 'c'], {
            raw: ['a', '', 'c'],
          }),
          args: [1, 'life'],
        });

      expect(command.format).toHaveBeenCalledWith(42);
    });

    it('should ignore unknown command', () => {
      const root: QuickRootNode = { // qstr`a${1}#!life:${2}c`
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          { type: 'arg', index: 0 },
          {
            type: 'command',
            name: 'life',
            arg: { type: 'arg', index: 1 },
          },
          { type: 'text', text: 'c' },
        ]
      };

      expect(renderer.renderToTemplateTag(root, [1, 42]))
        .toEqual({
          strings: Object.assign(['a', 'c'], {
            raw: ['a', 'c'],
          }),
          args: [1]
        });
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

      expect(renderer.renderToTemplateTag(root, [1, true, 2]))
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

      expect(renderer.renderToTemplateTag(root, [1, false, 2]))
        .toEqual({
          strings: Object.assign(['a', '', 'c'], {
            raw: ['a', '', 'c']
          }),
          args: [1, 2]
        });
    });
  });
});
