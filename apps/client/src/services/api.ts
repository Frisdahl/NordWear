import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
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

export const createProduct = async (productData: {
  name: string;
  price: number;
  categoryId?: number;
}) => {
  const response = await apiClient.post("/products", productData);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};
