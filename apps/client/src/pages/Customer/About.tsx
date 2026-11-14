import React from "react";
import { Link } from "react-router-dom";
import ArrowIcon from "../../components/customer/ArrowIcon";
import nordwearHero from "../../assets/nordwear-hero.webp";
import productionImage from "../../assets/production.webp";
import overProductionImage from "../../assets/over-production.webp";

// Same eyebrow and link styles as the homepage and product page.
const eyebrowClass =
  "font-['figtree'] text-xs font-semibold uppercase tracking-[0.28em] text-[#1c1c1c]/50";
const textLinkClass =
  "group inline-flex items-center gap-2 border-b border-[#1c1c1c] pb-1 font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1c1c1c]";

const chapterLinks = [
  { number: "01", label: "Håndværket", href: "#handvaerket" },
  { number: "02", label: "Vejen til dig", href: "#vejen" },
  { number: "03", label: "Historien", href: "#historien" },
];

const captions = [
  "Designet i Danmark",
  "Håndlavet nær Porto, Portugal",
  "Tidløse designs, hele året",
];

const craft = {
  title: "Fra idé til virkelighed",
  paragraphs: [
    "For at sikre den kvalitet, vi selv efterspurgte, rejste vi til Portugal. Her fandt vi en fabrik nær Porto – beliggende i en region med stærke traditioner inden for læderhåndværk og skoproduktion.",
    "Området er kendt for sin kompromisløse tilgang til kvalitet, materialer og detaljer. Portugal er internationalt anerkendt for sin ekspertise inden for højkvalitets fodtøj, hvor tradition og innovation går hånd i hånd.",
    "På vores fabrik arbejder erfarne håndværkere med stor præcision og respekt for materialerne. Hvert produkt skabes med fokus på funktionalitet, æstetik og lang holdbarhed. Det var her, fundamentet for NordWear blev lagt. Resultatet blev vores første sneakers – produkter, der afspejler NordWears værdier, ambitioner og passion for gennemtænkt design og solidt håndværk.",
  ],
};

const path = {
  title: "Slut med overproduktion",
  paragraphs: [
    'Vores "Made for you" koncept bygger på slow fashion og handler om at undgå overproduktion og evige udsalg.',
    "Vi laver tidløse designs, så vores kollektion er den samme året rundt. Før vi sætter nye styles i produktion, inddrager vi vores kunder og nyhedsbrevets medlemmer, så vi kun producerer det, der er efterspørgsel på.",
  ],
};

const story = {
  title: "Historien bag brandet",
  paragraphs: [
    "NordWear startede som en lille idé om at gøre op med brug-og-smid-væk kulturen. Vi designer tøj, der er skabt til hverdagen, men med detaljer, der løfter det til noget særligt. Vores inspiration hentes i den nordiske natur og den minimalistiske designtradition, hvor hver linje har et formål, og intet er overflødigt.",
    "Vi arbejder tæt sammen med vores producenter for at sikre ordentlige forhold og materialer af højeste kvalitet. Det er ikke bare tøj; det er en fortælling om dedikation og passion for det gode produkt. Vi stræber efter transparens i hele vores værdikæde.",
    "Hver kollektion er resultatet af måneders udvikling, hvor vi tester pasform og materialer indtil vi er helt tilfredse. Det er denne dedikation til detaljen, der definerer NordWear.",
  ],
};

const values = [
  {
    title: "Et brand med mening",
    paragraphs: [
      "NordWear er mere end produkter. Det er et brand bygget på ønsket om at skabe tidløst design med en klar identitet og tydelige værdier – uafhængigt af kortvarige trends.",
      "Vi samarbejder med nøje udvalgte producenter og prioriterer langsigtede relationer. Ved at tage ansvar for vores produktion og arbejdsmetoder ønsker vi at bidrage til en mere bevidst tilgang til mode og forbrug.",
      "For os handler kvalitet ikke kun om det færdige produkt, men også om processen bag.",
    ],
  },
  {
    title: "Vi går egne veje",
    paragraphs: [
      "I en branche præget af masseproduktion og hurtigt forbrug har NordWear valgt en anden retning. Vi tror på, at det er muligt at skabe stilrene og funktionelle produkter, der er produceret med omtanke – uden at gå på kompromis med kvalitet eller udtryk.",
      "Derfor arbejder vi tæt sammen med vores leverandører og anvender udelukkende materialer, der lever op til vores krav om kvalitet og holdbarhed.",
      "Vores mål er at skabe produkter, der kan bruges igen og igen – med respekt for både mennesker, håndværk og omgivelser.",
    ],
  },
];

const Paragraphs: React.FC<{ items: string[]; className?: string }> = ({
  items,
  className = "",
}) => (
  <div
    className={`space-y-4 text-sm leading-relaxed text-[#1c1c1c]/75 md:text-lg ${className}`}
  >
    {items.map((text) => (
      <p key={text}>{text}</p>
    ))}
  </div>
);

const About: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#f2f1f0] text-[#1c1c1c]">
      {/* Intro: large statement, supporting line offset on the grid, chapter index */}
      <section className="px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-28">
        <div className="grid grid-cols-4 gap-x-6 md:grid-cols-8 md:gap-x-8 lg:grid-cols-12">
          <p className={`${eyebrowClass} col-span-4 mb-6 md:col-span-8 lg:col-span-12`}>
            Om NordWear
          </p>
          <h1 className="col-span-4 font-garamond text-[clamp(2rem,4.2vw,3.5rem)] font-medium leading-[1.1] tracking-tight [text-wrap:balance] md:col-span-8 lg:col-span-9">
            Forfinelse frem for forandring.
          </h1>
          <p className="col-span-4 mt-10 text-base leading-relaxed text-[#1c1c1c]/75 md:col-span-5 md:col-start-4 md:mt-10 md:text-lg lg:col-span-4 lg:col-start-8">
            Designet i Danmark og håndlavet i Portugal – tidløse produkter til
            dig, der vælger kvalitet frem for kvantitet.
          </p>
        </div>

        <nav
          aria-label="Om os"
          className="mt-16 grid grid-cols-1 border-t border-[#1c1c1c]/20 md:mt-24 md:grid-cols-3"
        >
          {chapterLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-baseline gap-4 border-b border-[#1c1c1c]/20 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1c1c1c] md:border-b-0 md:py-6"
            >
              <span className={`${eyebrowClass} w-8 shrink-0`}>{link.number}</span>
              <span className="font-garamond text-2xl md:text-3xl">
                {link.label}
              </span>
              <ArrowIcon
                direction="down"
                className="self-center transition-transform duration-300 group-hover:translate-y-1"
              />
            </a>
          ))}
        </nav>
      </section>

      {/* Full-bleed image with a caption row */}
      <section>
        <div className="h-[420px] w-full overflow-hidden md:h-[720px]">
          <img
            src={nordwearHero}
            alt="Mand i hættetrøje og hvide NordWear sneakers"
            className="block h-full w-full object-cover object-[68%_center] lg:object-center"
          />
        </div>
        <ul className="grid grid-cols-1 gap-2 px-6 py-6 text-sm text-[#1c1c1c]/70 md:grid-cols-3 md:px-12 md:py-8">
          {captions.map((caption, i) => (
            <li
              key={caption}
              className={i === 1 ? "md:text-center" : i === 2 ? "md:text-right" : ""}
            >
              {caption}
            </li>
          ))}
        </ul>
      </section>

      {/* Founder quote */}
      <section className="w-full bg-[#171616] px-6 py-16 text-center md:py-28">
        <p className="mb-6 font-['figtree'] text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
          Grundlagt af Alexander Frisdahl
        </p>
        <blockquote className="mx-auto max-w-4xl font-garamond text-2xl leading-snug text-white [text-wrap:balance] md:text-4xl md:leading-[1.25]">
          &ldquo;Vores vision er at skabe tidløst design, hvor æstetik og
          funktionalitet går hånd i hånd. Med fokus på godt håndværk skaber vi
          produkter, der holder &ndash; og som man har lyst til at bruge igen og
          igen.&rdquo;
        </blockquote>
      </section>

      {/* 01 Craft: image left, text right */}
      <section
        id="handvaerket"
        className="grid scroll-mt-24 grid-cols-1 items-stretch lg:grid-cols-2"
      >
        <div className="h-[420px] overflow-hidden md:h-[560px] lg:h-auto lg:min-h-[760px]">
          <img
            src={productionImage}
            alt="Håndlavet sneaker i produktion"
            loading="lazy"
            className="block h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center bg-white px-6 py-14 md:px-12 md:py-20 lg:px-16 lg:py-24 xl:px-24">
          <div className="max-w-xl">
            <p className={`${eyebrowClass} mb-5`}>01 &middot; Håndværket</p>
            <h2 className="mb-6 font-garamond text-3xl leading-tight md:text-5xl">
              {craft.title}
            </h2>
            <Paragraphs items={craft.paragraphs} />
          </div>
        </div>
      </section>

      {/* 02 Path to you: text left, image right */}
      <section
        id="vejen"
        className="grid scroll-mt-24 grid-cols-1 items-stretch lg:grid-cols-2"
      >
        <div className="order-2 flex items-center px-6 py-14 md:px-12 md:py-20 lg:order-1 lg:px-16 lg:py-24 xl:px-24">
          <div className="max-w-xl">
            <p className={`${eyebrowClass} mb-5`}>02 &middot; Vejen til dig</p>
            <h2 className="mb-6 font-garamond text-3xl leading-tight md:text-5xl">
              {path.title}
            </h2>
            <Paragraphs items={path.paragraphs} />
            <Link
              to="/category"
              className={`${textLinkClass} mt-8`}
            >
              Se udvalget
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <div className="order-1 h-[420px] overflow-hidden md:h-[560px] lg:order-2 lg:h-auto lg:min-h-[760px]">
          <img
            src={overProductionImage}
            alt="Hvide NordWear sneakers"
            loading="lazy"
            className="block h-full w-full object-cover"
          />
        </div>
      </section>

      {/* 03 Story: heading left, text right on the 12-column grid */}
      <section
        id="historien"
        className="scroll-mt-24 px-6 py-16 md:px-12 md:py-28"
      >
        <div className="grid grid-cols-4 gap-x-6 border-t border-[#1c1c1c]/20 pt-10 md:grid-cols-8 md:gap-x-8 md:pt-12 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <p className={`${eyebrowClass} mb-5`}>03 &middot; Historien</p>
            <h2 className="font-garamond text-3xl leading-tight [text-wrap:balance] md:text-5xl">
              {story.title}
            </h2>
          </div>
          <Paragraphs
            items={story.paragraphs}
            className="col-span-4 mt-8 md:col-span-6 md:col-start-3 md:mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0"
          />
        </div>
      </section>

      {/* Values */}
      <section className="px-6 pb-16 md:px-12 md:pb-28">
        <p className={`${eyebrowClass} mb-8`}>Vores værdier</p>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {values.map((value) => (
            <div key={value.title} className="border-t border-[#1c1c1c]/20 pt-6">
              <h3 className="mb-4 font-garamond text-3xl md:text-4xl">
                {value.title}
              </h3>
              <Paragraphs items={value.paragraphs} className="md:text-base" />
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 pb-16 md:px-12 md:pb-28">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-[#1c1c1c]/20 pt-10 md:flex-row md:items-end md:pt-12">
          <h2 className="font-garamond text-3xl leading-tight md:text-5xl">
            Udforsk kollektionerne
          </h2>
          <Link to="/category" className={textLinkClass}>
            Se udvalget
            <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
