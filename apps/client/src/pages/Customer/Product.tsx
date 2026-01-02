import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
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

const sneakerspoints = [
  {
    title: "Konstruktion",
    description: `Sneakerens overdel er omhyggeligt fastgjort til sålen med en præcis syning, hvilket skaber en ren og strømlinet silhuet, samtidig med at strukturen bevares og komforten understøttes. 

  Resultatet er en sneaker, der kombinerer visuel elegance med funktionalitet, så du kan bevare et skarpt og stilfuldt udtryk – fra mødelokalet til hverdagen.`,
  },
  {
    title: "Materialer",
    description: `Vores sneakers er fremstillet af premium materialer, herunder blødt læder og slidstærkt kanvas, der sikrer både komfort og holdbarhed. 

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

// Mock Rating
const rating = { value: 4.7, count: 128 };

// Mock Key Sales Points
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
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { addToCart } = useCart();

  // State for selections
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
        // Set initial selected image and color
        if (fetchedProduct?.images?.length > 0) {
          setSelectedImage(fetchedProduct.images[0].url);
        }
        if (fetchedProduct?.product_quantity?.length > 0) {
          // This logic assumes we can derive colors from product_quantity
          // A better approach would be for the API to provide a clean color list
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

  // Memoize derived lists of unique colors and sizes
  const availableColors = useMemo(() => {
    if (!product || !product.product_quantity) return [];
    const colorMap = new Map();
    product.product_quantity.forEach((pq) => {
      // @ts-ignore - color relation is not in type, but is fetched
      if (pq.color) colorMap.set(pq.color.id, pq.color.name);
    });
    return Array.from(colorMap.values());
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product || !product.product_quantity) return [];
    const sizeMap = new Map();
    product.product_quantity.forEach((pq) => {
      // @ts-ignore - size relation is not in type, but is fetched
      if (pq.size) sizeMap.set(pq.size.id, pq.size.name);
    });
    return Array.from(sizeMap.values());
  }, [product]);

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, selectedSize, imageUrl: selectedImage });
      setNotification({
        message: "Produkt tilføjet til kurv!",
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 2000);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  const { name, price, offer_price, images } = product;

  return (
    <div className="bg-[#f2f1f0] mt-12">
      {notification && (
        <Notification
          heading={notification.type === "success" ? "Success" : "Fejl"}
          subtext={notification.message}
          type={notification.type}
          show={true}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="lg:grid md:grid-cols-[2fr_1fr] lg:gap-[5rem] lg:px-12">
        {/* Image gallery */}
        <div className="lg:col-span-1">
          <div className="lg:grid lg:grid-cols-2 lg:gap-4">
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
        <div className="lg:col-span-1 px-4 py-6 lg:px-0 lg:py-0">
          <h1 className="text-[clamp(1.5rem,4vw,2.625rem)] text-gray-800 font-['EB_Garamond'] pb-3">
            {name}
          </h1>
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating.value)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="ml-2 text-sm font-medium text-gray-600">
              {rating.value.toFixed(1)} ({rating.count} anmeldelser)
            </p>
          </div>
          {/* Key Sales Points */}
          <ul className="mt-4 space-y-2 text-[clamp(1rem,.875vw,1rem)] text-[#1c1c1c]">
            {salesPoints.map((point) => (
              <li key={point} className="flex items-center">
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {/* Price */}
          <div className="mt-6">
            <p className="font-['EB_Garamond'] ">
              {offer_price ? (
                <span className="flex items-baseline gap-3">
                  <span className="text-[1.3125rem] font-bold text-[rgb(48,122,7)]">
                    {formatPrice(offer_price)}
                  </span>
                  <span className="line-through text-lg text-[#1c1c1ca6]">
                    {formatPrice(price)}
                  </span>
                </span>
              ) : (
                <span className="text-[1.3125rem] font-bold text-[#1c1c1ca6]">
                  {formatPrice(price)}
                </span>
              )}
            </p>
          </div>
          {/* Color Swatches */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Farve</h3>
            <div className="flex items-center space-x-2 mt-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 p-0.5 ${
                    selectedColor === color
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <div
                    className="h-full w-full rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  ></div>
                </button>
              ))}
            </div>
          </div>
          {/* Size Dropdown */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Størrelse</h3>
            <div className="relative mt-2" ref={dropdownRef}>
              <button
                onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                className="w-full flex justify-between items-center px-3 py-2 text-base border border-gray-400 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <span>{selectedSize || "Vælg størrelse"}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 text-gray-700 transition-transform duration-200 ${
                    sizeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sizeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-400 z-10 animate-in fade-in duration-200">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-base transition-colors ${
                        selectedSize === size
                          ? "bg-[#1c1c1c] text-white"
                          : "bg-white text-gray-900 hover:bg-[#6b6b6b] hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Add to Cart Button */}
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#1c1c1c] text-white text-[1rem] py-3 font-['montserrat'] hover:bg-opacity-90"
            >
              Føj til indkøbskurv
            </button>
          </div>

          {/* Product description shown under the two accordions */}
          <div className="text-gray-700 whitespace-pre-line my-6">
            {product.description || "Ingen beskrivelse."}
          </div>

          {/* Accordions */}
          <div className="mt-6 border-t border-[#d1d0cd]">
            <Accordion
              id="shipping"
              isOpen={openAccordion === "shipping"}
              onToggle={() =>
                setOpenAccordion(
                  openAccordion === "shipping" ? null : "shipping"
                )
              }
              icon={<TruckIcon className="h-6 w-6 text-gray-700" />}
              title="Gratis fragt | Gratis ombytning"
              content="Altid gratis fragt til Bring Pakkeshop."
            />
            <Accordion
              id="trustpilot"
              isOpen={openAccordion === "trustpilot"}
              onToggle={() =>
                setOpenAccordion(
                  openAccordion === "trustpilot" ? null : "trustpilot"
                )
              }
              icon={<ShieldCheckIcon className="h-6 w-6 text-gray-700" />}
              title="Fremragende | Trustpilot"
              content="Læs alle vores +500 anmeldelser på Trustpilot"
            />
            <Accordion
              id="materials"
              isOpen={openAccordion === "materials"}
              onToggle={() =>
                setOpenAccordion(
                  openAccordion === "materials" ? null : "materials"
                )
              }
              icon={<ShieldCheckIcon className="h-6 w-6 text-gray-700" />}
              title="Materialer"
              content={
                <ul className="list-none space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      Vores T-shirts er fremstillet af 100% økologisk,
                      langfibret bomuld, som giver en ekstra blød, åndbar og
                      slidstærk kvalitet. Stoffet holder formen vask efter vask
                      og føles behageligt mod huden hele dagen.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      Den strikkede jersey-konstruktion gør stoffet naturligt
                      fleksibelt, så T-shirten bevæger sig med kroppen uden at
                      miste pasformen. Samtidig reducerer den højere tråd- og
                      garnkvalitet risikoen for fnuldring.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      Forstærkede syninger ved skuldre og hals sikrer bedre
                      holdbarhed og gør, at T-shirten bevarer sin pasform over
                      længere tid – selv ved hyppig brug.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      Farveægtheden er optimeret gennem miljøvenlige
                      farveprocesser, som giver dybere og mere holdbare farver
                      uden brug af skadelige kemikalier.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      Vores etiketter er vævet i blødt, hudvenligt materiale,
                      som ikke kradser og gør T-shirten endnu mere behagelig at
                      have på.
                    </span>
                  </li>
                </ul>
              }
            />

            <Accordion
              id="sizeGuide"
              isOpen={openAccordion === "sizeGuide"}
              onToggle={() =>
                setOpenAccordion(
                  openAccordion === "sizeGuide" ? null : "sizeGuide"
                )
              }
              icon={<CheckIcon className="h-6 w-6 text-gray-700" />}
              title="Størrelsesguide"
              content={
                <ul className="list-none space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                      Alle vores T-shirts er ”true to size”, og derfor anbefaler
                      vi, at du vælger den størrelse, du normalt bruger.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Hvad er min størrelse?</div>
                      <div>
                        Du kan nemt finde den rigtige størrelse ved at bruge
                        vores størrelsesguide,.
                      </div>
                    </div>
                  </li>
                </ul>
              }
            />
          </div>
        </div>
      </div>
      <section className="grid grid-cols-3 px-12 gap-[4.375rem] border border-t-[#d1d0cd] py-14 mt-20">
        {sneakerspoints.map((point) => (
          <div key={point.title}>
            <h3 className="text-3xl text-gray-800 mb-4 font-['EB_Garamond']">
              {point.title}
            </h3>
            <p className="text-gray-700 text-[1rem] leading-6 whitespace-pre-line">
              {point.description}
            </p>
          </div>
        ))}
      </section>

      <section className="py-14 w-full bg-[#181c2e] text-center">
        <h1 className="font-['EB-Garamond'] text-4xl text-white  leading-[1.4] max-w-4xl mx-auto px-4">
          Hos NORDWEAR tror vi på forfinelse frem for forandring – tidløse
          sneakers til den bevidste mand.
        </h1>
      </section>

      <section className="mt-14 flex flex-col items-center pb-20 px-12">
        <h1 className="text-4xl font-['EB_Garamond'] text-center color-[#1c1c1c]">
          Du er måske også interesseret i
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {categoryName && (
          <button className="bg-[#1c1c1c] text-white px-6 py-2 mt-6">
            Se alle {categoryName.toLowerCase()}
          </button>
        )}
      </section>

      <div className="relative border-y border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
          {/* Image on the left */}
          <div className="max-h-[650px] md:h-screen overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1569664739361-5d5727ca3df9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Design"
              className="w-full object-cover block h-full"
            />
          </div>

          {/* White box overlapping in center */}
          <div className="relative pr-12 md:ml-[-64px] z-10">
            <div className="bg-white text-center py-16 px-8 md:px-12 shadow-lg relative">
              <h1 className="text-[2.25rem] md:text-4xl font-['EB_Garamond'] mb-6">
                Skandinavisk design - Håndarbejde fra Portugal
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                Vi skaber ikke trends – vi skaber tidløse stykker. Hvert produkt
                kombinerer nordisk minimalisme, sofistikeret design og
                uomtvisteligt komfort. Udvalgt materiale for dets kvalitet,
                skønhed og karakter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
