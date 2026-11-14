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

type CategoryBlock = { title: string; description: string };
type CategoryContent = { description: string; info: CategoryBlock[] };

// The header links to /category/skjorter, the homepage to /category/shirts.
const SLUG_ALIASES: Record<string, string> = { skjorter: "shirts" };
const normalizeSlug = (slug: string | undefined): string => {
  const key = (slug ?? "").toLowerCase();
  return SLUG_ALIASES[key] ?? key;
};

// Intro line and the three text blocks under the product grid, per category.
// Keep the three blocks of a category about the same length (two short
// paragraphs of roughly 150 and 110 characters) so the columns line up.
const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  sneakers: {
    description:
      "Alt vores footwear - sneakers, dress sko, loafers og støvler er udviklet i et stilrent og klassisk design, hvilket gør at de passer til ethvert outfit. Komfort og kvalitet er noget vi ikke vil gå på kompromis med og derfor er alle produkter håndlavet i Portugal.",
    info: [
      {
        title: "Nordiske Sneakers til Mænd",
        description:
          "Vores sneakers forener skandinavisk minimalisme med europæisk håndværk. Hver sko er håndlavet i Portugal med fokus på stil og komfort. \n\n Det stilrene design passer til alt fra hverdagslook til mere formelle outfits.",
      },
      {
        title: "Kvalitet til Enhver Lejlighed",
        description:
          "Vores kollektion kombinerer tidløst design med førsteklasses håndværk. Hver sko er omhyggeligt fremstillet i Portugal for optimal komfort. \n\n Du finder et par til hverdagen og et par til de lidt pænere dage.",
      },
      {
        title: "Europæisk Håndværk",
        description:
          "Vores sneakers er skabt med passion for skandinavisk design og europæisk kvalitet. Hvert par samler komfort, holdbarhed og æstetik. \n\n Fra afslappede dage til formelle begivenheder finder du dit match her.",
      },
    ],
  },
  loafers: {
    description:
      "Loafers til dig, der vil have det elegante uden besværet. Slip-in-formen og de rene linjer passer lige så godt til chinos som til habit. Alle modeller er håndlavet i Portugal af udvalgt læder og ruskind.",
    info: [
      {
        title: "Loafers med Nordisk Ro",
        description:
          "Vores loafers forener afdæmpet skandinavisk design med portugisisk håndværk. Slip-in-formen gør dem lette at tage på. \n\n Hvert par er håndlavet af udvalgte materialer.",
      },
      {
        title: "Ruskind og Læder",
        description:
          "Vi bruger blødt ruskind og fast læder, der former sig efter foden og får karakter med tiden. \n\n Med læderhæl og fleksibel sål er de behagelige fra den første dag.",
      },
      {
        title: "Fra Penny til Tassel",
        description:
          "Vælg mellem penny, tassel og horsebit, alt efter din stil. De passer til både habit, chinos og afslappet hverdag. \n\n De er skabt til at blive brugt igen og igen, sæson efter sæson.",
      },
    ],
  },
  "dress-shoes": {
    description:
      "Klassiske dress shoes til kontoret og de pæne anledninger. Oxford, derby, brogue og wholecut, alle håndlavet i Portugal af udvalgt læder og ruskind med læderhæl og læderforing.",
    info: [
      {
        title: "Klassiske Former",
        description:
          "Vores dress shoes bygger på klassiske former som oxford, derby og brogue, tegnet med nordisk enkelhed. \n\n Hvert par er håndlavet i Portugal.",
      },
      {
        title: "Materialer der Holder",
        description:
          "Vi vælger kalveskind og blødt ruskind med læderforing og læderhæl, så skoene er behagelige hele dagen. \n\n Med god pleje holder de i mange år og får karakter undervejs.",
      },
      {
        title: "Fra Kontor til Fest",
        description:
          "En sort oxford til jakkesættet eller en brun derby til chinos. Vores dress shoes passer til en bred garderobe. \n\n De tåler at blive brugt og bliver bedre med tiden, sæson efter sæson.",
      },
    ],
  },
  boots: {
    description:
      "Støvler til efterår og vinter. Chelsea, chukka og snørestøvler i læder og ruskind, håndlavet i Portugal med holdbare såler.",
    info: [
      {
        title: "Støvler til Årstiderne",
        description:
          "Vores støvler er designet til efterår og vinter med rene linjer og et robust udtryk. \n\n Hvert par er håndlavet i Portugal af udvalgte materialer.",
      },
      {
        title: "Chelsea, Chukka og Snøre",
        description:
          "Vælg mellem den elegante chelsea, den afslappede chukka eller den kraftige snørestøvle med lugsål. \n\n Alle forener komfort med et tidløst udtryk.",
      },
      {
        title: "Bygget til at Holde",
        description:
          "Vi bruger fast læder og blødt ruskind med solide såler, så støvlerne klarer både byen og vejret. \n\n Med lidt pleje holder de i mange sæsoner.",
      },
    ],
  },
  shirts: {
    description:
      "Vores skjorter er designet med fokus på kvalitet og pasform. Uanset om du er til et klassisk eller moderne look, har vi en skjorte til dig. Alle vores skjorter er lavet af de bedste materialer for at sikre komfort hele dagen.",
    info: [
      {
        title: "Kvalitet og Pasform",
        description:
          "Vores skjorter er designet med fokus på kvalitet og pasform, uanset om du er til et klassisk eller moderne look. \n\n De er lavet af gode materialer, der er behagelige hele dagen.",
      },
      {
        title: "Tidløst Design",
        description:
          "Vores udvalg forener tidløst design med moderne detaljer. Hver skjorte er fremstillet af materialer, der holder. \n\n Vælg en til arbejde eller en til fritiden.",
      },
      {
        title: "Til Enhver Lejlighed",
        description:
          "Vores skjorter er skabt med passion for detaljer. Med flere stilarter og farver finder du nemt en, der passer til dig. \n\n De klæder både formelle og afslappede anledninger, fra kontoret til weekenden.",
      },
    ],
  },
  accessories: {
    description:
      "Tilbehør i læder, designet til at passe til resten af kollektionen med det samme rolige, nordiske udtryk.",
    info: [
      {
        title: "Tilbehør med Omtanke",
        description:
          "Vores tilbehør supplerer kollektionen med få detaljer og materialer, der holder. \n\n Designet i Danmark og produceret i Europa.",
      },
      {
        title: "Læder i Høj Kvalitet",
        description:
          "Vi bruger fast læder og solide beslag, så hvert stykke kan bruges hver dag. \n\n Lædret får karakter med tiden og bliver kun bedre.",
      },
      {
        title: "Tidløst Design",
        description:
          "Vi laver tilbehør, der passer til hverdagen og holder længe. \n\n Det er uafhængigt af kortvarige trends og designet til at blive brugt igen og igen.",
      },
    ],
  },
};

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
      : "grid-2",
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
    const content = CATEGORY_CONTENT[normalizeSlug(slug)];
    if (content) return content.info;
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
            sortOption,
          );
        }

        const productArray = Array.isArray(fetchedProducts)
          ? fetchedProducts
          : [];
        setProducts(productArray);
        setTotalPages(Math.ceil(productArray.length / productsPerPage));
      } catch (err) {
        setError(
          `Failed to load products for ${searchQuery ? "search" : categorySlug}`,
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
    indexOfLastProduct,
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
    const content = CATEGORY_CONTENT[normalizeSlug(slug)];
    if (content) return content.description;
    if (slug) {
      return `Udforsk vores udvalg af ${slug} i høj kvalitet. Designet i Danmark og produceret i Europa.`;
    }
    return "Udforsk vores store udvalg af produkter i høj kvalitet. Designet i Danmark og produceret i Europa.";
  };

  const getCategoryName = (slug: string | undefined): string => {
    if (searchQuery) return "SØG";
    const translations: { [key: string]: string } = {
      sneakers: "Sneakers",
      shirts: "Skjorter",
      skjorter: "Skjorter",
      loafers: "Loafers",
      "dress-shoes": "Dress shoes",
      boots: "Boots",
      accessories: "Accessories",
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
    <div className="pt-6">
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

        <h1 className="font-garamond text-center mb-4 text-[clamp(2rem,5vw,2.625rem)]">
          {capitalizedCategoryName}
        </h1>
        <p className="text-center text-[#1c1c1c] mb-8 text-base max-w-4xl mx-auto">
          {getCategoryDescription(categorySlug)}
        </p>
      </div>

      {/* Filter and View Controls Bar */}
      <div
        ref={filterRef}
        className={`border-y mb-8 transition-all duration-300 ${
          isFilterSticky
            ? "fixed left-0 right-0 z-10 bg-[#fefffe] shadow-md"
            : "relative"
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
                  },
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

      {/* Category info: light tint band above the dark footer */}
      <section className="mt-20 bg-[#f2f1f0] px-6 py-16 text-[#1c1c1c] md:px-12 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-3 lg:gap-24">
          {getCategoryInfo(categorySlug).map((element, index) => (
            <div key={index} className="space-y-4">
              <h2 className="font-garamond text-2xl leading-tight md:text-3xl">
                {element.title}
              </h2>
              <div className="h-px w-10 bg-[#1c1c1c]/30" aria-hidden="true" />
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#1c1c1c]/75 md:text-base">
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
