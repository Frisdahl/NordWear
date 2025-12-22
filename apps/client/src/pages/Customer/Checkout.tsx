import React, { useMemo, useState, useEffect } from "react";
import useCart from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";

import {
  getShipmondoProducts,
  GetShipmentOptions,
  GetShipmentRates,
} from "../../services/api";

import { Link } from "react-router-dom";
import MobilepayIcon from "../../assets/customer/mobilepay.svg";
import VisaIcon from "../../assets/customer/visa.svg";
import MasterIcon from "../../assets/customer/master.svg";
import ViabillIcon from "../../assets/customer/viabill.svg";
import AnydayIcon from "../../assets/customer/anyday.svg";
import PaymentIcon from "../../assets/customer/payment.svg";

import useGoogleMaps from "../../hooks/useGoogleMaps";

const Checkout: React.FC = () => {
  const { cart, cartCount } = useCart();
  const [billingMethod, setBillingMethod] = useState("same");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // shipmondo states
  const [shipmondoProducts, setShipmondoProducts] = useState<any[]>([]);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [shipment, setShipment] = useState<any | null>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);

  const [shippingInfo, setShippingInfo] = useState({
    country: "Danmark",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    zipcode: "",
    city: "",
    phone: "",
  });

  const google = useGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const paymentMessages: { [key: string]: string } = {
    mobilepay:
      "Når du har klikket på “Betal nu”, vil du blive videresendt til MobilePay, for at gennemføre dit køb sikkert.",
    card: "Når du har klikket på “Betal nu”, vil du blive videresendt til Betalingskort, for at gennemføre dit køb sikkert.",
    viabill:
      "Når du har klikket på “Betal nu”, vil du blive videresendt til ViaBill - Del betalingen op, for at gennemføre dit køb sikkert.",
    anyday:
      "Når du har klikket på “Betal nu”, vil du blive videresendt til Anyday, for at gennemføre dit køb sikkert.",
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }, [cart]);

  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    const fetchShipmondoProducts = async () => {
      try {
        const products = await getShipmondoProducts();
        setShipmondoProducts(products);
      } catch (error) {
        console.error("Error fetching shipmondo products:", error);
      }
    };

    fetchShipmondoProducts();
  }, []);

  useEffect(() => {
    const fetchShippingInfo = async () => {
      if (
        shippingInfo.address &&
        shippingInfo.zipcode &&
        shippingInfo.city &&
        shipmondoProducts.length > 0
      ) {
        try {
          const filteredProducts = shipmondoProducts.filter(
            (p) =>
              p.available &&
              p.sender_country_code === "DK" &&
              p.receiver_country_code === "DK"
          );

          console.log(filteredProducts, "filtered");

          const servicePointProducts = filteredProducts.filter((p) =>
            p.available_services.some((s: any) => s.code === "service_point")
          );

          const rates = await GetShipmentRates(
            sender_country_code,
            zip_code,
            receiver_country_code,
            receiver_zipcode
          );

          if (servicePointProducts.length > 0) {
            const options = await GetShipmentOptions(
              "DK",
              servicePointProducts.map((p: any) => p.code)[0],
              shippingInfo.zipcode,
              shippingInfo.address,
              shippingInfo.city
            );
            setShippingOptions(options);
            console.log("shippingOptions", options);
          }
        } catch (error) {
          console.error("Error fetching shipping info:", error);
        }
      }
    };

    fetchShippingInfo();
  }, [shippingInfo, shipmondoProducts]);

  useEffect(() => {
    if (google) {
      setAutocomplete(new google.maps.places.AutocompleteService());
      setPlacesService(
        new google.maps.places.PlacesService(document.createElement("div"))
      );
    }
  }, [google]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, address: e.target.value });
    if (autocomplete) {
      autocomplete.getPlacePredictions(
        {
          input: e.target.value,
          componentRestrictions: { country: "dk" },
          language: "da",
        },
        (predictions: any) => {
          setSuggestions(predictions || []);
        }
      );
    }
  };

  const taxes = subtotal * 0.2; // 25% VAT is 20% of the total price (subtotal is inclusive of VAT)
  const total = subtotal + shippingCost;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="lg:col-span-1 bg-white">
        <div className="max-w-[550px] ml-auto pr-8 py-8">
          <div className="mb-8">
            <div className="flex w-full items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Kontaktoplysninger</h2>
              <Link to="/login" className="text-sm text-black underline">
                Log ind
              </Link>
            </div>
            <input
              type="email"
              placeholder="Mail"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <div className="flex items-center mt-2">
              <input type="checkbox" id="newsletter" className="h-4 w-4" />
              <label htmlFor="newsletter" className="ml-2 text-sm">
                Send mails til mig om nyheder og tilbud
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Levering</h2>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="col-span-2 w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.country}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, country: e.target.value })
                }
              >
                <option>Danmark</option>
                <option>Belgien</option>
                <option>Frankrig</option>
                <option>Holland</option>
                <option>Norge</option>
                <option>Sverige</option>
                <option>Tyskland</option>
              </select>
              <input
                type="text"
                placeholder="Fornavn"
                className="w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.firstName}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    firstName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Efternavn"
                className="w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.lastName}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    lastName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Adresse"
                className="col-span-2 w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.address}
                onChange={handleAddressChange}
              />
              {suggestions.length > 0 && (
                <div className="col-span-2 bg-white border border-gray-300 rounded-md">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        placesService.getDetails(
                          {
                            placeId: suggestion.place_id,
                            fields: ["address_components"],
                          },
                          (place: any) => {
                            const address = place.address_components;
                            const street =
                              address.find((c: any) =>
                                c.types.includes("route")
                              )?.long_name || "";
                            const streetNumber =
                              address.find((c: any) =>
                                c.types.includes("street_number")
                              )?.long_name || "";
                            const city =
                              address.find((c: any) =>
                                c.types.includes("locality")
                              )?.long_name || "";
                            const zipcode =
                              address.find((c: any) =>
                                c.types.includes("postal_code")
                              )?.long_name || "";

                            setShippingInfo({
                              ...shippingInfo,
                              address: `${street} ${streetNumber}`,
                              city,
                              zipcode,
                            });
                            setSuggestions([]);
                          }
                        );
                      }}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="Lejlighed, suite, etc."
                className="col-span-2 w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.apartment}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    apartment: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Postnummer"
                className="w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.zipcode}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    zipcode: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="By"
                className="w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Telefon"
                className="col-span-2 w-full border border-gray-300 rounded-md p-2"
                value={shippingInfo.phone}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
              />
            </div>
            <div className="flex items-center mt-4">
              <input type="checkbox" id="save-info" className="h-4 w-4" />
              <label htmlFor="save-info" className="ml-2 text-sm">
                Gem denne information for hurtigere udtjekning næste gang
              </label>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Leveringsmetode</h2>
            <div className="border border-gray-300 rounded-md p-4 text-sm text-gray-500">
              {shippingOptions.length > 0 ? (
                shippingOptions.map((option: any) => (
                  <div key={option.id} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={option.id}
                      name="shippingRate"
                      value={option.price}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="h-4 w-4"
                    />
                    <div className="flex flex-col w-full">
                      <div className="w-full flex justify-between">
                        <label htmlFor={option.id} className="ml-2 text-black">
                          {option.name}
                        </label>

                        <label
                          htmlFor={option.id}
                          className="ml-2 text-black font-semibold"
                        >
                          {option.price}
                        </label>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>
                  Angiv din leveringsadresse for at se de tilgængelige
                  leveringsmetoder.
                </p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Betaling</h2>
            <div className="space-y-[-1px]">
              <div
                className={`p-4 cursor-pointer border rounded-t-md relative ${
                  paymentMethod === "mobilepay"
                    ? "border-black z-10 bg-[#f5f5f5]"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("mobilepay")}
              >
                <div className="flex items-center">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === "mobilepay"
                        ? "border-black"
                        : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "mobilepay" && (
                      <div className="h-2 w-2 rounded-full bg-black"></div>
                    )}
                  </div>
                  <span className="text-sm">MobilePay</span>
                  <img
                    src={MobilepayIcon}
                    alt="MobilePay"
                    className="h-6 ml-auto"
                  />
                </div>
                {paymentMethod === "mobilepay" && (
                  <div className="mt-4 text-center">
                    <img
                      src={PaymentIcon}
                      alt="Selected payment method"
                      className="h-20 mx-auto"
                    />
                    <p className="text-sm text-black mt-2">
                      {paymentMessages.mobilepay}
                    </p>
                  </div>
                )}
              </div>
              <div
                className={`p-4 cursor-pointer border relative ${
                  paymentMethod === "card"
                    ? "border-black z-10 bg-[#f5f5f5]"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === "card"
                        ? "border-black"
                        : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "card" && (
                      <div className="h-2 w-2 rounded-full bg-black"></div>
                    )}
                  </div>
                  <span className="text-sm">Betalingskort</span>
                  <div className="flex items-center ml-auto space-x-2">
                    <img src={VisaIcon} alt="Visa" className="h-6" />
                    <img src={MasterIcon} alt="Mastercard" className="h-6" />
                  </div>
                </div>
                {paymentMethod === "card" && (
                  <div className="mt-4 text-center">
                    <img
                      src={PaymentIcon}
                      alt="Selected payment method"
                      className="h-20 mx-auto"
                    />
                    <p className="text-sm text-black mt-2">
                      {paymentMessages.card}
                    </p>
                  </div>
                )}
              </div>
              <div
                className={`p-4 cursor-pointer border relative ${
                  paymentMethod === "viabill"
                    ? "border-black z-10 bg-[#f5f5f5]"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("viabill")}
              >
                <div className="flex items-center">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === "viabill"
                        ? "border-black"
                        : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "viabill" && (
                      <div className="h-2 w-2 rounded-full bg-black"></div>
                    )}
                  </div>
                  <span className="text-sm">ViaBill - Del betalingen op</span>
                  <img
                    src={ViabillIcon}
                    alt="ViaBill"
                    className="h-6 ml-auto"
                  />
                </div>
                {paymentMethod === "viabill" && (
                  <div className="mt-4 text-center">
                    <img
                      src={PaymentIcon}
                      alt="Selected payment method"
                      className="h-20 mx-auto"
                    />
                    <p className="text-sm text-black mt-2">
                      {paymentMessages.viabill}
                    </p>
                  </div>
                )}
              </div>
              <div
                className={`p-4 cursor-pointer border rounded-b-md relative ${
                  paymentMethod === "anyday"
                    ? "border-black z-10 bg-[#f5f5f5]"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethod("anyday")}
              >
                <div className="flex items-center">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      paymentMethod === "anyday"
                        ? "border-black"
                        : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "anyday" && (
                      <div className="h-2 w-2 rounded-full bg-black"></div>
                    )}
                  </div>
                  <span className="text-sm">Anyday</span>
                  <img src={AnydayIcon} alt="Anyday" className="h-6 ml-auto" />
                </div>
                {paymentMethod === "anyday" && (
                  <div className="mt-4 text-center">
                    <img
                      src={PaymentIcon}
                      alt="Selected payment method"
                      className="h-20 mx-auto"
                    />
                    <p className="text-sm text-black mt-2">
                      {paymentMessages.anyday}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Faktureringsadresse</h2>
            <div className="space-y-[-1px]">
              <label
                className={`p-4 cursor-pointer border rounded-t-md relative flex items-center ${
                  billingMethod === "same"
                    ? "border-black z-10 bg-[#f5f5f5]"
                    : "border-gray-300"
                }`}
                onClick={() => setBillingMethod("same")}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    billingMethod === "same"
                      ? "border-black"
                      : "border-gray-400"
                  }`}
                >
                  {billingMethod === "same" && (
                    <div className="h-2 w-2 rounded-full bg-black"></div>
                  )}
                </div>
                <span className="text-sm">
                  Samme adresse som leveringsadressen
                </span>
              </label>
              <label
                className={`p-4 cursor-pointer border rounded-b-md relative flex items-center ${
                  billingMethod === "different"
                    ? "border-black z-10 bg-[#f5f5f5]"
                    : "border-gray-300"
                }`}
                onClick={() => setBillingMethod("different")}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    billingMethod === "different"
                      ? "border-black"
                      : "border-gray-400"
                  }`}
                >
                  {billingMethod === "different" && (
                    <div className="h-2 w-2 rounded-full bg-black"></div>
                  )}
                </div>
                <span className="text-sm">
                  Brug en anden faktureringsadresse
                </span>
              </label>
            </div>
          </div>

          <button className="w-full bg-[#1c1c1c] text-white py-3 rounded-md">
            Betal nu
          </button>
        </div>
      </div>
      <div className="lg:col-span-1 bg-[#f2f1f0]">
        <div className="max-w-[550px] mr-auto pl-8 py-8 sticky top-24">
          <div className=" pb-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="bg-white p-1 rounded-md">
                      <img
                        src={item.imageUrl || "https://placehold.co/64x64"}
                        alt={item.name}
                        className="rounded-md w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.selectedSize}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="py-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Rabatkode eller gavekort"
                className="w-full border border-gray-300 rounded-l-md p-2"
              />
              <button className="bg-gray-300 text-gray-700 px-4 rounded-r-md">
                Brug
              </button>
            </div>
          </div>

          <div className="py-4 border-b border-gray-300">
            <div className="flex justify-between items-center text-sm mb-2">
              <p>Subtotal - {cartCount} varer</p>
              <p className="font-medium">{formatPrice(subtotal)}</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p>Levering</p>
              <p className="text-gray-500">
                {shippingCost > 0
                  ? formatPrice(shippingCost)
                  : "Angiv leveringsadresse"}
              </p>
            </div>
          </div>

          <div className="py-4">
            <div className="flex justify-between items-center font-bold text-lg mb-2">
              <p className="text-xl font-semibold">I alt</p>
              <div className="flex align-items-center">
                <p className="mr-2 text-[0.85rem] font-normal text-[#0000008f]">
                  DKK
                </p>

                <p className="text-xl font-semibold">{formatPrice(total)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-left">
              Inklusiv {formatPrice(taxes)} i afgifter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
