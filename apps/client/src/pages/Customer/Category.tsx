import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../types";
import { fetchProducts } from "../../services/api";
import FilterMenu from "../../components/customer/FilterMenu";
import ProductCard from "../../components/customer/ProductCard";
import Notification from "../../components/Notification";

interface FilterOptions {
  priceRange: [number, number];
  categories: number[];
  sizes: number[];
}

const Category: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [isFilterSticky, setFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterOriginalTop, setFilterOriginalTop] = useState(0);

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
        window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filterOriginalTop]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await fetchProducts(categoryName, filters);
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        setError(`Failed to load products for ${categoryName}`);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName, filters]);

  const handleAuthRequired = () => {
    setNotification({
      message: 'Du skal være logget ind for at tilføje til ønskelisten.',
      type: 'error',
    });
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const getCategoryDescription = (categoryName: string | undefined) => {
    switch (categoryName) {
      case 'sneakers':
        return "Alt vores footwear - sneakers, dress sko, loafers og støvler er udviklet i et stilrent og klassisk design, hvilket gør at de passer til ethvert outfit. Komfort og kvalitet er noget vi ikke vil gå på kompromis med og derfor er alle produkter håndlavet i Portugal.";
      case 'shirts':
        return "Vores skjorter er designet med fokus på kvalitet og pasform. Uanset om du er til et klassisk eller moderne look, har vi en skjorte til dig. Alle vores skjorter er lavet af de bedste materialer for at sikre komfort hele dagen.";
      case 'deals':
        return "Gør et kup! Her finder du vores bedste tilbud på udvalgte varer. Skynd dig, før det er for sent.";
      default:
        return `Udforsk vores udvalg af ${categoryName} i høj kvalitet. Designet i Danmark og produceret i Europa.`;
    }
  };

  const capitalizedCategoryName =
    categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1);

  return (
    <div className="py-8">
      <FilterMenu 
        isOpen={isFilterMenuOpen} 
        onClose={() => setFilterMenuOpen(false)}
        onApply={handleApplyFilters}
      />
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type as 'success' | 'error'}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <div className="container mx-auto px-3 sm:px-6">
        <h1 className="text-3xl font-bold text-center mb-4">{capitalizedCategoryName}</h1>
        <p className="text-center text-gray-600 mb-8 text-base max-w-2xl mx-auto">
          {getCategoryDescription(categoryName)}
        </p>
      </div>

      <div ref={filterRef} className={`border-b mb-8 transition-all duration-300 ${isFilterSticky ? 'fixed top-[88px] left-0 right-0 z-10 bg-white shadow-md border-t-0' : 'relative border-t'}`}>
        <div className="container mx-auto px-3 sm:px-6">
          <div className="flex justify-between items-stretch">
            <div className="flex">
              <div className="border-r border-gray-300 flex items-center py-4 px-8">
                <button className="text-gray-700" onClick={() => setFilterMenuOpen(true)}>Filtrer</button>
              </div>
              <div className="border-r border-gray-300 flex items-center py-4 px-8">
                <button className="text-gray-700">Sorter efter</button>
              </div>
            </div>
            <div className="flex items-center space-x-2 py-4">
              <div className="w-[18px] h-[18px] bg-black cursor-pointer" onClick={() => setViewMode('list')}></div>
              <div className="w-[18px] h-[18px] grid grid-cols-2 gap-0.5 cursor-pointer" onClick={() => setViewMode('grid')}>
                <div className="w-full h-full bg-black"></div>
                <div className="w-full h-full bg-black"></div>
                <div className="w-full h-full bg-black"></div>
                <div className="w-full h-full bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isFilterSticky && <div style={{ height: filterRef.current?.offsetHeight }} />}


      <div className="container mx-auto px-3 sm:px-6">
        {loading ? (
          <div className="text-center">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAuthRequired={handleAuthRequired} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;