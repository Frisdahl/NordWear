import { create } from 'zustand';
import { Product } from '../types';

interface CartProduct extends Product {
  quantity: number;
}

interface CartState {
  cart: CartProduct[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number, selectedSize: string) => void;
  decreaseQuantity: (productId: number, selectedSize: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const useCartStore = create<CartState>((set) => ({
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  cartCount: JSON.parse(localStorage.getItem('cart') || '[]').reduce((acc: number, item: CartProduct) => acc + item.quantity, 0),
  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      );

      let updatedCart;
      if (existingProduct) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { cart: updatedCart, cartCount: updatedCart.reduce((acc, item) => acc + item.quantity, 0) };
    }),
  removeFromCart: (productId, selectedSize) =>
    set((state) => {
      const updatedCart = state.cart.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { cart: updatedCart, cartCount: updatedCart.reduce((acc, item) => acc + item.quantity, 0) };
    }),
  decreaseQuantity: (productId, selectedSize) =>
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.id === productId && item.selectedSize === selectedSize
      );
      let updatedCart;
      if (existingProduct && existingProduct.quantity > 1) {
        updatedCart = state.cart.map((item) =>
          item.id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        updatedCart = state.cart.filter(
          (item) => !(item.id === productId && item.selectedSize === selectedSize)
        );
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { cart: updatedCart, cartCount: updatedCart.reduce((acc, item) => acc + item.quantity, 0) };
    }),
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cart: [], cartCount: 0 });
  },
}));

export default useCartStore;

