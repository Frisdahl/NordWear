import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Icon from "@/components/Icon";
import { fetchOrder } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";

const ordersActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`;
const chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>`;

const InputField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-[#606060] uppercase tracking-wide">
      {label}
    </label>
    <input
      readOnly
      value={value}
      className="w-full bg-[#f9f9f9] border border-[#e6e6e6] rounded-lg px-3 py-2 text-sm text-[#303030] outline-none border-none focus:ring-0 cursor-default"
    />
  </div>
);

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder(id)
        .then(setOrder)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8">Indlæser ordre...</div>;
  if (!order) return <div className="p-8">Ordre ikke fundet.</div>;

  const {
    id: orderId,
    customerDetails,
    shippingDetails,
    amount,
    status,
    order_item,
  } = order;

  // Safe access to nested JSON properties
  const customerName =
    customerDetails?.name || order.customer?.user.name || "Gæst";
  const customerEmail =
    customerDetails?.email || order.customer?.user.email || "—";

  const address = shippingDetails?.address;
  const addressLine1 = address?.line1 || "—";
  const addressCity = address?.city || "—";
  const addressZip = address?.postal_code || "—";
  const addressCountry = address?.country || "DK";

  const isPaid = status === "COMPLETED";

  return (
    <div className="container mx-auto px-3 pt-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 text-[#303030]">
        <div 
          onClick={() => navigate("/admin/orders")}
          className="cursor-pointer hover:bg-gray-200 transition-colors rounded-full p-2 flex items-center justify-center"
        >
          <Icon
            src={ordersActiveSvg}
            className="h-[1.5rem] w-[1.5rem]"
            strokeWidth={1.5}
          />
        </div>
        <Icon
          src={chevronRightSvg}
          className="h-4 w-4 text-gray-400"
          strokeWidth={2}
        />
        <h1 className="text-[1.5rem] font-bold">Ordre #{orderId}</h1>
        <span className="ml-4 text-sm text-[#606060] font-medium">
          Bestilt: {new Date(order.created_at).toLocaleDateString("da-DK", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })} kl. {new Date(order.created_at).toLocaleTimeString("da-DK", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left Column: Order Details - Expanded */}
        <div className="flex-1 bg-white rounded-2xl border border-[#c7c7c7] p-6 flex flex-col gap-8">
          {/* Customer & Address */}
          <div>
            <h3 className="text-base font-bold text-[#303030] mb-4 border-b border-[#f2f2f2] pb-2">
              Kunde & Levering
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Navn" value={customerName} />
              <InputField label="Email" value={customerEmail} />
              <InputField label="Adresse" value={addressLine1} />
              <div className="flex gap-4">
                <InputField label="Postnr" value={addressZip} />
                <InputField label="By" value={addressCity} />
              </div>
              <InputField label="Land" value={addressCountry} />
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-base font-bold text-[#303030] mb-4 border-b border-[#f2f2f2] pb-2">
              Betaling
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Betalingsmetode" value="Kortbetaling" />
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-semibold text-[#606060] uppercase tracking-wide">
                  Status
                </label>
                <div className="flex items-center gap-2 px-1 py-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      isPaid ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isPaid ? "Betalt" : "Ikke betalt"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <h3 className="text-base font-bold text-[#303030] mb-4 border-b border-[#f2f2f2] pb-2">
              Forsendelse
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Metode" value="Standard levering" />
              <InputField label="Forventet" value="2-4 hverdage" />
            </div>
          </div>
        </div>

        {/* Right Column: Products - Narrower */}
        <div className="w-[400px] bg-white rounded-2xl border border-[#c7c7c7] p-8">
          <h2 className="text-base font-bold text-[#303030] mb-6">Produkter</h2>
          <div className="flex flex-col gap-6">
            {order_item.map((item: any) => {
              const imageUrl = item.product?.images?.[0]?.url || null;
              const productName = item.product?.name || "Ukendt produkt";
              const variant = item.size?.name ? `Str: ${item.size.name}` : "";
              const price = item.price / 100;
              const total = price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between border-b border-[#f2f2f2] pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 bg-[#f9f9f9] rounded-lg border border-[#e6e6e6]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={productName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-[#303030] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-[#303030] text-sm">
                        {productName}
                      </p>
                      <p className="text-xs text-[#a0a0a0] mt-1">{variant}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#a0a0a0] mb-1">
                      {item.quantity} x {formatPrice(price)}
                    </p>
                    <p className="text-sm font-medium text-[#303030]">
                      {formatPrice(total)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-[#e6e6e6] pt-6 flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#606060]">Subtotal</span>
              <span className="font-medium text-[#303030]">
                {formatPrice(amount / 100)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#606060]">Fragt</span>
              <span className="font-medium text-[#303030]">Gratis</span>
            </div>
            <div className="flex justify-between text-base font-bold mt-2 pt-4 border-t border-[#e6e6e6]">
              <span className="text-[#303030]">Total</span>
              <span className="text-[#303030]">
                {formatPrice(amount / 100)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
