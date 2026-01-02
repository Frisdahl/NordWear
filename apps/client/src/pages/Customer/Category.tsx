import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useOutletContext, useSearchParams } from "react-router-dom";
import { Product } from "../../types";
import { fetchProducts, searchProducts } from "../../services/api";
import FilterMenu from "../../components/customer/FilterMenu";
import ProductCard from "../../components/customer/ProductCard";
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
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [viewMode, setViewMode] = useState<string>("grid-3");
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

  const getCategoryInfo = (categoryName: string | undefined) => {
    if (searchQuery) {
       return [];
    }

    switch (categoryName) {
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
            title: "Kvalitets Trøjer til Enhver Stil",
            description:
              "Vores trøjer er designet med fokus på kvalitet og pasform. Uanset om du er til et klassisk eller moderne look, har vi en trøje til dig. \n\n Alle vores trøjer er lavet af de bedste materialer for at sikre komfort hele dagen.",
          },
          {
            title: "Stilfulde Trøjer til Mænd",
            description:
              "Opdag vores eksklusive udvalg af trøjer, der kombinerer tidløst design med moderne trends. Hver trøje er fremstillet af førsteklasses materialer for at sikre både komfort og holdbarhed. \n\n Uanset om du har brug for en trøje til arbejde eller fritid, har vi det perfekte valg til dig.",
          },
          {
            title: "Til Enhver Lejlighed",
            description:
              "Vores trøjer er skabt med en passion for detaljer og kvalitet. Med et bredt udvalg af stilarter og farver, finder du nemt en trøje, der passer til din personlige stil. \n\n Perfekt til både formelle og afslappede begivenheder, vores trøjer sikrer, at du altid ser skarp ud.",
          },
        ];

      case "deals":
        return [
          {
            title: "Eksklusive Tilbud",
            description:
              "Gør et kup! Her finder du vores bedste tilbud på udvalgte varer. Skynd dig, før det er for sent.",
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
            fetchedProducts = await fetchProducts(categoryName, filters, undefined, sortOption);
        }

        const productArray = Array.isArray(fetchedProducts)
          ? fetchedProducts
          : [];
        setProducts(productArray);
        setTotalPages(Math.ceil(productArray.length / productsPerPage));
      } catch (err) {
        setError(`Failed to load products for ${searchQuery ? "search" : categoryName}`);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName, filters, searchQuery, sortOption]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, categoryName, searchQuery, sortOption]);

  // Get current products for the page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleAuthRequired = () => {
    setNotification({
      message: "Du skal være logget ind for at tilføje til ønskelisten.",
      type: "error",
    });
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const getCategoryDescription = (categoryName: string | undefined) => {
    if (searchQuery) {
        return `${products.length} resultater for "${searchQuery}"`;
    }
    switch (categoryName) {
      case "sneakers":
        return "Alt vores footwear - sneakers, dress sko, loafers og støvler er udviklet i et stilrent og klassisk design, hvilket gør at de passer til ethvert outfit. Komfort og kvalitet er noget vi ikke vil gå på kompromis med og derfor er alle produkter håndlavet i Portugal.";
      case "shirts":
        return "Vores skjorter er designet med fokus på kvalitet og pasform. Uanset om du er til et klassisk eller moderne look, har vi en skjorte til dig. Alle vores skjorter er lavet af de bedste materialer for at sikre komfort hele dagen.";
      case "deals":
        return "Gør et kup! Her finder du vores bedste tilbud på udvalgte varer. Skynd dig, før det er for sent.";
      default:
        if (categoryName) {
          return `Udforsk vores udvalg af ${categoryName} i høj kvalitet. Designet i Danmark og produceret i Europa.`;
        }
        return "Udforsk vores store udvalg af produkter i høj kvalitet. Designet i Danmark og produceret i Europa.";
    }
  };

  const categoryNameToDanish = (categoryName: string | undefined): string => {
    if (searchQuery) return "SØG";
    const translations: { [key: string]: string } = {
      sneakers: "Sneakers",
      shirts: "Shirts",
      hoodies: "Hoodies",
      jackets: "Jakker",
      pants: "Bukser",
      deals: "Tilbud",
    };
    return (
      translations[categoryName?.toLowerCase() || ""] ||
      categoryName ||
      "Alle Produkter"
    );
  };

  const capitalizedCategoryName = searchQuery
    ? "Søg"
    : categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1) ||
      "Alle Produkter";

  const gridClasses: { [key: string]: string } = {
    "grid-1": "grid-cols-1",
    "grid-2": "grid-cols-2 md:grid-cols-3",
    "grid-3": "grid-cols-3 md:grid-cols-4",
    "grid-4": "grid-cols-4",
    "grid-5": "grid-cols-5",
    "grid-6": "grid-cols-6",
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
    { label: "Bestsellere", value: "bestsellers" }, // Placeholder logic
    { label: "Alfabetisk, A-Å", value: "name-asc" },
    { label: "Alfabetisk, Å-A", value: "name-desc" },
    { label: "Pris, lav til høj", value: "price-asc" },
    { label: "Pris, høj til lav", value: "price-desc" },
    { label: "Dato, ældre til nyere", value: "oldest" },
    { label: "Dato, nyere til ældre", value: "newest" },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortOption)?.label || "Sorter efter";

  return (
    <div className="py-6">
      <FilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setFilterMenuOpen(false)}
        onApply={handleApplyFilters}
      />
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type as "success" | "error"}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
      <div className="mx-auto sm:px-12">
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
            {categoryNameToDanish(categoryName).toUpperCase()}
          </span>
        </nav>

        <h1 className="font-['EB_Garamond'] text-center mb-4 text-[clamp(2rem,5vw,2.625rem)]">
          {capitalizedCategoryName}
        </h1>
        <p className="text-center text-[#1c1c1c] mb-8 text-base max-w-4xl mx-auto">
          {getCategoryDescription(categoryName)}
        </p>
      </div>

      <div
        ref={filterRef}
        className={`border-b mb-8 transition-all duration-300 ${
          isFilterSticky
            ? "fixed left-0 right-0 z-10 bg-[#f2f1f0] shadow-md border-t-0"
            : "relative border-t"
        }`}
        style={{ top: isFilterSticky ? headerHeight : "auto" }}
      >
        <div className="mx-auto pl-3 md:pr-12 ">
          <div className="flex justify-between items-stretch">
            <div className="flex">
              <button
                className="text-gray-700 border-r border-gray-300 flex items-center py-4 px-8"
                onClick={() => setFilterMenuOpen(true)}
              >
                Filtrer
              </button>
              <div className="border-r border-gray-300 flex items-center">
                 <Dropdown label={currentSortLabel}>
                    <div className="flex flex-col">
                      {sortOptions.map((option) => (
                        <button
                          key={option.label}
                          className={`text-left px-4 py-2 hover:bg-gray-100 text-sm ${sortOption === option.value ? 'font-bold' : ''}`}
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
              {/* Mobile: Show 1 and 2 column options */}
              <div className="flex md:hidden space-x-2">
                <img
                  src={oneColumnIcon}
                  alt="1 column"
                  className={`cursor-pointer ${
                    viewMode !== "grid-1" ? "opacity-70" : ""
                  }`}
                  onClick={() => setViewMode("grid-1")}
                />
                <img
                  src={twoColumnIcon}
                  alt="2 column"
                  className={`cursor-pointer ${
                    viewMode !== "grid-2" ? "opacity-70" : ""
                  }`}
                  onClick={() => setViewMode("grid-2")}
                />
              </div>

              {/* Desktop: Show all 4 column options */}
              <div className="hidden md:flex space-x-2">
                <img
                  src={oneColumnIcon}
                  alt="1 column"
                  className={`cursor-pointer md:hidden ${
                    viewMode !== "grid-1" ? "opacity-70" : ""
                  }`}
                  onClick={() => setViewMode("grid-1")}
                />
                <img
                  src={twoColumnIcon}
                  alt="2 column"
                  className={`cursor-pointer ${
                    viewMode !== "grid-2" ? "opacity-70" : ""
                  }`}
                  onClick={() => setViewMode("grid-2")}
                />
                <img
                  src={threeColumnIcon}
                  alt="3 column"
                  className={`cursor-pointer ${
                    viewMode !== "grid-3" ? "opacity-70" : ""
                  }`}
                  onClick={() => setViewMode("grid-3")}
                />
                <img
                  src={multipleColumnIcon}
                  alt="6 column"
                  className={`cursor-pointer ${
                    viewMode !== "grid-6" ? "opacity-70" : ""
                  }`}
                  onClick={() => setViewMode("grid-6")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isFilterSticky && (
        <div style={{ height: filterRef.current?.offsetHeight }} />
      )}

      <div className="mx-auto px-6 sm:px-12">
        {loading ? (
          <div className="text-center">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div
              className={`grid gap-x-4 gap-y-[4rem] ${gridClasses[viewMode]}`}
            >
              {currentProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${viewMode}`}
                  product={product}
                  onAuthRequired={handleAuthRequired}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
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
                          className={`px-4 py-2 border rounded ${
                            currentPage === pageNumber
                              ? "bg-[#1c1c1c] text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber}>...</span>;
                    }
                    return null;
                  }
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
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

      <section className="px-12 mt-14 bg-[#181c2e] text-white py-20">
        <div className="grid grid-cols-3 gap-36">
          {getCategoryInfo(categoryName).map((element, index) => (
            <div key={index} className="col-span-3 md:col-span-1">
              <h2 className="text-3xl text-white mb-4 font-['EB_Garamond']">
                {element.title}
              </h2>
              <p className="whitespace-pre-line text-gray-300">
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
