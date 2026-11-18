import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Product as ProductType } from "../../types";
import { fetchProduct } from "../../services/api";
import { StarIcon, CheckIcon } from "@heroicons/react/24/solid";
import Accordion from "../../components/Accordion";
import { formatPrice } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";
import Notification from "../../components/Notification";

import { fetchCategory } from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";
import { fetchProducts } from "../../services/api";

// icons for sidepanel

import boxIconUrl from "../../assets/customer/box-icon.svg";
import starIconUrl from "../../assets/customer/star-icon.svg";
import materialIconUrl from "../../assets/customer/material-icon.svg";
import brandImage from "../../assets/over-production.webp";
import { areShoeSizes, sortSizes } from "../../utils/sizes";

const sneakerPoints = [
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

type DetailPoint = { title: string; description: string };

const block = (a: string, b: string) => `${a}\n\n${b}`;

// The three text blocks under the gallery, per category (matched on the
// category name from the API, lower-cased). Keep the blocks of a category
// about the same length.
const DETAIL_POINTS: Record<string, DetailPoint[]> = {
  sneakers: sneakerPoints,
  loafers: [
    {
      title: "Konstruktion",
      description: block(
        "Vores loafers er bygget over en blød, fleksibel læst og syet med præcise sting, så formen holder sig ren og elegant.",
        "Slip-in-formen gør dem lette at tage på, uden at det går ud over pasformen.",
      ),
    },
    {
      title: "Materialer",
      description: block(
        "Overdelen er skåret i blødt ruskind eller fast læder, der former sig efter foden og får karakter med tiden.",
        "Læderhælen og den fleksible sål gør dem behagelige fra den første dag.",
      ),
    },
    {
      title: "Design",
      description: block(
        "Rene linjer, afdæmpede farver og få detaljer giver et tidløst udtryk, der passer til både habit og chinos.",
        "Fra penny til tassel finder du den model, der passer til din stil.",
      ),
    },
  ],
  "dress shoes": [
    {
      title: "Konstruktion",
      description: block(
        "Vores dress shoes er bygget efter klassiske principper med en præcis læst og omhyggelig syning, så formen er skarp og pasformen stabil.",
        "Hvert par er håndlavet i Portugal.",
      ),
    },
    {
      title: "Materialer",
      description: block(
        "Overdelen er skåret i kalveskind eller blødt ruskind med læderforing og læderhæl, så skoene er behagelige hele dagen.",
        "Med god pleje holder de i mange år.",
      ),
    },
    {
      title: "Design",
      description: block(
        "Oxford, derby, brogue og wholecut: traditionelle former tegnet med nordisk enkelhed.",
        "De passer til jakkesættet, og de klæder også en ren skjorte og chinos.",
      ),
    },
  ],
  boots: [
    {
      title: "Konstruktion",
      description: block(
        "Vores støvler er bygget med solide sømme og en robust sål, så de klarer både byen og vejret.",
        "Elastikindsatsen på chelsea-modellerne gør dem lette at tage på og af.",
      ),
    },
    {
      title: "Materialer",
      description: block(
        "Vi bruger fast læder og blødt ruskind med slidstærke såler, og en kraftig lugsål på de grovere modeller.",
        "Med lidt pleje får støvlerne karakter og holder i mange sæsoner.",
      ),
    },
    {
      title: "Design",
      description: block(
        "Chelsea, chukka og snørestøvler med rene linjer og et tidløst udtryk.",
        "De passer til både denim og habit, og er lige så brugbare i hverdagen som til de pæne anledninger.",
      ),
    },
  ],
  skjorter: [
    {
      title: "Konstruktion",
      description: block(
        "Vores skjorter er syet med præcise sømme og en pasform, der sidder rent over skuldre og talje.",
        "Button-down kraven og de fine detaljer holder formen dag efter dag.",
      ),
    },
    {
      title: "Materialer",
      description: block(
        "Vi vælger bomuld og hørlignende stoffer, der er bløde mod huden og luftige at have på.",
        "Stoffet bevarer formen og farven vask efter vask.",
      ),
    },
    {
      title: "Design",
      description: block(
        "Rene linjer, afdæmpede farver og få detaljer giver et tidløst udtryk, der passer til både kontoret og weekenden.",
        "Brug den alene eller under en blazer.",
      ),
    },
  ],
  accessories: [
    {
      title: "Konstruktion",
      description: block(
        "Vores tasker er bygget med solide sømme, kraftig lynlås og forstærkede kanter, så de holder til daglig brug.",
        "Den justerbare rem gør den let at tilpasse.",
      ),
    },
    {
      title: "Materialer",
      description: block(
        "Vi bruger fast læder med solide beslag, som får karakter og patina med tiden.",
        "Lædret er valgt for at holde i mange år.",
      ),
    },
    {
      title: "Design",
      description: block(
        "Et kompakt og roligt design med få detaljer og det fremhævede NordWear-logo.",
        "Den passer til resten af kollektionen og til de fleste outfits.",
      ),
    },
  ],
};

const rating = { value: 4.7, count: 128 };

const salesPoints = [
  "Fri fragt ved køb over 499,-",
  "Levering indenfor 1-3 hverdage",
  "Forlænget 30-dages returret",
];

const eyebrowClass =
  "font-['figtree'] text-xs font-semibold uppercase tracking-[0.28em] text-[#1c1c1c]/50";

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
    return sortSizes(
      Array.from(sizeMap.entries()).map(([id, name]) => ({ id, name })),
    );
  }, [product, selectedColor]);

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].name);
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0].name);
    }
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  const detailPoints = DETAIL_POINTS[categoryName.toLowerCase()] ?? [];

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

  // While the product is fetched the page keeps the shape of the finished one (the same picture tiles and info column in
  // the placeholder grey the pictures use), so the footer stays below the fold and nothing jumps when the product arrives.
  // (It used to be a line of text: the page was so short that the dark footer rose up under the header for a moment.)
  if (loading)
    return (
      <div className="overflow-x-hidden bg-[#fefffe] text-[#1c1c1c]" aria-busy="true" aria-label="Indlæser produkt">
        <div className="px-6 pb-16 pt-8 md:px-12 md:pb-24 md:pt-12">
          <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-16 xl:gap-24">
            <div className="md:hidden">
              <div className="aspect-[4/5] w-full bg-[#e9e7e3]" />
            </div>
            <div className="hidden grid-cols-1 gap-2 md:grid md:grid-cols-2">
              {[0, 1, 2, 3].map((tile) => (
                <div key={tile} className="aspect-[4/5] w-full bg-[#e9e7e3]" />
              ))}
            </div>
            <div className="mt-10 lg:mt-0 lg:pt-32">
              <div className="mb-4 h-3 w-24 bg-[#e9e7e3]" />
              <div className="h-10 w-3/4 bg-[#e9e7e3] md:h-12" />
              <div className="mt-6 h-4 w-40 bg-[#e9e7e3]" />
              <div className="mt-8 h-7 w-32 bg-[#e9e7e3]" />
              <div className="mt-10 h-12 w-full bg-[#e9e7e3]" />
            </div>
          </div>
        </div>
      </div>
    );
  if (error)
    return <div className="min-h-[70vh] py-20 text-center text-red-500">{error}</div>;
  if (!product)
    return <div className="min-h-[70vh] py-20 text-center">Product not found</div>;

  const { name, price, offer_price, images } = product;

  return (
    <div className="overflow-x-hidden bg-[#fefffe] text-[#1c1c1c]">
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

      <div className="px-6 pb-16 pt-8 md:px-12 md:pb-24 md:pt-12">
        <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-16 xl:gap-24">
          {/* Phone: one big main image with the others as small thumbnails underneath; a tap on a
              thumbnail changes the main image. */}
          {images && images.length > 0 && (
            <div className="md:hidden">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#e9e7e3]">
                <img
                  key={selectedImage ?? images[0].url}
                  src={selectedImage ?? images[0].url}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {images.map((image, idx) => {
                    const active = (selectedImage ?? images[0].url) === image.url;
                    return (
                      <button
                        key={image.id ?? image.url ?? idx}
                        type="button"
                        onClick={() => setSelectedImage(image.url)}
                        aria-label={`${name} ${idx + 1}`}
                        aria-current={active}
                        className={`aspect-[4/5] w-full overflow-hidden bg-[#e9e7e3] outline outline-1 outline-offset-2 transition-opacity duration-200 ${
                          active ? "outline-[#1c1c1c]" : "outline-transparent opacity-60"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tablet and desktop: portrait tiles with a tight gap */}
          <div className="hidden grid-cols-1 gap-2 md:grid md:grid-cols-2">
            {images &&
              images.map((image, idx) => (
                <div
                  key={image.id ?? image.url ?? idx}
                  className="aspect-[4/5] w-full overflow-hidden bg-[#e9e7e3]"
                >
                  <img
                    src={image.url}
                    alt={`${name}-${idx}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
          </div>

          {/* Product info: sticks while the gallery scrolls on desktop */}
          <div className="mt-10 lg:sticky lg:top-32 lg:mt-0">
            {categoryName && <p className={`${eyebrowClass} mb-4`}>{categoryName}</p>}
            <h1 className="font-garamond text-4xl leading-tight md:text-5xl">
              {name}
            </h1>

            <div className="mt-4 flex items-center">
              <div className="flex items-center gap-0.5 text-[#b8935a]">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating.value) ? "" : "opacity-25"
                    }`}
                  />
                ))}
              </div>
              <p className="ml-3 text-xs text-[#1c1c1c]/60">
                {rating.value.toFixed(1)} &middot; {rating.count} anmeldelser
              </p>
            </div>

            {/* Price */}
            <div className="mt-8 flex items-baseline gap-3 font-garamond">
              {offer_price ? (
                <>
                  <span className="text-3xl">{formatPrice(offer_price)}</span>
                  <span className="text-lg text-[#1c1c1c]/45 line-through">
                    {formatPrice(price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl">{formatPrice(price)}</span>
              )}
            </div>

            {/* Selection Controls */}
            <div className="mt-10 space-y-8">
              {availableColors.length > 1 && (
                <div>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h3 className={eyebrowClass}>Farve</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.name)}
                        aria-label={color.name}
                        className={`h-9 w-9 rounded-full border p-0.5 transition-colors ${
                          selectedColor === color.name
                            ? "border-[#1c1c1c]"
                            : "border-transparent hover:border-[#1c1c1c]/30"
                        }`}
                      >
                        <div
                          className="h-full w-full rounded-full border border-black/10"
                          style={{ backgroundColor: color.name }}
                        ></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes as buttons instead of a dropdown */}
              <div>
                <h3 className={`${eyebrowClass} mb-3`}>
                  {areShoeSizes(availableSizes) ? "Størrelse (EU)" : "Størrelse"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.name)}
                      className={`min-w-[3.5rem] border px-3 py-3 text-sm transition-colors duration-200 ${
                        selectedSize === size.name
                          ? "border-[#1c1c1c] bg-[#1c1c1c] text-white"
                          : "border-[#1c1c1c]/20 bg-transparent hover:border-[#1c1c1c]"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full border border-[#1c1c1c] bg-[#1c1c1c] py-4 font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.2em] text-white [transition-delay:0s,150ms] [transition-duration:300ms,0s] [transition-property:background-color,color] [transition-timing-function:linear] hover:bg-[#fefffe] hover:text-[#1c1c1c]"
              >
                Føj til indkøbskurv
              </button>
            </div>

            {/* Key sales points */}
            <ul className="mt-8 space-y-3 border-y border-[#1c1c1c]/15 py-6 text-sm">
              {salesPoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <CheckIcon className="h-4 w-4 shrink-0 text-[#1c1c1c]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Product description */}
            <div className="whitespace-pre-line py-8 text-sm leading-relaxed text-[#1c1c1c]/75 md:text-base">
              {product.description || "Ingen beskrivelse tilgængelig."}
            </div>

            {/* Accordions */}
            <div className="border-t border-[#1c1c1c]/15">
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
                  <ul className="list-none space-y-3 pt-2 text-sm text-[#1c1c1c]/75 md:text-base">
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

      {/* Detail points, specific to the product's category */}
      {detailPoints.length > 0 && (
        <section className="px-6 pb-16 md:px-12 md:pb-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            {detailPoints.map((point) => (
              <div key={point.title} className="space-y-4">
                <h3 className="font-garamond text-3xl md:text-4xl">
                  {point.title}
                </h3>
                <div className="h-px w-10 bg-[#1c1c1c]/30" aria-hidden="true" />
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#1c1c1c]/70 md:text-base">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quote */}
      <section className="w-full bg-[#f2f1f0] px-6 py-16 text-center md:py-24">
        <h2 className="mx-auto max-w-4xl font-garamond text-2xl leading-snug md:text-4xl md:leading-[1.25]">
          Hos NordWear tror vi på forfinelse frem for forandring &ndash;
          tidløse designs til den bevidste mand.
        </h2>
      </section>

      {/* Related products */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <h2 className="font-garamond text-3xl leading-tight md:text-5xl">
            Du er måske også interesseret i
          </h2>
          {categoryName && (
            <Link
              to={`/category/${categoryName.toLowerCase()}`}
              className="group hidden shrink-0 items-center gap-2 border-b border-[#1c1c1c] pb-1 font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.18em] md:inline-flex"
            >
              Se alle {categoryName.toLowerCase()}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              portrait
              onNotify={handleNotification}
            />
          ))}
        </div>
      </section>

      {/* Brand values */}
      <section className="grid grid-cols-1 items-stretch md:grid-cols-2">
        <div className="h-72 overflow-hidden md:h-[600px]">
          <img
            src={brandImage}
            alt="Design"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center bg-white px-6 py-14 md:px-16 lg:px-24">
          <div className="max-w-xl">
            <p className={`${eyebrowClass} mb-5`}>Vores værdier</p>
            <h2 className="mb-6 font-garamond text-3xl leading-tight md:text-5xl">
              Skandinavisk design &ndash; håndarbejde fra Portugal
            </h2>
            <p className="text-sm leading-relaxed text-[#1c1c1c]/75 md:text-lg">
              Vi skaber ikke trends – vi skaber tidløse stykker. Hvert produkt
              kombinerer nordisk minimalisme, sofistikeret design og
              uomtvisteligt komfort. Udvalgt materiale for dets kvalitet,
              skønhed og karakter.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
