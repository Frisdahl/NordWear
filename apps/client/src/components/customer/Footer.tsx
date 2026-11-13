import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { RiTiktokFill } from "react-icons/ri";

const helpLinks = [
  "Returret",
  "Retur",
  "Care Guide",
  "Ofte stillede spørgsmål",
  "Kontakt os",
];

const infoLinks = [
  "Om os",
  "Blog",
  "Julegaver 2025",
  "Handelsbetingelser",
  "Persondata- og cookiepolitik",
  "Servicevilkår",
];

const socials = [
  { name: "Instagram", Icon: IoLogoInstagram },
  { name: "TikTok", Icon: RiTiktokFill },
  { name: "Facebook", Icon: FaFacebookF },
];

const headingClass =
  "mb-5 font-['figtree'] text-xs font-semibold uppercase tracking-[0.24em] text-white/50";

const linkClass =
  "group/link relative inline-block text-sm text-white/80 transition-colors duration-300 hover:text-white";

const Underline = () => (
  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-in-out group-hover/link:scale-x-100" />
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171616] px-6 pb-8 pt-16 text-white md:px-12 md:pt-24">
      {/* Top: brand and newsletter */}
      <div className="grid grid-cols-1 gap-12 pb-14 md:grid-cols-2 md:gap-20 md:pb-20">
        <div>
          <p className="font-garamond text-4xl tracking-[0.08em] md:text-5xl">
            NORDWEAR
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
            Vi forener et tidløst, stilrent udtryk med høj kvalitet og komfort
            til en fair pris. Ved at fjerne dyre mellemled og sælge direkte til
            dig, kan vi tilbyde bedre materialer og solidt håndværk &ndash; uden
            at prisen stiger.
          </p>
        </div>

        <div className="md:justify-self-end md:w-full md:max-w-md">
          <h3 className="font-garamond text-2xl md:text-3xl">
            Tilmeld vores nyhedsbrev
          </h3>
          <p className="mt-3 text-sm text-white/70">
            Bliv holdt opdateret på kampagner, konkurrencer og
            produktlanceringer.
          </p>
          <form className="mt-6 flex items-end gap-4 border-b border-white/40 pb-3 transition-colors duration-300 focus-within:border-white">
            <input
              type="email"
              placeholder="Din email"
              aria-label="Din email"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              className="font-['Montserrat'] text-xs font-semibold uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-70"
            >
              Abonnér &rarr;
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-t border-white/15 py-12 md:grid-cols-4 md:gap-12 md:py-16">
        <div>
          <h3 className={headingClass}>Kundeservice</h3>
          <div className="space-y-2 text-sm text-white/80">
            <p>Man-Fre: kl. 10.00-15.00</p>
            <p>kundeservice@nordwear.dk</p>
            <p>+45 43 43 43 43</p>
          </div>
        </div>

        <div>
          <h3 className={headingClass}>Hjælp</h3>
          <ul className="space-y-3">
            {helpLinks.map((label) => (
              <li key={label}>
                <Link to="#" className={linkClass}>
                  {label}
                  <Underline />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Information</h3>
          <ul className="space-y-3">
            {infoLinks.map((label) => (
              <li key={label}>
                <Link to="#" className={linkClass}>
                  {label}
                  <Underline />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Følg med</h3>
          <ul className="space-y-3">
            {socials.map(({ name }) => (
              <li key={name}>
                <a href="#" className={linkClass}>
                  {name}
                  <Underline />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center">
        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} NORDWEAR. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-xl text-white/80">
          {socials.map(({ name, Icon }) => (
            <a
              key={name}
              href="#"
              aria-label={name}
              className="transition-opacity duration-300 hover:opacity-60"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
