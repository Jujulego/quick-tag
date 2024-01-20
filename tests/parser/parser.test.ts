import { beforeEach, describe, expect, it } from 'vitest';

import { QuickParser } from '@/src/parser/parser.js';

// Setup
let parser: QuickParser;

beforeEach(() => {
  parser = new QuickParser();
});

// Tests
describe('QuickParser.parse', () => {
  it('should map strings to text nodes with arg nodes between (no mark case)', () => {
    expect(parser.parse(['a', 'b', 'c']))
      .toEqual({
        type: 'root',
        children: [
          { type: 'text', text: 'a' },
          { type: 'arg', index: 0 },
          { type: 'text', text: 'b' },
          { type: 'arg', index: 1 },
          { type: 'text', text: 'c' },
        ]
      });
  });

  describe('with a condition', () => {
    it('should insert a condition node in place of condition mark', () => {
      expect(parser.parse(['a', '#?:', 'b', '?#', 'c']))
        .toEqual({
          type: 'root',
          children: [
            { type: 'text', text: 'a' },
            { type: 'arg', index: 0 },
            {
              type: 'condition',
              value: { type: 'arg', index: 1 },
              children: [
                { type: 'text', text: 'b' },
                { type: 'arg', index: 2 },
              ]
            },
            { type: 'arg', index: 3 },
            { type: 'text', text: 'c' },
          ]
        });
    });

    it('should keep text before condition', () => {
      expect(parser.parse(['a', 'condition: #?:', 'b', '?#', 'c']))
        .toEqual({
          type: 'root',
          children: [
            { type: 'text', text: 'a' },
            { type: 'arg', index: 0 },
            { type: 'text', text: 'condition: ' },
            {
              type: 'condition',
              value: { type: 'arg', index: 1 },
              children: [
                { type: 'text', text: 'b' },
                { type: 'arg', index: 2 },
              ]
            },
            { type: 'arg', index: 3 },
            { type: 'text', text: 'c' },
          ]
        });
    });

    it('should keep text surrounding condition end mark', () => {
      expect(parser.parse(['a', '#?:', 'b', 'the ?# end', 'c']))
        .toEqual({
          type: 'root',
          children: [
            { type: 'text', text: 'a' },
            { type: 'arg', index: 0 },
            {
              type: 'condition',
              value: { type: 'arg', index: 1 },
              children: [
                { type: 'text', text: 'b' },
                { type: 'arg', index: 2 },
                { type: 'text', text: 'the ' },
              ]
            },
            { type: 'text', text: ' end' },
            { type: 'arg', index: 3 },
            { type: 'text', text: 'c' },
          ]
        });
    });

    it('should nest conditions', () => {
      expect(parser.parse(['a', '#?:', '#?:', 'b', '?#?#', 'c']))
        .toEqual({
          type: 'root',
          children: [
            { type: 'text', text: 'a' },
            { type: 'arg', index: 0 },
            {
              type: 'condition',
              value: { type: 'arg', index: 1 },
              children: [
                {
                  type: 'condition',
                  value: { type: 'arg', index: 2 },
                  children: [
                    { type: 'text', text: 'b' },
                    { type: 'arg', index: 3 },
                  ]
                },
              ]
            },
            { type: 'arg', index: 4 },
            { type: 'text', text: 'c' },
          ]
        });
    });
  });

  describe('with a condition reference', () => {
    it('should insert a condition value node in place of reference', () => {
      expect(parser.parse(['a', '#?:', '#$', '?#', 'c']))
        .toEqual({
          type: 'root',
          children: [
            { type: 'text', text: 'a' },
            { type: 'arg', index: 0 },
            {
              type: 'condition',
              value: { type: 'arg', index: 1 },
              children: [
                { type: 'arg', index: 1 },
                { type: 'arg', index: 2 },
              ]
            },
            { type: 'arg', index: 3 },
            { type: 'text', text: 'c' },
          ]
        });
    });

    it('should keep text surrounding reference', () => {
      expect(parser.parse(['a', '#?:', 'the #$ ref ?#', 'c']))
        .toEqual({
          type: 'root',
          children: [
            { type: 'text', text: 'a' },
            { type: 'arg', index: 0 },
            {
              type: 'condition',
              value: { type: 'arg', index: 1 },
              children: [
                { type: 'text', text: 'the ' },
                { type: 'arg', index: 1 },
                { type: 'text', text: ' ref ' },
              ]
            },
            { type: 'arg', index: 2 },
            { type: 'text', text: 'c' },
          ]
        });
    });

    it('should ignore reference outside of conditions', () => {
      expect(parser.parse(['a', '#$', 'c']))
        .toEqual({
          type: 'root',
          children: [
            { type: 'text', text: 'a' },
            { type: 'arg', index: 0 },
            { type: 'text', text: '#$' },
            { type: 'arg', index: 1 },
            { type: 'text', text: 'c' },
          ]
        });
    });
  });
});
