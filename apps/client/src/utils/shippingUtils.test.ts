import { describe, it, expect } from 'vitest';
import { processShippingOptions } from './shippingUtils';

describe('processShippingOptions', () => {
  it('returns empty array if input is empty', () => {
    expect(processShippingOptions([])).toEqual([]);
  });

  it('flattens service points correctly', () => {
    const input = [
      {
        id: 'carrier1',
        carrier_name: 'PostNord (DK)',
        price: 50,
        service_points: [
          { id: 'sp1', name: 'Shop 1', address: 'Address 1', distance: 1500 },
          { id: 'sp2', name: 'Shop 2', address: 'Address 2', distance: 500 },
        ],
      },
    ];

    const result = processShippingOptions(input);
    expect(result).toHaveLength(2);
    expect(result[0].name).toContain('PostNord - 1.50km - Shop 1');
    expect(result[1].name).toContain('PostNord - 0.50km - Shop 2');
    expect(result[0].isServicePoint).toBe(true);
  });

  it('handles home delivery options correctly', () => {
    const input = [
      {
        id: 'hd1',
        name: 'Home Delivery',
        carrier_name: 'PostNord',
        price: 75,
        service_points: [],
      },
    ];
    const result = processShippingOptions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Home Delivery');
    expect(result[0].isServicePoint).toBe(false);
  });

  it('filters out unwanted home delivery types', () => {
    const input = [
      { id: 'u1', name: 'Return Drop Off', carrier_name: 'X', price: 0, service_points: [] },
      { id: 'u2', name: 'Parcel', carrier_name: 'X', price: 0, service_points: [] },
      { id: 'u3', name: 'Business Parcel', carrier_name: 'X', price: 0, service_points: [] },
      { id: 'ok', name: 'Home Delivery', carrier_name: 'X', price: 0, service_points: [] },
    ];
    const result = processShippingOptions(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ok');
  });

  it('limits PostNord and GLS service points to 3 each', () => {
    const createSP = (id: string, carrier: string) => ({
      id: carrier,
      carrier_name: carrier,
      price: 50,
      service_points: [{ id, name: 'Shop', address: 'Addr', distance: 100 }],
    });

    const input = [
      createSP('pn1', 'PostNord'),
      createSP('pn2', 'PostNord'),
      createSP('pn3', 'PostNord'),
      createSP('pn4', 'PostNord'), // Should be excluded
      createSP('gls1', 'GLS - Denmark'),
      createSP('gls2', 'GLS - Denmark'),
      createSP('gls3', 'GLS - Denmark'),
      createSP('gls4', 'GLS - Denmark'), // Should be excluded
    ];

    const result = processShippingOptions(input);
    const postNord = result.filter(r => r.name.startsWith('PostNord'));
    const gls = result.filter(r => r.name.startsWith('GLS -'));

    expect(postNord).toHaveLength(3);
    expect(gls).toHaveLength(3);
  });

  it('handles other carriers without service points', () => {
    const input = [
      { id: 'dao', name: 'DAO Home', carrier_name: 'DAO', price: 40, service_points: [] }
    ];
    const result = processShippingOptions(input);
    expect(result).toHaveLength(1);
    expect(result[0].carrier_name).toBe('DAO');
  });

  it('handles missing service_points property', () => {
    const input = [
      { id: 'test', name: 'Test', carrier_name: 'Test', price: 10 }
    ];
    // @ts-ignore - simulating missing property
    const result = processShippingOptions(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test');
  });
});
