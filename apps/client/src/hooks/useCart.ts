import useCartStore from '../stores/cartStore';

const useCart = () => {
  const { cart, addToCart, removeFromCart, clearCart, cartCount, decreaseQuantity } = useCartStore();
  return { cart, addToCart, removeFromCart, clearCart, cartCount, decreaseQuantity };
};

export default useCart;