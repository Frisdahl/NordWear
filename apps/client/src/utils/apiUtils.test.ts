import { describe, it, expect } from 'vitest';
import { buildProductQueryParams } from './apiUtils';

describe('buildProductQueryParams', () => {
  it('returns empty params when no arguments provided', () => {
    const params = buildProductQueryParams();
    expect(params.toString()).toBe('');
  });

  it('adds category param', () => {
    const params = buildProductQueryParams('hoodies');
    expect(params.get('category')).toBe('hoodies');
  });

  it('adds limit param', () => {
    const params = buildProductQueryParams(undefined, undefined, 10);
    expect(params.get('limit')).toBe('10');
  });

  it('adds sort param', () => {
    const params = buildProductQueryParams(undefined, undefined, undefined, 'price-asc');
    expect(params.get('sort')).toBe('price-asc');
  });

  it('adds filter params (priceRange)', () => {
    const filters = { priceRange: [100, 500] };
    const params = buildProductQueryParams(undefined, filters);
    expect(params.get('minPrice')).toBe('100');
    expect(params.get('maxPrice')).toBe('500');
  });

  it('adds filter params (categories array)', () => {
    const filters = { categories: [1, 2, 3] };
    const params = buildProductQueryParams(undefined, filters);
    const categories = params.getAll('categories[]');
    expect(categories).toEqual(['1', '2', '3']);
  });

  it('adds filter params (sizes array)', () => {
    const filters = { sizes: [10, 11] };
    const params = buildProductQueryParams(undefined, filters);
    const sizes = params.getAll('sizes[]');
    expect(sizes).toEqual(['10', '11']);
  });

  it('combines all params correctly', () => {
    const filters = {
      priceRange: [100, 200],
      categories: [1],
      sizes: [2],
    };
    const params = buildProductQueryParams('t-shirts', filters, 5, 'newest');
    
    expect(params.get('category')).toBe('t-shirts');
    expect(params.get('minPrice')).toBe('100');
    expect(params.get('maxPrice')).toBe('200');
    expect(params.getAll('categories[]')).toEqual(['1']);
    expect(params.getAll('sizes[]')).toEqual(['2']);
    expect(params.get('limit')).toBe('5');
    expect(params.get('sort')).toBe('newest');
  });
});
