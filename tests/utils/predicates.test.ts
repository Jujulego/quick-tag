import { describe, expect, it } from 'vitest';

import { isQuickConst, isQuickInjector } from '@/src/utils/predicates.js';
import { q$, qarg } from '@/src/injector.js';

// Tests
describe('isQuickConst', () => {
  it('should return true for a boolean', () => {
    expect(isQuickConst(false)).toBe(true);
  });

  it('should return true for a number', () => {
    expect(isQuickConst(42)).toBe(true);
  });

  it('should return true for a string', () => {
    expect(isQuickConst('life')).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isQuickConst(undefined)).toBe(true);
  });

  it('should return true for null', () => {
    expect(isQuickConst(null)).toBe(true);
  });

  it('should return true for an object', () => {
    expect(isQuickConst({ life: 42 })).toBe(true);
  });

  it('should return false for a qarg', () => {
    expect(isQuickConst(qarg())).toBe(false);
  });

  it('should return false for a q$', () => {
    expect(isQuickConst(q$)).toBe(false);
  });

  it('should return false for a symbol', () => {
    expect(isQuickConst(Symbol('test'))).toBe(false);
  });

  it('should return false for a function', () => {
    expect(isQuickConst(() => null)).toBe(false);
  });
});

describe('isQuickInjector', () => {
  it('should return true for a qarg', () => {
    expect(isQuickInjector(qarg())).toBe(true);
  });

  it('should return true for a q$', () => {
    expect(isQuickInjector(q$)).toBe(true);
  });

  it('should return false for a boolean', () => {
    expect(isQuickInjector(false)).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isQuickInjector(42)).toBe(false);
  });

  it('should return false for a string', () => {
    expect(isQuickInjector('life')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isQuickInjector(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isQuickInjector(null)).toBe(false);
  });

  it('should return false for an object', () => {
    expect(isQuickInjector({ life: 42 })).toBe(false);
  });

  it('should return false for a symbol', () => {
    expect(isQuickConst(Symbol('test'))).toBe(false);
  });

  it('should return false for a function', () => {
    expect(isQuickConst(() => null)).toBe(false);
  });
});