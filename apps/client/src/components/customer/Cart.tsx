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
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 h-full bg-[#f2f1f0] w-[90vw] md:w-[25vw] shadow-xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
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

          {cartCount === 0 ? (
            <div className="mt-6 h-full flex flex-col items-center justify-center gap-4">
              <p>Din kurv er tom</p>
              <button
                onClick={onClose}
                className="bg-[#181c2e] rounded-[4px] text-[0.731rem] font-[600] font-[montserrat] text-white px-4 py-2"
              >
                Fortsæt med at handle
              </button>
            </div>
          ) : (
            <div className="mt-6 h-full">
              <div className="-mx-6">
                {cart.map((product) => (
                  <div
                    key={`${product.id}-${product.selectedSize}`}
                    className="border-b border-[#00000026] py-4 px-6"
                  >
                    <div className="grid grid-cols-[100px_1fr_auto] gap-4 items-center">
                      <div className="flex justify-center items-center">
                        <img
                          src={product.imageUrl || ""}
                          alt={product.name}
                          className="max-w-[100px] max-h-[100px] w-auto h-auto object-contain"
                        />
                      </div>
                      <div className="flex flex-col h-full justify-between font-sans overflow-hidden">
                        <div className="min-w-0">
                          <span className="font-bold block truncate text-[clamp(13px,1.5vw,14px)]">
                            {product.name}
                          </span>
                          <span className="block text-[clamp(10px,1.2vw,11.7px)]">
                            {formatPrice(product.price || 0)}
                          </span>
                        </div>
                        <div className="text-[clamp(10px,1.2vw,11.7px)] text-[#181c2d]">
                          <span className="font-semibold">
                            Størrelse:
                          </span>{" "}
                          {product.selectedSize || "N/A"}
                        </div>
                        <div className="flex items-center text-[clamp(12px,1.3vw,13px)]">
                          <button
                            onClick={() =>
                              decreaseQuantity(product.id, product.selectedSize)
                            }
                          >
                            -
                          </button>
                          <span className="mx-2">
                            {product.quantity}
                          </span>
                          <button onClick={() => addToCart(product)}>+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end h-full justify-between">
                        <button
                          onClick={() =>
                            removeFromCart(product.id, product.selectedSize)
                          }
                        >
                          <TrashIcon
                            className="h-5 w-5"
                            style={{ color: "#00000055" }}
                          />
                        </button>
                        <span className="font-semibold mt-2 text-[clamp(12px,1.3vw,13px)]">
                          {formatPrice((product.price || 0) * product.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {cartCount > 0 && (
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
        )}
      </div>
    </>
  );
};

export default Cart;
