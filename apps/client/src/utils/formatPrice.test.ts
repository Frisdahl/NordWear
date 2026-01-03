import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats positive numbers correctly', () => {
    // Note: The exact output depends on the locale and implementation of Intl.NumberFormat
    // In Node.js environment, the output might be "123,45 kr." or "kr. 123,45" depending on the version/ICU data.
    // However, da-DK typically uses "kr. " prefix or suffix.
    // Let's check for the presence of "kr." and the correct number format.
    const result = formatPrice(123.45);
    expect(result).toMatch(/123,45/);
    expect(result).toContain('kr');
  });

  it('formats integers with two decimal places', () => {
    const result = formatPrice(100);
    expect(result).toMatch(/100,00/);
  });

  it('formats large numbers with thousand separators', () => {
    const result = formatPrice(1234567.89);
    // da-DK uses '.' as thousand separator and ',' as decimal separator
    expect(result).toMatch(/1\.234\.567,89/);
  });

  it('formats zero correctly', () => {
    const result = formatPrice(0);
    expect(result).toMatch(/0,00/);
  });
});
