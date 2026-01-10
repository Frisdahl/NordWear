import React, { useEffect, useState, useRef } from "react";
import {
  useParams,
  Link,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { Product } from "../../types";
import { fetchProducts, searchProducts } from "../../services/api";
import FilterMenu from "../../components/customer/FilterMenu";
import ProductCard from "../../components/customer/ProductCard";
import ProductCardSkeleton from "../../components/customer/ProductCardSkeleton";
import Notification from "../../components/Notification";
import Dropdown from "../../components/Dropdown";
import oneColumnIcon from "../../assets/customer/1-column.svg";
import twoColumnIcon from "../../assets/customer/2-column.svg";
import threeColumnIcon from "../../assets/customer/3-column.svg";
import multipleColumnIcon from "../../assets/customer/multiple-columns.svg";

interface FilterOptions {
  priceRange: [number, number];
  categories: number[];
  sizes: number[];
}

interface OutletContextType {
  headerHeight: number;
}

const Category: React.FC = () => {
  const { headerHeight } = useOutletContext<OutletContextType>();
  const { categoryName: categorySlug } = useParams<{ categoryName: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    heading: "",
    subtext: "",
    type: "",
  });
  const [viewMode, setViewMode] = useState<string>(
    typeof window !== "undefined" && window.innerWidth >= 768
      ? "grid-3"
      : "grid-2"
  );
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [sortOption, setSortOption] = useState<string>("");
  const [isFilterSticky, setFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterOriginalTop, setFilterOriginalTop] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 18;

  const getCategoryInfo = (slug: string | undefined) => {
    if (searchQuery) {
      return [];
    }

    switch (slug) {
      case "sneakers":
        return [
          {
            title: "Nordiske Sneakers til Mænd",
            description:
              "Vores sneakers forener skandinavisk minimalisme med europæisk håndværkstradition. Hver sko er håndlavet i Portugal med fokus på at skabe det perfekte balance mellem stil, komfort og holdbarhed.  \n\n Det stilrene design passer til enhver garderobe - fra casual hverdagslook til mere formelle outfits.",
          },
          {
            title: "Kvalitets Sneakers til Enhver Lejlighed",
            description:
              "Oplev vores eksklusive kollektion af sneakers, der kombinerer tidløst skandinavisk design med førsteklasses europæisk håndværk. Hver sko er omhyggeligt fremstillet i Portugal for at sikre optimal komfort og holdbarhed. \n\n Uanset om du er på udkig efter et par til hverdagsbrug eller noget mere formelt, har vi sneakers, der passer perfekt til din stil.",
          },
          {
            title: "Stilrene Sneakers med Europæisk Håndværk",
            description:
              "Vores sneakers er skabt med en passion for skandinavisk design og europæisk kvalitet. Håndlavet i Portugal, tilbyder hver sko en unik kombination af komfort, holdbarhed og æstetik. \n\n Uanset om du ønsker et par til afslappede dage eller formelle begivenheder, finder du det perfekte match i vores kollektion.",
          },
        ];

      case "shirts":
        return [
          {
            title: "Kvalitets Skjorter til Enhver Stil",
            description:
              "Vores skjorter er designet med fokus på kvalitet og pasform. Uanset om du er til et klassisk eller moderne look, har vi en skjorte til dig. \n\n Alle vores skjorter er lavet af de bedste materialer for at sikre komfort hele dagen.",
          },
          {
            title: "Stilfulde Skjorter til Mænd",
            description:
              "Opdag vores eksklusive udvalg af skjorter, der kombinerer tidløst design med moderne trends. Hver skjorte er fremstillet af førsteklasses materialer for at sikre både komfort og holdbarhed. \n\n Uanset om du har brug for en skjorte til arbejde eller fritid, har vi det perfekte valg til dig.",
          },
          {
            title: "Til Enhver Lejlighed",
            description:
              "Vores skjorter er skabt med en passion for detaljer og kvalitet. Med et bredt udvalg af stilarter og farver, finder du nemt en skjorte, der passer til din personlige stil. \n\n Perfekt til både formelle og afslappede begivenheder, vores skjorter sikrer, at du altid ser skarp ud.",
          },
        ];

      case "hoodies":
        return [
          {
            title: "Komfortable Hættetrøjer",
            description:
              "Vores hættetrøjer er indbegrebet af afslappet stil og komfort. Designet til at holde dig varm og komfortabel, uden at gå på kompromis med udseendet. \n\n Lavet i bløde kvalitetsmaterialer der holder pasformen vask efter vask.",
          },
          {
            title: "Dansk Designet Streetwear",
            description:
              "Hver hoodie i vores kollektion er designet i Danmark med fokus på rene linjer og funktionalitet. Den perfekte balance mellem moderne streetwear og klassisk nordisk minimalisme. \n\n Brug den til hverdag, træning eller afslapning derhjemme.",
          },
          {
            title: "Kvalitet der Holder",
            description:
              "Vi bruger kun kraftige metervarer til vores hættetrøjer for at sikre en premium følelse. Detaljer som forstærkede sømme og kvalitets lynlåse er standard hos os. \n\n En hættetrøje fra NordWear er en investering i din basisgarderobe.",
          },
        ];

      case "jackets":
        return [
          {
            title: "Jakker til Alt Slags Vejr",
            description:
              "Vores jakker er skabt til at modstå det skiftende nordiske vejr. Fra lette overgangsjakker til varme vinterjakker - vi kombinerer tekniske materialer med stilrent design. \n\n Hold dig tør og varm med stil uanset årstiden.",
          },
          {
            title: "Tidløst Overtøj",
            description:
              "En god jakke skal kunne bruges sæson efter sæson. Derfor fokuserer vi på klassiske silhuetter og holdbare materialer, der ikke går af mode. \n\n Vores kollektion byder på alt fra elegante frakker til praktiske hverdagsjakker.",
          },
          {
            title: "Funktionalitet og Stil",
            description:
              "Vi mener ikke, man skal vælge mellem at se godt ud og være praktisk klædt på. Vores jakker har smarte detaljer som inderlommer, justerbare manchetter og vandafvisende overflader. \n\n Det perfekte valg til den moderne mand på farten.",
          },
        ];

      default:
        return [
          {
            title: categoryName
              ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
              : "Alle Produkter",
            description: categoryName
              ? `Udforsk vores udvalg af ${categoryName} i høj kvalitet. Designet i Danmark og produceret i Europa.`
              : "Udforsk vores store udvalg af produkter i høj kvalitet. Designet i Danmark og produceret i Europa.",
          },
        ];
    }
  };

  useEffect(() => {
    if (filterRef.current) {
      setFilterOriginalTop(filterRef.current.offsetTop);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > filterOriginalTop) {
        setFilterSticky(true);
      } else {
        setFilterSticky(false);
      }
    };

    if (filterOriginalTop > 0) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filterOriginalTop]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let fetchedProducts: Product[] = [];

        if (searchQuery) {
          fetchedProducts = await searchProducts(searchQuery);
        } else {
          fetchedProducts = await fetchProducts(
            categorySlug,
            filters,
            undefined,
            sortOption
          );
        }

        const productArray = Array.isArray(fetchedProducts)
          ? fetchedProducts
          : [];
        setProducts(productArray);
        setTotalPages(Math.ceil(productArray.length / productsPerPage));
      } catch (err) {
        setError(
          `Failed to load products for ${searchQuery ? "search" : categorySlug}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categorySlug, filters, searchQuery, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, categorySlug, searchQuery, sortOption]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const getCategoryDescription = (slug: string | undefined) => {
    if (searchQuery) {
      return `${products.length} resultater for "${searchQuery}"`;
    }
    switch (slug) {
      case "sneakers":
        return "Alt vores footwear - sneakers, dress sko, loafers og støvler er udviklet i et stilrent og klassisk design, hvilket gør at de passer til ethvert outfit. Komfort og kvalitet er noget vi ikke vil gå på kompromis med og derfor er alle produkter håndlavet i Portugal.";
      case "shirts":
        return "Vores skjorter er designet med fokus på kvalitet og pasform. Uanset om du er til et klassisk eller moderne look, har vi en skjorte til dig. Alle vores skjorter er lavet af de bedste materialer for at sikre komfort hele dagen.";
      default:
        if (slug) {
          return `Udforsk vores udvalg af ${slug} i høj kvalitet. Designet i Danmark og produceret i Europa.`;
        }
        return "Udforsk vores store udvalg af produkter i høj kvalitet. Designet i Danmark og produceret i Europa.";
    }
  };

  const getCategoryName = (slug: string | undefined): string => {
    if (searchQuery) return "SØG";
    const translations: { [key: string]: string } = {
      sneakers: "Sneakers",
      shirts: "Skjorter",
      hoodies: "Hættetrøjer",
      jackets: "Jakker",
      pants: "Bukser",
      deals: "Tilbud",
    };
    return translations[slug?.toLowerCase() || ""] || slug || "Alle Produkter";
  };

  const categoryName = searchQuery ? "Søg" : getCategoryName(categorySlug);

  const capitalizedCategoryName =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const gridClasses: { [key: string]: string } = {
    "grid-1": "grid-cols-1",
    "grid-2": "grid-cols-2",
    "grid-3": "grid-cols-2 md:grid-cols-3",
    "grid-4": "grid-cols-2 md:grid-cols-4",
    "grid-6": "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const sortOptions = [
    { label: "Fremhævet", value: "" },
    { label: "Alfabetisk, A-Å", value: "name-asc" },
    { label: "Alfabetisk, Å-A", value: "name-desc" },
    { label: "Pris, lav til høj", value: "price-asc" },
    { label: "Pris, høj til lav", value: "price-desc" },
    { label: "Dato, ældre til nyere", value: "oldest" },
    { label: "Dato, nyere til ældre", value: "newest" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortOption)?.label ||
    "Sorter efter";

  return (
    <div className="py-6">
      <FilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        onApply={handleApplyFilters}
      />
      {notification.subtext && (
        <Notification
          heading={notification.heading}
          subtext={notification.subtext}
          type={notification.type as "success" | "error"}
          show={true}
          onClose={() =>
            setNotification({ heading: "", subtext: "", type: "" })
          }
        />
      )}

      {/* Top Header Section with padding */}
      <div className="px-6 md:px-12 mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[0.625rem] text-[#1c1c1ca6] mb-4">
          <Link to="/" className="hover:text-[#1c1c1c] transition-colors">
            BUTIK
          </Link>
          <span>/</span>
          <Link
            to="/category"
            className="hover:text-[#1c1c1c] transition-colors"
          >
            KATEGORI
          </Link>
          <span>/</span>
          <span className="text-[#1c1c1c] font-medium">
            {getCategoryName(categorySlug).toUpperCase()}
          </span>
        </nav>

        <h1 className="font-['EB_Garamond'] text-center mb-4 text-[clamp(2rem,5vw,2.625rem)]">
          {capitalizedCategoryName}
        </h1>
        <p className="text-center text-[#1c1c1c] mb-8 text-base max-w-4xl mx-auto">
          {getCategoryDescription(categorySlug)}
        </p>
      </div>

      {/* Filter and View Controls Bar */}
      <div
        ref={filterRef}
        className={`border-b mb-8 transition-all duration-300 ${
          isFilterSticky
            ? "fixed left-0 right-0 z-10 bg-[#f2f1f0] shadow-md border-t-0"
            : "relative border-t"
        }`}
        style={{ top: isFilterSticky ? headerHeight : "auto" }}
      >
        <div className="px-6 md:px-12 mx-auto">
          <div className="flex justify-between items-stretch">
            <div className="flex">
              <button
                className="text-gray-700 border-r border-[#00000026] flex items-center py-4 pr-6 md:px-8 text-sm font-medium"
                onClick={() => setFilterMenuOpen(true)}
              >
                Filtrer
              </button>
              <div className="border-r border-[#00000026] flex items-center px-4 md:px-8">
                <Dropdown
                  label={
                    <span className="text-sm font-medium">
                      {currentSortLabel}
                    </span>
                  }
                >
                  <div className="flex flex-col">
                    {sortOptions.map((option) => (
                      <button
                        key={option.label}
                        className={`text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                          sortOption === option.value ? "font-bold" : ""
                        }`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
              </div>
            </div>

            <div className="flex items-center space-x-2 py-4">
              {/* Responsive column icons */}
              <div className="flex items-center space-x-2">
                <img
                  src={oneColumnIcon}
                  alt="1 column"
                  className={`cursor-pointer w-5 h-5 md:hidden ${
                    viewMode !== "grid-1" ? "opacity-30" : ""
                  }`}
                  onClick={() => setViewMode("grid-1")}
                />
                <img
                  src={twoColumnIcon}
                  alt="2 column"
                  className={`cursor-pointer w-5 h-5 md:hidden ${
                    viewMode !== "grid-2" ? "opacity-30" : ""
                  }`}
                  onClick={() => setViewMode("grid-2")}
                />
                <img
                  src={threeColumnIcon}
                  alt="3 column"
                  className={`cursor-pointer w-5 h-5 hidden md:block ${
                    viewMode !== "grid-3" ? "opacity-30" : ""
                  }`}
                  onClick={() => setViewMode("grid-3")}
                />
                <img
                  src={multipleColumnIcon}
                  alt="6 column"
                  className={`cursor-pointer w-5 h-5 hidden lg:block ${
                    viewMode !== "grid-6" ? "opacity-30" : ""
                  }`}
                  onClick={() => setViewMode("grid-6")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFilterSticky && (
        <div style={{ height: filterRef.current?.offsetHeight || 0 }} />
      )}

      {/* Products Grid with aligned padding */}
      <div className="px-6 md:px-12 mx-auto">
        {error ? (
          <div className="text-center text-red-500 py-20">
            Der opstod en fejl under indlæsning af produkter.
          </div>
        ) : (
          <>
            <div
              className={`grid gap-x-4 gap-y-12 md:gap-y-16 ${gridClasses[viewMode]}`}
            >
              {loading
                ? Array.from({ length: productsPerPage }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))
                : currentProducts.map((product, index) => (
                    <ProductCard
                      key={`${product.id}-${viewMode}`}
                      product={product}
                      onNotify={handleNotification}
                      index={index}
                    />
                  ))}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-16 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border border-[#00000026] rounded-sm ${
                    currentPage === 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Forrige
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => {
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 border rounded-sm transition-colors ${
                            currentPage === pageNumber
                              ? "bg-[#1c1c1c] text-white border-[#1c1c1c]"
                              : "border-[#00000026] hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border border-[#00000026] rounded-sm ${
                    currentPage === totalPages
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Næste
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Responsive Category Info Section */}
      <section className="px-6 md:px-12 mt-20 bg-[#181c2e] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 lg:gap-24">
          {getCategoryInfo(categorySlug).map((element, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl md:text-3xl text-white font-['EB_Garamond'] leading-tight">
                {element.title}
              </h2>
              <p className="whitespace-pre-line text-gray-300 text-sm md:text-base leading-relaxed">
                {element.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Category;
