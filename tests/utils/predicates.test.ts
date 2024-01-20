import { describe, expect, it } from 'vitest';

import { isQuickArgInjector, isQuickConditionInjector, isQuickConst } from '@/src/utils/predicates.js';
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

  it('should return false for an object', () => {
    expect(isQuickConst({ life: 42 })).toBe(false);
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

describe('isQuickArgInjector', () => {
  it('should return true for a qarg', () => {
    expect(isQuickArgInjector(qarg())).toBe(true);
  });

  it('should return false for a q$', () => {
    expect(isQuickArgInjector(q$)).toBe(false);
  });

  it('should return false for a boolean', () => {
    expect(isQuickArgInjector(false)).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isQuickArgInjector(42)).toBe(false);
  });

  it('should return false for a string', () => {
    expect(isQuickArgInjector('life')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isQuickArgInjector(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isQuickArgInjector(null)).toBe(false);
  });

  it('should return false for an object', () => {
    expect(isQuickArgInjector({ life: 42 })).toBe(false);
  });

  it('should return false for a symbol', () => {
    expect(isQuickArgInjector(Symbol('test'))).toBe(false);
  });

  it('should return false for a function', () => {
    expect(isQuickArgInjector(() => null)).toBe(false);
  });
});
describe('isQuickConditionInjector', () => {
  it('should return false for a qarg', () => {
    expect(isQuickConditionInjector(qarg())).toBe(false);
  });

  it('should return true for a q$', () => {
    expect(isQuickConditionInjector(q$)).toBe(true);
  });

  it('should return false for a boolean', () => {
    expect(isQuickConditionInjector(false)).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isQuickConditionInjector(42)).toBe(false);
  });

  it('should return false for a string', () => {
    expect(isQuickConditionInjector('life')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isQuickConditionInjector(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isQuickConditionInjector(null)).toBe(false);
  });

  it('should return false for an object', () => {
    expect(isQuickConditionInjector({ life: 42 })).toBe(false);
  });

  it('should return false for a symbol', () => {
    expect(isQuickConditionInjector(Symbol('test'))).toBe(false);
  });

  it('should return false for a function', () => {
    expect(isQuickConditionInjector(() => null)).toBe(false);
  });
});