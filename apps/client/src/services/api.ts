import axios from "axios";
import { Product } from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchProducts = async (category?: string, filters?: any) => {
  const params = new URLSearchParams();
  if (category) {
    params.append('category', category);
  }
  if (filters) {
    if (filters.priceRange) {
      params.append('minPrice', filters.priceRange[0]);
      params.append('maxPrice', filters.priceRange[1]);
    }
    if (filters.categories) {
      filters.categories.forEach((catId: number) => params.append('categories[]', catId.toString()));
    }
    if (filters.sizes) {
      filters.sizes.forEach((sizeId: number) => params.append('sizes[]', sizeId.toString()));
    }
  }

  const response = await apiClient.get("/products", { params });
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

export const updateProduct = async (id: number | string, productData: Partial<Product>) => {
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

export const fetchSizes = async () => {
  const response = await apiClient.get("/sizes");
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/login", { email, password });
  return response.data;
};

export const register = async (name: string, email:string, password: string) => {
  const response = await apiClient.post("/register", { name, email, password });
  return response.data;
};

export const likeProduct = async (customerId: number, productId: number) => {
  const response = await apiClient.post("/products/like", { customerId, productId });
  return response.data;
};

export const unlikeProduct = async (customerId: number, productId: number) => {
  const response = await apiClient.delete("/products/unlike", { data: { customerId, productId } });
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
