import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import useCart from "../../hooks/useCart";
import CustomerCartIcon from "../../assets/customer/customer-cart.svg";
import { formatPrice } from "../../utils/formatPrice";
import { calculateSubtotal } from "../../utils/cartUtils";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, cartCount, removeFromCart, addToCart, decreaseQuantity } =
    useCart();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);

  const eyebrow =
    "font-['figtree'] text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-[#1c1c1c]/50";

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#1c1c1c]/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 h-full bg-[#fefffe] w-[90vw] md:w-[35vw] lg:w-[25vw] min-w-[320px] max-w-[500px] shadow-xl transform transition-transform duration-500 ease-in-out flex flex-col text-[#1c1c1c] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="flex-grow overflow-y-auto px-6 pt-7">
          <div className="flex items-start justify-between border-b border-[#1c1c1c]/15 pb-5">
            <div>
              <p className={eyebrow}>
                {cartCount === 1 ? "1 vare" : `${cartCount} varer`}
              </p>
              <h2 className="mt-2 font-garamond text-3xl leading-none">
                Indkøbskurv
              </h2>
            </div>
            <button onClick={onClose} aria-label="Luk indkøbskurv" className="-mr-1 p-1">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {cartCount === 0 ? (
            <div className="mt-6 h-full flex flex-col items-center justify-center gap-5">
              <p className="font-garamond text-2xl">Din kurv er tom</p>
              <button
                onClick={onClose}
                className="border border-[#1c1c1c] bg-[#1c1c1c] px-6 py-3 font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                Fortsæt med at handle
              </button>
            </div>
          ) : (
            <div>
              {cart.map((product) => (
                <div
                  key={`${product.id}-${product.selectedSize}`}
                  className="border-b border-[#1c1c1c]/15 py-6"
                >
                  <div className="grid grid-cols-[96px_1fr] gap-5">
                    <div className="aspect-[4/5] w-[96px] overflow-hidden bg-[#e6e6e6]">
                      <img
                        src={product.imageUrl || undefined}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block font-garamond text-xl leading-tight">
                            {product.name}
                          </span>
                          <span className="mt-1 block text-sm text-[#1c1c1c]/60">
                            {formatPrice(product.price || 0)}
                          </span>
                        </div>
                        <button
                          aria-label="Fjern fra kurv"
                          onClick={() =>
                            removeFromCart((product.id || 0) as number, (product.selectedSize || "") as string)
                          }
                          className="p-0.5"
                        >
                          <TrashIcon
                            className="h-[18px] w-[18px]"
                            style={{ color: "#1c1c1c80" }}
                          />
                        </button>
                      </div>
                      <p className={`${eyebrow} mt-3`}>
                        Størrelse{" "}
                        <span className="ml-1 tracking-[0.12em] text-[#1c1c1c]">
                          {product.selectedSize || "N/A"}
                        </span>
                      </p>
                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex items-center border border-[#1c1c1c]/20 text-sm">
                          <button
                            aria-label="Færre"
                            className="h-9 w-9"
                            onClick={() =>
                              decreaseQuantity((product.id || 0) as number, (product.selectedSize || "") as string)
                            }
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{product.quantity}</span>
                          <button
                            aria-label="Flere"
                            className="h-9 w-9"
                            onClick={() => addToCart(product)}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice((product.price || 0) * product.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartCount > 0 && (
          <div className="border-t border-[#1c1c1c]/15 bg-[#fefffe] px-6 pb-7 pt-6">
            <div className="flex items-baseline justify-between">
              <span className={eyebrow}>Subtotal</span>
              <span className="font-garamond text-2xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-[#1c1c1c]/50">
              Fragt og afgifter beregnes ved betaling.
            </p>
            <label htmlFor="terms" className="mt-5 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 accent-[#1c1c1c]"
              />
              Jeg accepterer handelsbetingelserne.
            </label>
            {termsAccepted ? (
              <Link
                to="/checkout"
                className="mt-5 block w-full border border-[#1c1c1c] bg-[#1c1c1c] py-4 text-center font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#fefffe] hover:text-[#1c1c1c]"
              >
                Gå til betaling
              </Link>
            ) : (
              <button
                className="mt-5 w-full border border-[#1c1c1c]/20 py-4 font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.2em] text-[#1c1c1c]/40"
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
