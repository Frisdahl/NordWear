import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { StarIcon } from "@heroicons/react/24/solid";
import "swiper/css";
import "swiper/css/navigation";

const reviews = [
  {
    stars: 5,
    text: "Fantastisk kvalitet og hurtig levering. Kan klart anbefales!",
    name: "Jens Jensen",
    date: "2023-10-26",
  },
  {
    stars: 4,
    text: "God pasform og lækkert materiale. Lidt lille i størrelsen.",
    name: "Hanne Hansen",
    date: "2023-10-25",
  },
  {
    stars: 5,
    text: "Super service og mega fede produkter! 10/10",
    name: "Peter Petersen",
    date: "2023-10-24",
  },
  {
    stars: 5,
    text: "Virkelig value for money. Kommer helt sikkert til at handle her igen.",
    name: "Camilla Christensen",
    date: "2023-10-23",
  },
  {
    stars: 3,
    text: "Helt ok, men ikke noget specielt.",
    name: "Lars Larsen",
    date: "2023-10-22",
  },
  {
    stars: 5,
    text: "Jeg elsker mit nye tøj! Tusind tak!",
    name: "Mette Mikkelsen",
    date: "2023-10-21",
  },
  {
    stars: 4,
    text: "Meget tilfreds med købet. Hurtig levering og god kundeservice.",
    name: "Bo Bøgh",
    date: "2023-10-20",
  },
  {
    stars: 5,
    text: "Bedste tøj jeg har købt i lang tid. Kvaliteten er i top!",
    name: "Signe Sørensen",
    date: "2023-10-19",
  },
  {
    stars: 4,
    text: "Fint tøj, men farven var lidt anderledes end forventet.",
    name: "Mikkel Madsen",
    date: "2023-10-18",
  },
  {
    stars: 5,
    text: "Overraskende god kvalitet til prisen. Kan kun anbefales!",
    name: "Ida Iversen",
    date: "2023-10-17",
  },
  {
    stars: 3,
    text: "Gennemsnitligt. Ikke dårligt, men heller ikke fantastisk.",
    name: "Rasmus Rasmussen",
    date: "2023-10-16",
  },
  {
    stars: 5,
    text: "Elsker det! Præcis som beskrevet og billederne viste.",
    name: "Sofie Skov",
    date: "2023-10-15",
  },
  {
    stars: 4,
    text: "God og hurtig levering. Tøjet sidder godt.",
    name: "Mads Møller",
    date: "2023-10-14",
  },
  {
    stars: 5,
    text: "Fantastisk oplevelse fra start til slut. Topkarakter!",
    name: "Freja Frederiksen",
    date: "2023-10-13",
  },
  {
    stars: 4,
    text: "Ville ønske der var flere farver at vælge imellem, men ellers super.",
    name: "Emil Eriksen",
    date: "2023-10-12",
  },
  {
    stars: 5,
    text: "Virkelig lækkert stof og god pasform. Jeg er meget tilfreds.",
    name: "Laura Lund",
    date: "2023-10-11",
  },
];

const mobileReviews = reviews.map((review) => ({ ...review, stars: 5 }));

const RatingSlider: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const displayedReviews = isMobile ? mobileReviews : reviews;

  return (
    <div className="bg-[#1c1c1c] py-12">
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #fbbf24 !important;
          width: 30px !important;
          height: 30px !important;
          top: 50% !important; /* Center vertically */
          transform: translateY(-50%) !important; /* Adjust for height */
        }
        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 1.5rem !important;
        }
        .swiper-button-prev {
            left: 0px !important; /* Adjust based on container padding */
        }
        .swiper-button-next {
            right: 0px !important; /* Adjust based on container padding */
        }
        @media (max-width: 767px) {
          .swiper-button-next, .swiper-button-prev {
            font-size: 1rem !important; /* Even smaller size for mobile */
            width: 25px !important;
            height: 25px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
          }
        }
      `}</style>
      <div className="container mx-auto relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          className="mt-8"
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
        >
          {displayedReviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="text-white p-6 text-center">
                <div className="flex justify-center">
                  {[...Array(review.stars)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="font-bold my-4">{review.text}</p>
                <p>{review.name}</p>
                <p className="text-sm text-gray-400">{review.date}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
    </div>
  );
};

export default RatingSlider;
