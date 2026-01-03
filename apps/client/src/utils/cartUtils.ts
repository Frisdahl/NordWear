import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

export const calculateSubtotal = (cart: CartItem[]): number => {
  return cart.reduce((acc, product) => acc + (product.price || 0) * product.quantity, 0);
};

export const calculateVAT = (amount: number, rate: number = 0.25): number => {
  return amount * rate;
};

export const calculateTotal = (subtotal: number, shipping: number, discount: number = 0): number => {
  return Math.max(0, subtotal + shipping - discount);
};

export const calculateSavings = (cart: CartItem[]): number => {
  return cart.reduce((acc, product) => {
    if (product.offer_price && product.price > product.offer_price) {
      return acc + (product.price - product.offer_price) * product.quantity;
    }
    return acc;
  }, 0);
};
