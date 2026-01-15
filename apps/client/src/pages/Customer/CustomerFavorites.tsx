import React, { useEffect, useState } from "react";
import { Product } from "../../types";
import { getLikedProducts } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext"; 
import ProductCard from "../../components/customer/ProductCard";
import Notification from "../../components/Notification";

const CustomerFavorites: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ heading: "", subtext: "", type: "" });
  const { customerId } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!customerId) {
        setLoading(false);
        setError("You must be logged in to see your favorites.");
        return;
      }

      // 1. Check sessionStorage first
      const cachedFavorites = sessionStorage.getItem(`favoriteProducts_${customerId}`);
      if (cachedFavorites) {
        setProducts(JSON.parse(cachedFavorites));
        setLoading(false);
        return;
      }

      // 2. If no cache, fetch from API
      try {
        setLoading(true);
        const favoriteProducts = await getLikedProducts(customerId);
        setProducts(favoriteProducts);
        // 3. Save to sessionStorage for next time
        sessionStorage.setItem(`favoriteProducts_${customerId}`, JSON.stringify(favoriteProducts));
      } catch (err) {
        setError("Failed to load favorite products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [customerId]);

  const handleNotification = (data: { heading: string; subtext: string; type: "success" | "error" }) => {
    setNotification({
      heading: data.heading,
      subtext: data.subtext,
      type: data.type as "success" | "error",
    });
  };
  
  const handleUnlike = (productId: number) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    sessionStorage.removeItem(`favoriteProducts_${customerId}`);
  };

  if (loading) {
    return <div className="text-center p-12">Loading your favorite products...</div>;
  }

  if (error) {
    return <div className="text-center p-12 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8">
        {notification.subtext && (
            <Notification
            show={!!notification.subtext}
            heading={notification.heading}
            subtext={notification.subtext}
            type={notification.type as "success" | "error"}
            onClose={() => setNotification({ heading: "", subtext: "", type: "" })}
            />
        )}
      <h1 className="text-3xl font-['EB_Garamond'] mb-6">My Favorite Products</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onNotify={handleNotification} 
              onUnlike={handleUnlike} 
            />
          ))}
        </div>
      ) : (
        <p>You haven't added any products to your favorites yet.</p>
      )}
    </div>
  );
};

export default CustomerFavorites;