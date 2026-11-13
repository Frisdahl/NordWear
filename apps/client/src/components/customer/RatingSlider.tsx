import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "swiper/css";

const reviews = [
  {
    text: "Fantastisk kvalitet og hurtig levering. Kan klart anbefales!",
    name: "Jens Jensen",
    date: "2023-10-26",
  },
  {
    text: "Super service og mega fede produkter! 10/10",
    name: "Peter Petersen",
    date: "2023-10-24",
  },
  {
    text: "Virkelig value for money. Kommer helt sikkert til at handle her igen.",
    name: "Camilla Christensen",
    date: "2023-10-23",
  },
  {
    text: "Jeg elsker mit nye tøj! Tusind tak!",
    name: "Mette Mikkelsen",
    date: "2023-10-21",
  },
  {
    text: "Meget tilfreds med købet. Hurtig levering og god kundeservice.",
    name: "Bo Bøgh",
    date: "2023-10-20",
  },
  {
    text: "Bedste tøj jeg har købt i lang tid. Kvaliteten er i top!",
    name: "Signe Sørensen",
    date: "2023-10-19",
  },
  {
    text: "Overraskende god kvalitet til prisen. Kan kun anbefales!",
    name: "Ida Iversen",
    date: "2023-10-17",
  },
  {
    text: "Elsker det! Præcis som beskrevet og billederne viste.",
    name: "Sofie Skov",
    date: "2023-10-15",
  },
  {
    text: "God og hurtig levering. Tøjet sidder perfekt.",
    name: "Mads Møller",
    date: "2023-10-14",
  },
  {
    text: "Fantastisk oplevelse fra start til slut. Topkarakter!",
    name: "Freja Frederiksen",
    date: "2023-10-13",
  },
  {
    text: "Virkelig lækkert stof og god pasform. Jeg er meget tilfreds.",
    name: "Laura Lund",
    date: "2023-10-11",
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const arrowClass =
  "flex size-8 items-center justify-center text-[#1c1c1c] transition-opacity duration-300 hover:opacity-60 disabled:pointer-events-none disabled:opacity-25";

const RatingSlider: React.FC = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = (s: SwiperType) => {
    setAtStart(s.isBeginning);
    setAtEnd(s.isEnd);
  };

  return (
    <section className="px-6 py-16 md:px-12 md:py-24">
      <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
        <div>
          <p className="mb-3 font-['figtree'] text-xs font-semibold uppercase tracking-[0.28em] text-[#1c1c1c]/50">
            Anmeldelser
          </p>
          <h2 className="font-garamond text-3xl leading-tight md:text-5xl">
            Det siger vores kunder
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className={arrowClass}
            onClick={() => swiper?.slidePrev()}
            disabled={atStart}
            aria-label="Forrige anmeldelser"
          >
            <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            className={arrowClass}
            onClick={() => swiper?.slideNext()}
            disabled={atEnd}
            aria-label="Næste anmeldelser"
          >
            <ChevronRightIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Autoplay]}
        onSwiper={(s: SwiperType) => {
          setSwiper(s);
          sync(s);
        }}
        onSlideChange={(s: SwiperType) => sync(s)}
        spaceBetween={16}
        slidesPerView={1.15}
        autoplay={{ delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }}
        breakpoints={{
          640: { slidesPerView: 2.1, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.name} className="!h-auto">
            <figure className="flex h-full flex-col justify-between border border-[#1c1c1c]/10 bg-white p-7 md:p-8">
              <div>
                <div
                  className="flex gap-0.5 text-[#b8935a]"
                  role="img"
                  aria-label="5 ud af 5 stjerner"
                >
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-5 font-garamond text-xl leading-snug md:text-2xl">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-baseline justify-between gap-4 border-t border-[#1c1c1c]/10 pt-4 text-sm">
                <span className="font-medium">{review.name}</span>
                <span className="text-xs text-[#1c1c1c]/50">
                  {formatDate(review.date)}
                </span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default RatingSlider;
