import axios from "axios";
import { Product } from "../types";
import { buildProductQueryParams } from "../utils/apiUtils";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ✅ Security: Attach JWT token to requests if it exists
// Removed manual Authorization header injection because we now use httpOnly cookies.
/*
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/

export const fetchProducts = async (
  category?: string,
  filters?: any,
  limit?: number,
  sort?: string
) => {
  const params = buildProductQueryParams(category, filters, limit, sort);
  const response = await apiClient.get("/products", { params });
  return response.data;
};

export const searchProducts = async (query: string) => {
  const response = await apiClient.get(`/products/search?q=${query}`);
  return response.data;
};

export const searchOrders = async (query: string) => {
  const response = await apiClient.get(`/orders/search?q=${query}`);
  return response.data;
};

export const searchGiftCards = async (query: string) => {
  const response = await apiClient.get(`/gift-cards/search?q=${query}`);
  return response.data;
};

export const fetchProduct = async (id: number | string) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData: Partial<Product>) => {
  const response = await apiClient.post("/products", productData);
  return response.data;
};

export const updateProduct = async (
  id: number | string,
  productData: Partial<Product>
) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

export const uploadImage = async (base64Image: string) => {
  const response = await apiClient.post("/upload", { image: base64Image });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const fetchCategory = async (id: number) => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};

export const fetchSizes = async () => {
  const response = await apiClient.get("/sizes");
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/login", { email, password });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await apiClient.post("/register", { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export const likeProduct = async (customerId: number, productId: number) => {
  const response = await apiClient.post("/products/like", {
    customerId,
    productId,
  });
  return response.data;
};

export const unlikeProduct = async (customerId: number, productId: number) => {
  const response = await apiClient.delete("/products/unlike", {
    data: { customerId, productId },
  });
  return response.data;
};

export const getLikedProducts = async (customerId: number) => {
  const response = await apiClient.get(`/products/liked/${customerId}`);
  return response.data;
};

export const getCustomerByUserId = async (userId: number) => {
  const response = await apiClient.get(`/customer/by-user/${userId}`);
  return response.data;
};

export const GetShipmentOptions = async (
  country_code: string,
  product_code: string,
  zipcode: string,
  address: string,
  city: string
) => {
  const response = await apiClient.get("/shipment-options", {
    params: {
      country_code,
      product_code,
      zipcode,
      address,
      city,
    },
  });
  return response.data;
};

export const GetShipmentRates = async (
  sender_country_code: string,
  sender_zipcode: string,
  receiver_country_code: string,
  receiver_zipcode: string,
  product_codes: string[],
  weight: number
) => {
  const response = await apiClient.post("/quotes", {
    sender_country_code,
    sender_zipcode,
    receiver_country_code,
    receiver_zipcode,
    product_codes,
    weight,
  });
  return response.data;
};

export const getShipmondoProducts = async () => {
  const response = await apiClient.get("/shipmondo/products");
  return response.data;
};

export const createGiftCard = async (giftCardData: {
  code: string;
  amount: string;
  expiresAt: string | null;
}) => {
  const response = await apiClient.post("/gift-cards", giftCardData);
  return response.data;
};

export const fetchGiftCards = async () => {
  const response = await apiClient.get("/gift-cards");
  return response.data;
};

export const fetchGiftCard = async (id: number | string) => {
  const response = await apiClient.get(`/gift-cards/${id}`);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await apiClient.get("/orders");
  return response.data;
};

export const fetchOrder = async (id: number | string) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

export const updateGiftCard = async (
  id: number | string,
  giftCardData: {
    code: string;
    amount: string;
    expiresAt: string | null;
  }
) => {
  const response = await apiClient.put(`/gift-cards/${id}`, giftCardData);
  return response.data;
};

export const batchUpdateGiftCards = async (
  ids: number[],
  data: Partial<{ isEnabled: boolean }>
) => {
  const response = await apiClient.put("/gift-cards/batch-update", { ids, data });
  return response.data;
};
