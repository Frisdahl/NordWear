import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Product } from "../../types";
import { fetchProducts } from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";
import Notification from "../../components/Notification";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAuthRequired = () => {
    setNotification({
      message: 'Du skal være logget ind for at tilføje til ønskelisten.',
      type: 'error',
    });
  };

  return (
    <div className="text-[#1c1c1c]">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type as 'success' | 'error'}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}

            {/* Hero Section */}
            <section className="h-screen bg-gray-800 flex items-center justify-center text-white relative -mt-24">
              <div 
                className="absolute inset-0 bg-cover bg-center"          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551232864-3f0890e58e35?q=80&w=2940&auto=format&fit=crop')",
            filter: "brightness(0.6)",
          }}
        ></div>
        <div className="text-center z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Nordic Apparel
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            For the modern adventurer. Uncompromised quality inspired by the
            wild.
          </p>
          <button className="bg-white text-[#1c1c1c] font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105">
            Shop New Arrivals
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Udvalgte Produkter
          </h2>
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex flex-row gap-4 items-stretch">
                {products.map((product) => (
                  <div className="embla__slide flex-none w-[250px]" key={product.id}>
                    <ProductCard product={product} onAuthRequired={handleAuthRequired} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
