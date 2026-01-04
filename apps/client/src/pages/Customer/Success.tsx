import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";

const Success: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const orderId = new URLSearchParams(location.search).get("orderId");
  const { cart, clearCart } = useCart();

  useEffect(() => {
    const fetchOrderData = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/checkout-session?session_id=${sessionId}`);
          const data = await response.json();
          console.log("DEBUG: Raw Stripe Session Data:", data);
          
          // Normalize address from shipping_details if available (Stripe structure)
          // Stripe sometimes puts it in collected_information depending on API version or configuration
          const shippingSource = data.shipping_details || data.collected_information?.shipping_details;

          if (shippingSource?.address) {
             if (!data.customer_details) data.customer_details = {};
             data.customer_details.address = shippingSource.address;
          }
          console.log("DEBUG: Normalized Session Data:", data);

          setSession(data);

          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/send-order-confirmation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ session_id: sessionId }),
          });

          clearCart();
        } catch (error) {
          console.error("Error fetching session:", error);
        }
      } else if (orderId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/orders/${orderId}`);
          const data = await response.json();
          console.log("DEBUG: Raw Order Data (DB):", data);

          // Transform order data to match session structure enough for rendering
          const shippingAddress = data.shippingDetails?.address || {};
          setSession({
            customer_details: {
                ...data.customerDetails,
                address: {
                    line1: shippingAddress.line1 || shippingAddress.address || "",
                    line2: shippingAddress.line2 || shippingAddress.apartment || "",
                    city: shippingAddress.city || "",
                    postal_code: shippingAddress.postal_code || shippingAddress.zipcode || "",
                    country: shippingAddress.country || "DK"
                }
            },
            amount_total: data.amount,
            line_items: {
              data: data.order_item.map((item: any) => ({
                id: item.id,
                description: item.product.name,
                quantity: item.quantity,
                price: { unit_amount: item.price },
                imageUrl: item.product.images?.[0]?.url || item.product.imageUrl
              }))
            }
          });
          clearCart();
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      }
    };

    fetchOrderData();
  }, [sessionId, orderId, clearCart]);

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
              {session.customer_details?.address ? (
                <>
                  <p>
                    {session.customer_details.address.line1}
                    {session.customer_details.address.line2
                      ? `, ${session.customer_details.address.line2}`
                      : ""}
                  </p>
                  <p>
                    {session.customer_details.address.postal_code}{" "}
                    {session.customer_details.address.city}
                  </p>
                  <p>{session.customer_details.address.country}</p>
                </>
              ) : (
                <p className="text-gray-500 italic">Ingen adresse oplysninger fundet</p>
              )}
            </div>
            {session.line_items?.data.map((item: any) => {
              const imageUrl = item.imageUrl || item.price?.product?.images?.[0] || "";
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div className="flex items-center">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={item.description}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                    )}
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