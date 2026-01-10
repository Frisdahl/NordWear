import React from "react";

const aboutUsText = [
  {
    title: "Fra idé til virkelighed",
    content:
      "For at sikre den kvalitet, vi selv efterspurgte, rejste vi til Portugal. Her fandt vi en fabrik nær Porto – beliggende i en region med stærke traditioner inden for læderhåndværk og skoproduktion.\n\nOmrådet er kendt for sin kompromisløse tilgang til kvalitet, materialer og detaljer. Portugal er internationalt anerkendt for sin ekspertise inden for højkvalitets fodtøj, hvor tradition og innovation går hånd i hånd.\n\nPå vores fabrik arbejder erfarne håndværkere med stor præcision og respekt for materialerne. Hvert produkt skabes med fokus på funktionalitet, æstetik og lang holdbarhed. Det var her, fundamentet for NordWear blev lagt. Resultatet blev vores første sneakers – produkter, der afspejler NordWears værdier, ambitioner og passion for gennemtænkt design og solidt håndværk.",
  },
  {
    title: "Et brand med mening",
    content:
      "NordWear er mere end produkter. Det er et brand bygget på ønsket om at skabe tidløst design med en klar identitet og tydelige værdier – uafhængigt af kortvarige trends.\n\nVi samarbejder med nøje udvalgte producenter og prioriterer langsigtede relationer. Ved at tage ansvar for vores produktion og arbejdsmetoder ønsker vi at bidrage til en mere bevidst tilgang til mode og forbrug.\n\nFor os handler kvalitet ikke kun om det færdige produkt, men også om processen bag.",
  },
  {
    title: "Vi går egne veje",
    content:
      "I en branche præget af masseproduktion og hurtigt forbrug har NordWear valgt en anden retning. Vi tror på, at det er muligt at skabe stilrene og funktionelle produkter, der er produceret med omtanke – uden at gå på kompromis med kvalitet eller udtryk.\n\nDerfor arbejder vi tæt sammen med vores leverandører og anvender udelukkende materialer, der lever op til vores krav om kvalitet og holdbarhed.\n\nVores mål er at skabe produkter, der kan bruges igen og igen – med respekt for både mennesker, håndværk og omgivelser.",
  },
];

const About: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="py-16 text-center bg-white">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-black">
          Om os
        </h1>
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
      <div className="bg-[#181c2e] text-white py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">
            Grundlagt af Alexander Frisdahl
          </h2>
          <p className="text-lg md:text-2xl leading-relaxed opacity-90 font-light">
            "Vores vision er at skabe tidløst design, hvor æstetik og
            funktionalitet går hånd i hånd. Med fokus på godt håndværk skaber vi
            produkter, der holder – og som man har lyst til at bruge igen og
            igen."
          </p>
        </div>
      </div>

      {/* Brand Section (Image flush Left, Text Right) */}
      <div id="historien" className="w-full scroll-mt-20 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image Container: Starts from left edge, ends at center on large screens */}
          <div className="w-full md:w-1/2 h-[500px] md:h-[700px] relative">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="NordWear Minimalist Clothing"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Container: Padded to align with content grid */}
          <div className="w-full md:w-1/2 p-12 md:p-24 lg:pr-32 xl:pr-48">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-8">
                Historien bag brandet
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-light">
                <p>
                  NordWear startede som en lille idé om at gøre op med
                  brug-og-smid-væk kulturen. Vi designer tøj, der er skabt til
                  hverdagen, men med detaljer, der løfter det til noget særligt.
                  Vores inspiration hentes i den nordiske natur og den
                  minimalistiske designtradition, hvor hver linje har et formål,
                  og intet er overflødigt.
                </p>
                <p>
                  Vi arbejder tæt sammen med vores producenter for at sikre
                  ordentlige forhold og materialer af højeste kvalitet. Det er
                  ikke bare tøj; det er en fortælling om dedikation og passion
                  for det gode produkt. Vi stræber efter transparens i hele
                  vores værdikæde.
                </p>
                <p>
                  Hver kollektion er resultatet af måneders udvikling, hvor vi
                  tester pasform og materialer indtil vi er helt tilfredse. Det
                  er denne dedikation til detaljen, der definerer NordWear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Points Section */}
      <section className="px-6 md:px-12 py-16 border-y border-[#00000026] bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {aboutUsText.map((point) => (
            <div key={point.title}>
              <h3 className="text-2xl md:text-3xl text-gray-800 mb-4 font-['EB_Garamond']">
                {point.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {point.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
