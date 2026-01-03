import { describe, it, expect } from 'vitest';
import { calculateSubtotal, calculateVAT, calculateTotal, calculateSavings } from './cartUtils';
import { Product, ProductStatus } from '../types';

// Mock Product data
const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  price: 100,
  status: 'ONLINE',
  category_Id: 1,
  description: 'Test',
  variants: [],
  images: [],
};

describe('calculateSubtotal', () => {
  it('calculates subtotal correctly for empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('calculates subtotal correctly for single item', () => {
    const cart = [{ ...mockProduct, quantity: 2 }];
    expect(calculateSubtotal(cart)).toBe(200);
  });

  it('calculates subtotal correctly for multiple items', () => {
    const cart = [
      { ...mockProduct, price: 100, quantity: 2 },
      { ...mockProduct, id: 2, price: 50, quantity: 3 },
    ];
    expect(calculateSubtotal(cart)).toBe(350);
  });

  it('handles products with missing price (treats as 0)', () => {
    const cart = [{ ...mockProduct, price: undefined as unknown as number, quantity: 2 }];
    expect(calculateSubtotal(cart)).toBe(0);
  });
});

describe('calculateVAT', () => {
  it('calculates 25% VAT by default', () => {
    expect(calculateVAT(100)).toBe(25);
    expect(calculateVAT(400)).toBe(100);
  });

  it('calculates custom VAT rate', () => {
    expect(calculateVAT(100, 0.1)).toBe(10);
  });
});

describe('calculateTotal', () => {
  it('sums subtotal and shipping', () => {
    expect(calculateTotal(100, 50)).toBe(150);
  });

  it('subtracts discount', () => {
    expect(calculateTotal(100, 50, 20)).toBe(130);
  });

  it('does not return negative total', () => {
    expect(calculateTotal(10, 10, 50)).toBe(0);
  });
});

describe('calculateSavings', () => {
  it('returns 0 if no offer prices', () => {
    const cart = [{ ...mockProduct, price: 100, quantity: 2 }];
    expect(calculateSavings(cart)).toBe(0);
  });

  it('calculates savings correctly', () => {
    const cart = [
      { ...mockProduct, price: 100, offer_price: 80, quantity: 2 }, // Saved 20 * 2 = 40
      { ...mockProduct, id: 2, price: 50, quantity: 1 }, // No savings
    ];
    expect(calculateSavings(cart)).toBe(40);
  });
});
