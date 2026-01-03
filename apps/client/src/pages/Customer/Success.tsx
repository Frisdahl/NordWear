import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";

const Success: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const { cart, clearCart } = useCart();

  useEffect(() => {
    const fetchSession = async () => {
      if (sessionId) {
        try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/checkout-session?session_id=${sessionId}`);
          
          const data = await response.json();
          setSession(data);

          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/send-order-confirmation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sessionId }),
          });

          // clearCart();
        } catch (error) {
          console.error("Error fetching session:", error);
        }
      }
    };

    fetchSession();
  }, [sessionId, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">
          Tak for din ordre!
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Din ordre er blevet bekræftet.
        </p>
        <p className="text-gray-600 mb-8">
          Du vil modtage en ordrebekræftelse på din e-mail inden længe.
        </p>
        {session && (
          <div className="text-left my-8">
            <h2 className="text-2xl font-semibold mb-4">Ordredetaljer</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Kundeinformation</h3>
              <p>
                <strong>Navn:</strong> {session.customer_details?.name}
              </p>
              <p>
                <strong>Email:</strong> {session.customer_details?.email}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Leveringsadresse</h3>
              <p>
                {session.customer_details?.address?.line1}
                {session.customer_details?.address?.line2
                  ? `, ${session.customer_details?.address?.line2}`
                  : ""}
              </p>
              <p>
                {session.customer_details?.address?.postal_code}{" "}
                {session.customer_details?.address?.city}
              </p>
              <p>{session.customer_details?.address?.country}</p>
            </div>
            {session.line_items?.data.map((item: any) => {
              const cartItem = cart.find(
                (cartItem) => cartItem.name === item.description
              );
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex items-center">
                    <img
                      src={cartItem?.imageUrl || ""}
                      alt={item.description}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-semibold">{item.description}</p>
                      <p className="text-gray-500">Antal: {item.quantity}</p>
                    </div>
                  </div>
                  <p>{formatPrice(item.price.unit_amount / 100)}</p>
                </div>
              );
            })}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">
                {formatPrice(session.amount_total / 100)}
              </p>
            </div>
          </div>
        )}
        <Link
          to="/"
          className="bg-[#1c1c1c] text-white py-3 px-6 rounded-md text-lg font-medium"
        >
          Fortsæt med at handle
        </Link>
      </div>
    </div>
  );
};

export default Success;