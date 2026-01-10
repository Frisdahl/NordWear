import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Product as ProductType } from "../../types";
import { fetchProduct } from "../../services/api";
import {
  StarIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import Accordion from "../../components/Accordion";
import { formatPrice } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";
import Notification from "../../components/Notification";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { fetchCategory } from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";
import { fetchProducts } from "../../services/api";

// icons for sidepanel

import boxIconUrl from "../../assets/customer/box-icon.svg";
import starIconUrl from "../../assets/customer/star-icon.svg";
import materialIconUrl from "../../assets/customer/material-icon.svg";
import sizeIconUrl from "../../assets/customer/size-icon.svg";

const sneakerspoints = [
  {
    title: "Konstruktion",
    description: `Sneakerens overdel er omhyggeligt fastgjort til sålen med en præcis syning, hvilket skaber en ren og strømlinet silhuet, samtidig med at strukturen bevares og komforten understøttes. 

  Resultatet er en sneaker, der kombinerer visuel elegance med funktionalitet, så du kan bevare et skarpt og stilfuldt udtryk – fra mødelokalet til hverdagen.`,
  },
  {
    title: "Materialer",
    description: `Vores sneakers fremstilles af premium materialer, herunder blødt læder og slidstærkt kanvas, der sikrer både komfort og holdbarhed. 

 Den polstrede indersål giver ekstra støtte til dine fødder, mens den fleksible ydersål sikrer et godt greb på forskellige overflader. 

 Uanset om du går en tur i byen eller tilbringer dagen på farten, vil vores sneakers holde dine fødder glade og stilfulde.`,
  },
  {
    title: "Design",
    description: `Vores sneakers kombinerer moderne æstetik med tidløse elementer for at skabe et alsidigt design, der passer til enhver lejlighed. 

 Med rene linjer, subtile detaljer og en neutral farvepalette er disse sneakers perfekte til både afslappede og mere formelle outfits. 

 Uanset om du klæder dig op eller ned, vil vores sneakers tilføje et strejf af sofistikeret stil til dit look.`,
  },
];

const rating = { value: 4.7, count: 128 };

const salesPoints = [
  "✔ Fri fragt ved køb over 499,-",
  "✔ Levering indenfor 1-3 hverdage",
  "✔ Forlænget 30-dages returret",
];

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    heading: string;
    subtext: string;
    type: "success" | "error" | "";
  }>({ heading: "", subtext: "", type: "" });
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSizeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!id) return;
    const getProduct = async () => {
      try {
        const fetchedProduct = await fetchProduct(Number(id));
        setProduct(fetchedProduct);
        if (fetchedProduct?.images?.length > 0) {
          setSelectedImage(fetchedProduct.images[0].url);
        }
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const getRelatedProducts = async () => {
        try {
          const products = await fetchProducts(
            undefined,
            { categories: [product.category_Id] },
            5
          );
          setRelatedProducts(
            products.filter((p: ProductType) => p.id !== product.id).slice(0, 4)
          );
        } catch (err) {
          console.error("Failed to fetch related products", err);
        }
      };
      const getCategoryName = async () => {
        try {
          const category = await fetchCategory(product.category_Id);
          setCategoryName(category.name);
        } catch (err) {
          console.error("Failed to fetch category name", err);
        }
      };
      getRelatedProducts();
      getCategoryName();
    }
  }, [product]);

  const availableColors = useMemo(() => {
    if (!product || !product.product_quantity) return [];
    const colorMap = new Map<number, string>();
    product.product_quantity.forEach((pq) => {
      if (pq.color) colorMap.set(pq.color.id, pq.color.name);
    });
    return Array.from(colorMap.entries()).map(([id, name]) => ({ id, name }));
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product || !product.product_quantity) return [];
    const sizeMap = new Map<number, string>();
    product.product_quantity.forEach((pq) => {
      // Only show sizes that are available in the selected color
      if (selectedColor && pq.color?.name !== selectedColor) return;

      if (pq.size) sizeMap.set(pq.size.id, pq.size.name);
    });
    return Array.from(sizeMap.entries()).map(([id, name]) => ({ id, name }));
  }, [product, selectedColor]);

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].name);
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0].name);
    }
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  const handleNotification = (data: {
    heading: string;
    subtext: string;
    type: "success" | "error";
  }) => {
    setNotification({
      heading: data.heading,
      subtext: data.subtext,
      type: data.type as "success" | "error",
    });
  };

  const handleAddToCart = () => {
    if (product) {
      const colorId = availableColors.find((c) => c.name === selectedColor)?.id;
      const sizeId = availableSizes.find((s) => s.name === selectedSize)?.id;

      addToCart({
        ...product,
        selectedSize: selectedSize || undefined,
        selectedSizeId: sizeId,
        selectedColorId: colorId,
        imageUrl: selectedImage as any,
      });
      handleNotification({
        heading: "Lagt i kurv",
        subtext: `${product.name} er lagt i din kurv.`,
        type: "success",
      });
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  const { name, price, offer_price, images } = product;

  return (
    <div className="bg-[#f2f1f0] overflow-x-hidden">
      {notification.subtext && (
        <Notification
          heading={notification.heading}
          subtext={notification.subtext}
          type={notification.type as "success" | "error"}
          show={true}
          onClose={() =>
            setNotification({ heading: "", subtext: "", type: "" })
          }
        />
      )}

      <div className="px-6 md:px-12 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-16 xl:gap-24">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images &&
                images.map((image, idx) => (
                  <div
                    key={image.id ?? image.url ?? idx}
                    className="w-full aspect-square bg-gray-200"
                  >
                    <img
                      src={image.url}
                      alt={`${name}-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-3xl md:text-4xl lg:text-4xl text-gray-800 font-['EB_Garamond'] mb-4">
              {name}
            </h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 md:h-5 md:w-5 ${
                      i < Math.floor(rating.value)
                        ? "text-[#c9a326]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-xs md:text-sm font-medium text-gray-600">
                {rating.value.toFixed(1)} ({rating.count} anmeldelser)
              </p>
            </div>

            {/* Key Sales Points */}
            <ul className="space-y-2 text-sm md:text-base text-[#1c1c1c] mb-8">
              {salesPoints.map((point) => (
                <li key={point} className="flex items-center">
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mb-8">
              <p className="font-['EB_Garamond']">
                {offer_price ? (
                  <span className="flex items-baseline gap-3">
                    <span className="font-normal text-[clamp(1rem,4vw,1.5rem)] text-[rgb(48,122,7)]">
                      {formatPrice(offer_price)}
                    </span>
                    <span className="line-through text-lg text-[#1c1c1ca6]">
                      {formatPrice(price)}
                    </span>
                  </span>
                ) : (
                  <span className="font-normal text-[clamp(1.5rem,5vw,1.5rem)] text-[#1c1c1ca6]">
                    {formatPrice(price)}
                  </span>
                )}
              </p>
            </div>

            {/* Selection Controls */}
            <div className="space-y-6 mb-10">
              {/* Color Swatches */}
              {availableColors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Farve
                  </h3>
                  <div className="flex items-center space-x-3">
                    {availableColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.name)}
                        className={`h-8 w-8 rounded-full border-2 p-0.5 transition-all ${
                          selectedColor === color.name
                            ? "border-[#1c1c1c]"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <div
                          className="h-full w-full rounded-full border border-gray-200"
                          style={{ backgroundColor: color.name }}
                        ></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Dropdown */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Størrelse
                </h3>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                    className="w-full flex justify-between items-center px-4 py-3 text-base border border-[#00000026] bg-white hover:bg-gray-50 focus:outline-none rounded-sm transition-colors"
                  >
                    <span>{selectedSize || "Vælg størrelse"}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-gray-700 transition-transform duration-200 ${
                        sizeDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {sizeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#00000026] z-20 shadow-lg rounded-sm">
                      {availableSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            setSelectedSize(size.name);
                            setSizeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-base transition-colors ${
                            selectedSize === size.name
                              ? "bg-[#1c1c1c] text-white"
                              : "bg-white text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#1c1c1c] text-white text-[1rem] py-4 font-semibold hover:bg-opacity-90 transition-all rounded-sm shadow-sm"
              >
                Føj til indkøbskurv
              </button>
            </div>

            {/* Product description */}
            <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line mb-8 border-t border-[#00000026] pt-8">
              {product.description || "Ingen beskrivelse tilgængelig."}
            </div>

            {/* Accordions */}
            <div className="border-t border-[#00000026]">
              <Accordion
                id="shipping"
                isOpen={openAccordion === "shipping"}
                onToggle={() =>
                  setOpenAccordion(
                    openAccordion === "shipping" ? null : "shipping"
                  )
                }
                icon={<img src={boxIconUrl} className="h-5 w-5" />}
                title="Gratis fragt | Gratis ombytning"
                content="Altid gratis fragt til Bring Pakkeshop ved køb over 499,-."
              />
              <Accordion
                id="trustpilot"
                isOpen={openAccordion === "trustpilot"}
                onToggle={() =>
                  setOpenAccordion(
                    openAccordion === "trustpilot" ? null : "trustpilot"
                  )
                }
                icon={<img src={starIconUrl} className="h-5 w-5" />}
                title="Fremragende | Trustpilot"
                content="Læs alle vores +500 anmeldelser på Trustpilot. Vi vægter kundeservice og kvalitet højere end alt andet."
              />
              <Accordion
                id="materials"
                isOpen={openAccordion === "materials"}
                onToggle={() =>
                  setOpenAccordion(
                    openAccordion === "materials" ? null : "materials"
                  )
                }
                icon={<img src={materialIconUrl} className="h-5 w-5" />}
                title="Materialer"
                content={
                  <ul className="list-none space-y-3 text-sm md:text-base text-gray-700 pt-2">
                    <li className="flex items-start gap-3">
                      <span>
                        ✔ Premium europæiske materialer udvalgt for holdbarhed
                        og komfort.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>
                        ✔ Håndlavet i Portugal under ansvarlige arbejdsforhold.
                      </span>
                    </li>
                  </ul>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Points Section */}
      <section className="px-6 md:px-12 py-16 border-t border-[#00000026] bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {sneakerspoints.map((point) => (
            <div key={point.title}>
              <h3 className="text-2xl md:text-3xl text-gray-800 mb-4 font-['EB_Garamond']">
                {point.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 w-full bg-[#181c2e] text-center px-6">
        <h2 className="font-['EB_Garamond'] text-2xl md:text-4xl text-white leading-snug max-w-4xl mx-auto">
          Hos NORDWEAR tror vi på forfinelse frem for forandring – tidløse
          designs til den bevidste mand.
        </h2>
      </section>

      {/* Related Products */}
      <section className="py-16 px-6 md:px-12 bg-[#f2f1f0]">
        <h2 className="text-3xl md:text-4xl font-['EB_Garamond'] text-center mb-12">
          Du er måske også interesseret i
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNotify={handleNotification}
            />
          ))}
        </div>
        {categoryName && (
          <div className="text-center mt-12">
            <Link
              to={`/category/${categoryName.toLowerCase()}`}
              className="bg-[#1c1c1c] border border-[#1c1c1c] rounded-full text-white px-8 py-3 font-semibold hover:bg-transparent hover:text-[#1c1c1c] transition-all"
            >
              Se alle {categoryName.toLowerCase()}
            </Link>
          </div>
        )}
      </section>

      {/* Brand Values Block */}
      <div className="border-y border-[#00000026] bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="h-72 md:h-[600px] overflow-hidden order-1 md:order-none">
            <img
              src="https://images.unsplash.com/photo-1569664739361-5d5727ca3df9?q=80&w=1470&auto=format&fit=crop"
              alt="Design"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:p-16 lg:p-24 bg-transparent">
            <h2 className="text-3xl md:text-4xl font-['EB_Garamond'] mb-6">
              Skandinavisk design - Håndarbejde fra Portugal
            </h2>
            <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
              Vi skaber ikke trends – vi skaber tidløse stykker. Hvert produkt
              kombinerer nordisk minimalisme, sofistikeret design og
              uomtvisteligt komfort. Udvalgt materiale for dets kvalitet,
              skønhed og karakter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
