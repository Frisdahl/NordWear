import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { EmblaOptionsType } from "embla-carousel";
import { Product } from "../../types";
import { fetchProducts } from "../../services/api";
import Notification from "../../components/Notification";
import RatingSlider from "../../components/customer/RatingSlider";
import CategoryCard from "../../components/customer/CategoryCard";
import EmblaCarousel from "../../components/customer/carousel/EmblaCarousel";

const categories = [
  {
    name: "Jakker",
    imageUrl:
      "https://images.unsplash.com/photo-1562009578-0eb8ea8a26ce?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Sneakers",
    imageUrl:
      "https://images.unsplash.com/photo-1598603784143-1b58f6d79c78?q=80&w=1526&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Hættetrøjer",
    imageUrl:
      "https://images.unsplash.com/photo-1523124006244-a37848c6002c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Skjorter",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661627681947-4431c8c97659?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const OPTIONS: EmblaOptionsType = {
  align: "start",
  dragFree: true,
  containScroll: "trimSnaps",
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    heading: "",
    subtext: "",
    type: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

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
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ email: emailInput }),
        }
      );
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

  useEffect(() => {
    const loadProducts = async () => {
      // 1. Check sessionStorage first
      const cachedProducts = sessionStorage.getItem("homepageProducts");
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
        setLoading(false);
        return; // Exit if we found cached data
      }

      // 2. If no cache, fetch from API
      try {
        const fetchedProducts = await fetchProducts(undefined, undefined, 12);
        if (Array.isArray(fetchedProducts)) {
            setProducts(fetchedProducts);
            // 3. Save to sessionStorage for next time
            sessionStorage.setItem("homepageProducts", JSON.stringify(fetchedProducts));
        }
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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

  return (
    <div className="text-[#1c1c1c] overflow-x-hidden w-full">
      {notification.subtext && (
        <Notification
          show={!!notification.subtext}
          heading={notification.heading}
          subtext={notification.subtext}
          type={notification.type as "success" | "error"}
          onClose={() =>
            setNotification({ heading: "", subtext: "", type: "" })
          }
        />
      )}

      {/* Hero Section */}
      <section className="h-[600px] md:h-[90svh] bg-gray-800 flex items-end text-white relative -mt-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1577686330226-d71f1d510d9c?q=80&w=2076&auto=format&fit=crop&ixlib.rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            filter: "brightness(0.6)",
          }}
        ></div>
        <div className="text-center z-10 px-6 pb-12 md:pb-16 w-full">
          <h1 className="text-3xl md:text-5xl text-[#f2f1f0] font-normal font-['EB-Garamond'] tracking-tighter mb-4">
            Tidløst design. Skabt til at holde.
          </h1>
          <p className="text-base md:text-xl text-gray-200 font-['figtree'] mb-8 max-w-lg mx-auto">
            Stilrene produkter med kompromisløs kvalitet – inspireret af naturen
            og bygget til hverdagen.
          </p>
          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/category"
              className="bg-[#181c2e] text-white rounded-full py-3 font-semibold px-8 transition-transform transform hover:bg-[#f2f1f0] hover:text-[#1c1c1c] hover:scale-105"
            >
              Se alle produkter
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 relative">
        <div className="mx-auto">
          <h2 className="text-3xl md:text-4xl font-['EB_Garamond'] text-center mb-8 md:mb-12">
            Udvalgte produkter
          </h2>
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="relative px-6 md:px-12">
              <EmblaCarousel
                products={products}
                options={OPTIONS}
                onNotify={handleNotification}
              />
            </div>
          )}
          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/category"
              className="bg-[#181c2e] rounded-full text-white py-3 font-semibold px-8 border border-[#1c1c1c] transition-colors transition-transform duration-500 ease-out transform hover:bg-transparent hover:text-[#1c1c1c] hover:scale-105"
            >
              Se alle
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-24 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 px-6 md:px-12">
        {categories.map((category) => (
          <Link
            to={`/category/${category.name.toLowerCase()}`}
            key={category.name}
          >
            <CategoryCard name={category.name} imageUrl={category.imageUrl} />
          </Link>
        ))}
      </section>

      {/* Design Showcase 1 */}
      <div className="relative border-y border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
          <div className="h-[600px] md:h-[900px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1603787081207-362bcef7c144?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Design"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="relative px-6 py-12 md:py-0 md:pr-12 md:ml-[-64px] z-10">
            <div className="bg-white text-center py-12 px-6 md:py-16 md:px-12 shadow-lg relative">
              <h1 className="text-2xl md:text-4xl font-['EB_Garamond'] mb-6">
                Dansk design - Håndlavet i Portugal
              </h1>
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-8">
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

      <h1 className="text-2xl md:text-[2.625rem] text-center mt-14 px-6 font-['EB_Garamond'] mb-6 leading-tight">
        Hos NordWear tror vi på forfinelse frem for forandring -{" "}
        <br className="hidden md:block"></br> tidløst design, kvalitet og
        bæredygtighed.
      </h1>
      <div className="flex justify-center mb-14"></div>

      {/* Overproduction Section */}
      <div className="border-y border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="h-[600px] md:h-[900px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Design"
              className="w-full h-full object-cover block"
            />
          </div>
          <div className="px-6 py-12 md:py-8">
            <div className="max-w-xl">
              <h1 className="text-2xl md:text-4xl font-['EB_Garamond'] mb-6">
                Slut med overproduktion
              </h1>
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-6">
                Vores "Made for you" koncept bygger på slow fashion og handler
                om at undgå overproduktion og evige udsalg.
              </p>
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-6">
                Vi laver tidløse designs, så vores kollektion er den samme året
                rundt.
              </p>
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-6">
                Før vi sætter nye styles i produktion, inddrager vi vores kunder
                og nyhedsbrevets medlemmer, så vi kun producerer det, der er
                efterspørgsel på.
              </p>
              <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-6">
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
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-in max-w-[calc(100vw-4rem)]">
          <div className="bg-[#1c1c1c] text-white p-6 md:p-8 rounded-lg shadow-2xl max-w-sm relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <h3 className="text-xl md:text-2xl font-['EB_Garamond'] mb-4">
              Få 15% rabat!
            </h3>
            <p className="text-xs md:text-sm text-gray-300 mb-6">
              Tilmeld dig vores nyhedsbrev og modtag et gavekort på 15% til dit
              næste køb.
            </p>
            <div className="flex flex-col gap-3">
              {subscribeStatus === "success" ? (
                <p className="text-green-400 font-medium text-center text-sm">
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
                    className="bg-[#f2f1f0] text-[#1c1c1c] font-semibold py-2 px-4 hover:bg-white transition-colors disabled:opacity-70 text-sm"
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
