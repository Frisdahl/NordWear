import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { RiTiktokFill } from "react-icons/ri";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f2f1f0] text-[#1c1c1c] py-12 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-[1fr_.65fr_.75fr_.75fr] gap-12">
        {/* Column 1: Logo, about, contact, social */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">NORDWEAR</h2>
          <p className="text-[1rem]">
            Vi forener et tidløst, stilrent udtryk med høj kvalitet og komfort
            til en fair pris. Ved at fjerne dyre mellemled og sælge direkte til
            dig, kan vi tilbyde bedre materialer og solidt håndværk – uden at
            prisen stiger.
          </p>
          <div>
            <h3 className="font-semibold">Kundeservice</h3>
            <p className="text-[1rem]">Man-Fre: kl. 10.00-15.00</p>
            <p className="text-[1rem] mt-2">
              <span className="font-semibold">Mail:</span>{" "}
              kundeservice@nordwear.dk
            </p>
            <p className="text-[1rem]">
              <span className="font-semibold">Telefon:</span> +45 43 43 43 43
            </p>
          </div>

          <div className="flex space-x-4 pt-6 text-2xl">
            <a href="#" className="group/link relative">
              <FaFacebookF />
            </a>
            <a href="#" className="group/link relative">
              <IoLogoInstagram />
            </a>
            <a href="#" className="group/link relative">
              <RiTiktokFill />
            </a>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} NORDWEAR. All rights reserved.
          </p>
        </div>

        {/* Column 2: Customer Service */}
        <div className="space-y-4">
          <h3 className="font-semibold">Kundeservice</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" className="group/link relative">
                Returret
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Julegaver 2025
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Blog
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Om os
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Kontakt os
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Retur
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Care Guide
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Ofte stillede spørgsmål
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Handelsbetingelser
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Persondata- og cookiepolitik
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
            <li>
              <Link to="#" className="group/link relative">
                Servicevilkår
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div className="space-y-4">
          <h3 className="font-semibold">Tilmeld vores nyhedsbrev</h3>
          <p className="text-sm">
            Tilmeld dig nyhedsbrevet og bliv holdt opdateret på kampagner,
            konkurrencer og produktlanceringer.
          </p>
          <form>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Din email"
                className="p-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="bg-[#1c1c1c] text-white p-2 font-semibold rounded-md"
              >
                Abonnér
              </button>
            </div>
          </form>
        </div>

        {/* Column 4: Follow Us */}
        <div className="space-y-4">
          <h3 className="font-semibold">Følg med</h3>
          <p className="text-sm">Du kan følge med på vores sociale medier</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="group/link relative">
                Instagram
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </a>
            </li>
            <li>
              <a href="#" className="group/link relative">
                TikTok
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </a>
            </li>
            <li>
              <a href="#" className="group/link relative">
                Facebook
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
