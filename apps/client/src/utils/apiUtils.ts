export const buildProductQueryParams = (
  category?: string,
  filters?: any,
  limit?: number,
  sort?: string
): URLSearchParams => {
  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }
  if (filters) {
    if (filters.priceRange) {
      params.append("minPrice", filters.priceRange[0]);
      params.append("maxPrice", filters.priceRange[1]);
    }
    if (filters.categories) {
      filters.categories.forEach((catId: number) =>
        params.append("categories[]", catId.toString())
      );
    }
    if (filters.sizes) {
      filters.sizes.forEach((sizeId: number) =>
        params.append("sizes[]", sizeId.toString())
      );
    }
  }
  if (limit) {
    params.append("limit", limit.toString());
  }
  if (sort) {
    params.append("sort", sort);
  }
  return params;
};
