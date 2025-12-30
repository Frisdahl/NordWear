import React from "react";

const About: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="py-16 text-center bg-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-black">Om os</h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm uppercase tracking-widest text-[#1c1c1c] font-medium">
          <a href="#handvaerket" className="group/link relative pb-1">
            Håndværket
            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
          </a>
          <a href="#vejen" className="group/link relative pb-1">
            Vejen til dig
            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
          </a>
          <a href="#historien" className="group/link relative pb-1">
            Historien
            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
          </a>
        </div>
      </div>

      {/* Blue Banner Section */}
      <div className="bg-nwBlue text-white py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Grundlagt af Alexander Frisdahl</h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-90 font-light">
            "Vores vision er at skabe tidløst design, der forener æstetik og funktionalitet. 
            Vi tror på, at det gode håndværk er fundamentet for produkter, der ikke bare holder, 
            men som man får lyst til at bruge igen og igen. Hos NordWear handler det om 
            at skabe en garderobe, der afspejler kvalitet og bevidste valg."
          </p>
        </div>
      </div>

      {/* Brand Section (Image flush Left, Text Right) */}
      <div id="historien" className="w-full py-24 scroll-mt-20 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image Container: Starts from left edge, ends at center on large screens */}
          <div className="w-full md:w-1/2 h-[500px] md:h-[700px] relative">
            <img 
              src="https://images.unsplash.com/photo-1594932224010-74f43a183546?q=80&w=2080&auto=format&fit=crop" 
              alt="NordWear Minimalist Clothing" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Text Container: Padded to align with content grid */}
          <div className="w-full md:w-1/2 p-12 md:p-24 lg:pr-32 xl:pr-48">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-8">Historien bag brandet</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-light">
                <p>
                  NordWear startede som en lille idé om at gøre op med brug-og-smid-væk kulturen. 
                  Vi designer tøj, der er skabt til hverdagen, men med detaljer, der løfter det til noget særligt.
                  Vores inspiration hentes i den nordiske natur og den minimalistiske designtradition, 
                  hvor hver linje har et formål, og intet er overflødigt.
                </p>
                <p>
                  Vi arbejder tæt sammen med vores producenter for at sikre ordentlige forhold og materialer 
                  af højeste kvalitet. Det er ikke bare tøj; det er en fortælling om dedikation og passion 
                  for det gode produkt. Vi stræber efter transparens i hele vores værdikæde.
                </p>
                <p>
                  Hver kollektion er resultatet af måneders udvikling, hvor vi tester pasform og materialer 
                  indtil vi er helt tilfredse. Det er denne dedikation til detaljen, der definerer NordWear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Columns Section */}
      <div className="bg-[#f9f9f9] py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Column 1 */}
            <div
              id="handvaerket"
              className="text-center md:text-left space-y-4 scroll-mt-24"
            >
              <h3 className="text-2xl font-serif text-black">Håndværket</h3>
              <p className="text-gray-600 leading-relaxed">
                Vi går aldrig på kompromis med kvaliteten. Fra valget af tråd
                til den endelige syning, sikrer vi, at hvert stykke tøj lever op
                til vores høje standarder. Det betyder produkter, der holder
                form og farve vask efter vask, år efter år. Vi tror på slow
                fashion principperne.
              </p>
            </div>

            {/* Column 2 */}
            <div
              id="vejen"
              className="text-center md:text-left space-y-4 scroll-mt-24"
            >
              <h3 className="text-2xl font-serif text-black">Vejen til dig</h3>
              <p className="text-gray-600 leading-relaxed">
                Vi har skåret de fordyrende mellemled fra for at kunne tilbyde
                den bedste kvalitet til en fair pris. Vores produkter rejser
                direkte fra fabrikken til vores lager, og videre hjem til dig.
                Dette sikrer ikke kun en bedre pris, men også en tættere kontakt
                med produktet.
              </p>
            </div>

            {/* Column 3 */}
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-2xl font-serif text-black">Designet</h3>
              <p className="text-gray-600 leading-relaxed">
                Enkelt, funktionelt og smukt. Vores designfilosofi bygger på de
                klassiske nordiske dyder. Vi skaber tøj, der kan styles på
                utallige måder, og som passer ind i enhver moderne garderobe,
                uanset sæson. Vi designer favoritter, du rækker ud efter hver
                dag.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
