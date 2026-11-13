import React, { useEffect, useState, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { EmblaOptionsType } from "embla-carousel";
import RatingSlider from "../../components/customer/RatingSlider";
import EmblaCarousel, { CollectionItem } from "../../components/customer/carousel/EmblaCarousel";
import nordwearHero from "../../assets/nordwear-hero.webp";
import productionImage from "../../assets/production.webp";
import overProductionImage from "../../assets/over-production.webp";
import loafersImage from "../../assets/loafers.webp";
import dressShoesImage from "../../assets/dress-shoes.webp";
import bootsImage from "../../assets/boots.webp";
import accessoriesImage from "../../assets/accessories.webp";
import sneakersImage from "../../assets/sneakers-studio.webp";

// Collections shown under "Udforsk kollektionerne".
const collections: CollectionItem[] = [
  { name: "Sneakers", imageUrl: sneakersImage, to: "/category/sneakers" },
  { name: "Loafers", imageUrl: loafersImage, to: "/category/loafers" },
  { name: "Dress shoes", imageUrl: dressShoesImage, to: "/category/dress-shoes" },
  { name: "Boots", imageUrl: bootsImage, to: "/category/boots" },
  { name: "Accessories", imageUrl: accessoriesImage, to: "/category/accessories" },
];

const OPTIONS: EmblaOptionsType = {
  align: "start",
  dragFree: true,
  containScroll: "trimSnaps",
};

const Home: React.FC = () => {
  const { headerHeight } = (useOutletContext<{ headerHeight?: number }>() ?? {}) as { headerHeight?: number };
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
        },
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

  return (
    <div className="text-[#1c1c1c] overflow-x-hidden w-full">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center text-center text-white bg-[#1c1c1c] min-h-[480px] pt-24 lg:pt-36"
        style={{ height: headerHeight ? `calc(100svh - ${headerHeight}px)` : "90svh" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-[position:68%_center] lg:bg-center"
          style={{ backgroundImage: `url(${nordwearHero})` }}
        ></div>
        <div className="absolute inset-0 bg-black/45"></div>

        <div className="relative z-10 px-6 flex flex-col items-center">
          <h1 className="font-garamond font-medium text-white text-[clamp(1.25rem,5.6vw,68px)] leading-[1.05] tracking-tight whitespace-nowrap">
            Everyday essentials. Timeless style.
          </h1>
          <p className="mt-5 text-base lg:text-lg font-figtree text-white/90">
            Designed in Denmark. Crafted in Portugal.
          </p>
          <Link
            to="/category"
            className="mt-8 lg:mt-10 border border-white text-white text-sm rounded-none py-3.5 font-medium font-['Montserrat'] px-8 transition-colors uppercase tracking-wide hover:bg-white hover:text-[#000101]"
          >
            Se udvalget
          </Link>
        </div>
      </section>

      {/* Collections: heading left (aligned with the header), arrows right */}
      <section className="pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="px-6 md:px-12">
          <EmblaCarousel
            items={collections}
            options={OPTIONS}
            header={
              <h2 className="font-garamond text-3xl leading-tight md:text-5xl">
                Udforsk kollektionerne
              </h2>
            }
          />
        </div>
      </section>

      {/* Design Showcase 1 */}
      <section className="grid grid-cols-1 items-stretch md:grid-cols-2">
        <div className="h-[420px] overflow-hidden md:h-[760px]">
          <img
            src={productionImage}
            alt="Håndlavet sneaker i produktion"
            className="block h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center bg-white px-6 py-14 md:px-16 lg:px-24">
          <div className="max-w-xl">
            <p className="mb-5 font-['figtree'] text-xs font-semibold uppercase tracking-[0.28em] text-[#1c1c1c]/50">
              Håndlavet i Portugal
            </p>
            <h2 className="mb-6 font-garamond text-3xl leading-tight md:text-5xl">
              Dansk design med omtanke
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-[#1c1c1c]/75 md:text-lg">
              Vi laver ikke hurtig mode. Vi laver produkter, der forener
              skandinavisk enkelhed, raffineret æstetik og kompromisløs
              komfort. Altid i nøje udvalgte materialer &ndash; valgt for deres
              kvalitet, skønhed og følelse.
            </p>
            <button className="group inline-flex items-center gap-2 border-b border-[#1c1c1c] pb-1 font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.18em]">
              Læs mere
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-28">
        <p className="mb-6 font-['figtree'] text-xs font-semibold uppercase tracking-[0.28em] text-[#1c1c1c]/50">
          Vores overbevisning
        </p>
        <h2 className="font-garamond text-2xl leading-snug md:text-4xl md:leading-[1.25]">
          Hos NordWear tror vi på forfinelse frem for forandring &ndash; tidløst
          design, kvalitet og bæredygtighed.
        </h2>
      </section>

      {/* Overproduction Section */}
      <section className="grid grid-cols-1 items-stretch md:grid-cols-2">
        <div className="h-[420px] overflow-hidden md:h-[760px]">
          <img
            src={overProductionImage}
            alt="Hvide NordWear sneakers"
            className="block h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center px-6 py-14 md:px-16 lg:px-24">
          <div className="max-w-xl">
            <p className="mb-5 font-['figtree'] text-xs font-semibold uppercase tracking-[0.28em] text-[#1c1c1c]/50">
              Made for you
            </p>
            <h2 className="mb-6 font-garamond text-3xl leading-tight md:text-5xl">
              Slut med overproduktion
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[#1c1c1c]/75 md:text-lg">
              <p>
                Vores &quot;Made for you&quot; koncept bygger på slow fashion og
                handler om at undgå overproduktion og evige udsalg.
              </p>
              <p>
                Vi laver tidløse designs, så vores kollektion er den samme året
                rundt. Før vi sætter nye styles i produktion, inddrager vi vores
                kunder og nyhedsbrevets medlemmer, så vi kun producerer det, der
                er efterspørgsel på.
              </p>
            </div>
            <button className="group mt-8 inline-flex items-center gap-2 border-b border-[#1c1c1c] pb-1 font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.18em]">
              Læs mere
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          </div>
        </div>
      </section>

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
            <h3 className="text-xl md:text-2xl font-garamond mb-4">
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
