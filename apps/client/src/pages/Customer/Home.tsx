import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import { Product } from "../../types";
import { fetchProducts } from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";
import Notification from "../../components/Notification";
import RatingSlider from "../../components/customer/RatingSlider";
import CategoryCard from "../../components/customer/CategoryCard";

const categories = [
  {
    name: "Jackets",
    imageUrl:
      "https://images.unsplash.com/photo-1562009578-0eb8ea8a26ce?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Sneakers",
    imageUrl:
      "https://images.unsplash.com/photo-1598603784143-1b58f6d79c78?q=80&w=1526&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Hoodies",
    imageUrl:
      "https://images.unsplash.com/photo-1523124006244-a37848c6002c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Pants",
    imageUrl:
      "https://images.unsplash.com/photo-1730463527791-772d413cad69?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const popupShown = sessionStorage.getItem("popupShown");
    if (popupShown) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem("popupShown", "true");
    }, 12000); // 12 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async () => {
    if (!emailInput || !emailInput.includes("@")) return;
    setSubscribeStatus("loading");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });
      if (res.ok) {
        setSubscribeStatus("success");
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        setSubscribeStatus("error");
      }
    } catch (e) {
      setSubscribeStatus("error");
    }
  };

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts(undefined, undefined, 12);
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAuthRequired = () => {
    setNotification({
      message: "Du skal være logget ind for at tilføje til ønskelisten.",
      type: "error",
    });
  };

  return (
    <div className="text-[#1c1c1c]">
      {notification.message && (
        <Notification
          show={!!notification.message}
          heading={notification.type === 'error' ? 'Fejl' : 'Success'}
          subtext={notification.message}
          type={notification.type as "success" | "error"}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

      {/* Hero Section */}
      <section className="h-screen max-h-[85vh] bg-gray-800 flex items-end text-white relative -mt-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1577686330226-d71f1d510d9c?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            filter: "brightness(0.6)",
          }}
        ></div>
        <div className="text-center z-10 p-4 pb-16 w-full">
          <h1 className="text-5xl md:text-5xl font-normal font-['EB_Garamond'] tracking-tighter mb-4">
            Stilrene, håndlavede produkter.
          </h1>
          <p className="text-lg md:text-xl font-['EB_Garamond'] mb-8 max-w-2xl mx-auto">
            Til den moderne eventyrer. Kompromisløs kvalitet inspireret af
            naturen.
          </p>
          <button className="bg-[#f2f1f0] text-[#1c1c1c] font-semibold py-3 px-8 hover:bg-opacity-90 transition-transform transform">
            Se alle produkter
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-13 relative">
        <div className="mx-auto">
          <h2 className="text-4xl font-['EB_Garamond'] text-center mb-12">
            Udvalgte produkter
          </h2>
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="relative px-12">
              <div
                className="embla overflow-hidden group relative"
                ref={emblaRef}
              >
                <div className="embla__container flex relative flex-row items-stretch">
                  {products.map((product, index) => (
                    <div
                      className="embla__slide flex-none w-full sm:w-1/2 md:w-1/2 lg:w-1/4 flex items-center justify-center p-2"
                      key={product.id}
                    >
                      <ProductCard
                        product={product}
                        index={index}
                        onAuthRequired={handleAuthRequired}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/category"
              className="bg-[#181c2e] text-white py-3 font-semibold px-8 transition-transform transform hover:scale-105"
            >
              Se alle
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 relativ grid-cols-2 md:grid-cols-2 gap-6 px-6 md:px-12 grid">
        {categories.map((category) => (
          <Link
            to={`/category/${category.name.toLowerCase()}`}
            key={category.name}
          >
            <CategoryCard name={category.name} imageUrl={category.imageUrl} />
          </Link>
        ))}
      </section>

      <div className="relative border-y border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center min-h-96 md:min-h-screen">
          {/* Image on the left */}
          <div className="h-96 md:h-screen overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1603787081207-362bcef7c144?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Design"
              className="w-full h-96 md:h-screen object-cover block"
            />
          </div>

          {/* White box overlapping in center */}
          <div className="relative pr-12 md:ml-[-64px] z-10">
            <div className="bg-white text-center py-16 px-12 shadow-lg relative">
              <h1 className="text-[2.25rem] md:text-4xl font-['EB_Garamond'] mb-6">
                Dansk design - Håndlavet i Portugal
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                Vi laver ikke hurtig mode. Vi laver produkter, der forener
                skandinavisk enkelhed, raffineret æstetik og kompromisløs
                komfort. Altid i nøje udvalgte materialer – valgt for deres
                kvalitet, skønhed og følelse.
              </p>
              <button className="border-b-2 border-black pb-1 text-sm md:text-base font-medium hover:border-gray-600 transition-colors">
                Læs mere
              </button>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-[2.625rem] text-center mt-14 px-6 font-['EB_Garamond'] mb-14">
        Hos NordWear tror vi på forfinelse frem for forandring - <br></br>{" "}
        tidløst design, kvalitet og bæredygtighed.
      </h1>

      <div className="border-y border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center min-h-96 md:min-h-screen">
          {/* Image on the left */}
          <div className="h-96 md:h-screen overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Design"
              className="w-full h-96 md:h-screen object-cover block"
            />
          </div>
          {/* Text for right side */}
          <div>
            <div className="py-8 max-w-xl">
              <h1 className="text-[2.25rem] md:text-4xl font-['EB_Garamond'] mb-6">
                Slut med overproduktion
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                Vores "Made for you" koncept bygger på slow fashion og handler
                om at undgå overproduktion og evige udsalg.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                Vi laver tidløse designs, så vores kollektion er den samme året
                rundt.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                Før vi sætter nye styles i produktion, inddrager vi vores kunder
                og nyhedsbrevets medlemmer, så vi kun producerer det, der er
                efterspørgsel på.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                Det minimerer spild og bidrager til en mere ansvarlig
                produktion.
              </p>
              <button className="border-b-2 border-black pb-1 text-sm md:text-base font-medium hover:border-gray-600 transition-colors">
                Læs mere
              </button>
            </div>
          </div>
        </div>
      </div>

      <RatingSlider />

      {/* Gift Card Popup */}
      {showPopup && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-in">
          <div className="bg-[#1c1c1c] text-white p-8 rounded-lg shadow-2xl max-w-sm relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <h3 className="text-2xl font-['EB_Garamond'] mb-4">
              Få 15% rabat!
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Tilmeld dig vores nyhedsbrev og modtag et gavekort på 15% til dit
              næste køb.
            </p>
            <div className="flex flex-col gap-3">
              {subscribeStatus === "success" ? (
                <p className="text-green-400 font-medium text-center">
                  Tak! Tjek din indbakke for dit gavekort.
                </p>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Din email adresse"
                    className="bg-transparent border border-gray-600 p-2 text-sm focus:outline-none focus:border-white transition-colors text-white"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={subscribeStatus === "loading"}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribeStatus === "loading"}
                    className="bg-[#f2f1f0] text-[#1c1c1c] font-semibold py-2 px-4 hover:bg-white transition-colors disabled:opacity-70"
                  >
                    {subscribeStatus === "loading"
                      ? "Tilmelder..."
                      : "Tilmeld nu"}
                  </button>
                  {subscribeStatus === "error" && (
                    <p className="text-red-500 text-xs">
                      Der skete en fejl. Prøv igen.
                    </p>
                  )}
                </>
              )}
            </div>
            <p className="text-[10px] text-gray-500 mt-4 text-center">
              Ved at tilmelde dig accepterer du vores privatlivspolitik.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
