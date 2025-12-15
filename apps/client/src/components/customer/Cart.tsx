import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import useCart from "../../hooks/useCart";
import CustomerCartIcon from "../../assets/customer/customer-cart.svg";
import { formatPrice } from "../../utils/formatPrice";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, cartCount, removeFromCart, addToCart, decreaseQuantity } =
    useCart();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }, [cart]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full bg-[#f2f1f0] w-[90vw] md:w-[30vw] shadow-xl z-50 transform transition-transform flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="flex justify-between items-center border-b border-[#00000026] pb-4">
            <div className="flex items-center space-x-2">
              <img
                src={CustomerCartIcon}
                alt="Indkøbskurv"
                className="h-6 w-6"
              />
              {cartCount !== 0 && (
                <div className="h-4 w-4 rounded-full bg-[#1c1c1c] flex items-center justify-center">
                  {cartCount > 0 && (
                    <span className="text-[0.65rem] text-white font-semibold">
                      {cartCount}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6">
            {cart.length === 0 ? (
              <p>Din indkøbskurv er tom.</p>
            ) : (
              <div className="-mx-6 px-6">
                {cart.map((product) => (
                  <div
                    key={product.id}
                    className="border-b border-[#00000026] py-4"
                  >
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="col-span-1">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full"
                        />
                      </div>
                      <div className="col-span-1 flex flex-col h-full justify-between font-sans">
                        <div>
                          <span className="font-bold text-13">
                            {product.name}
                          </span>
                          <span className="text-11.7 block">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <div className="text-[0.75rem] text-[#181c2d]">
                          <span className="font-semibold text-[#181c2d] text-[0.75rem]">
                            Størrelse:
                          </span>{" "}
                          {product.selectedSize || "N/A"}
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => decreaseQuantity(product.id, product.selectedSize)}>-</button>
                          <span className="mx-2 text-[0.85rem]">{product.quantity}</span>
                          <button onClick={() => addToCart(product)}>+</button>
                        </div>
                      </div>
                      <div className="col-span-1 flex flex-col items-end h-full justify-between">
                        <button onClick={() => removeFromCart(product.id, product.selectedSize)}>
                          <TrashIcon
                            className="h-5 w-5"
                            style={{ color: "#00000055" }}
                          />
                        </button>
                        <span className="text-[0.813rem] font-semibold mt-2">
                          {formatPrice(product.price * product.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border-t border-[#00000026] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-center mt-4">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <label htmlFor="terms" className="ml-2 text-xs">
              jeg accepterer handelsbetingelserne.
            </label>
          </div>
          {termsAccepted ? (
            <Link
              to="/checkout"
              className="w-full block text-center mt-4 py-3 rounded-md bg-[#1c1c1c] text-white"
            >
              Gå til betaling
            </Link>
          ) : (
            <button
              className={`w-full mt-4 py-3 rounded-md bg-gray-200 text-white`}
              disabled
            >
              Gå til betaling
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
