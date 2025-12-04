import axios from "axios";
import { Product } from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchProducts = async () => {
  const response = await apiClient.get("/products");
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
