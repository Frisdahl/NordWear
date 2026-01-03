import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateRequired, validateZipCode } from './validationUtils';

describe('validationUtils', () => {
  describe('validateEmail', () => {
    it('returns true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('testexample.com')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('returns true for valid Danish numbers', () => {
      expect(validatePhone('20202020', 'DK')).toBe(true);
      expect(validatePhone('+4520202020', 'DK')).toBe(true);
    });

    it('returns false for invalid Danish numbers', () => {
      expect(validatePhone('1234567', 'DK')).toBe(false); // Too short
      expect(validatePhone('123456789', 'DK')).toBe(false); // Too long
      expect(validatePhone('00000000', 'DK')).toBe(false); // Invalid
    });
  });

  describe('validateRequired', () => {
    it('returns true for non-empty values', () => {
      expect(validateRequired('hello')).toBe(true);
      expect(validateRequired(123)).toBe(true);
      expect(validateRequired(['item'])).toBe(true);
      expect(validateRequired({ key: 'val' })).toBe(true);
    });

    it('returns false for empty values', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
      expect(validateRequired([])).toBe(false);
    });
  });

  describe('validateZipCode', () => {
    it('returns true for valid Danish zip codes', () => {
      expect(validateZipCode('1000')).toBe(true);
      expect(validateZipCode('9999')).toBe(true);
      expect(validateZipCode('5220')).toBe(true);
    });

    it('returns false for invalid Danish zip codes', () => {
      expect(validateZipCode('100')).toBe(false);
      expect(validateZipCode('10000')).toBe(false);
      expect(validateZipCode('abcd')).toBe(false);
    });
  });
});
