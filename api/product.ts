// hooks/useProducts.ts

import { Product, ProductFilters, ProductsResponse } from '@/lib/types';
import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch All Products with Pagination and Filters
 */
export function useProducts(filters?: ProductFilters, enabled = true) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category_id) params.append('category_id', filters.category_id);
      if (filters?.min_price) params.append('min_price', filters.min_price.toString());
      if (filters?.max_price) params.append('max_price', filters.max_price.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await http.get(`/products?${params.toString()}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch products");
      }

      return response.data as ProductsResponse;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch Best Sellers
 */
export function useBestSellers(limit = 10, enabled = true) {
  return useQuery({
    queryKey: ["best-sellers", limit],
    queryFn: async () => {
      const response = await http.get(`/products/best-sellers?limit=${limit}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch best sellers");
      }

      return response.data as Product[];
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch New Arrivals
 */
export function useNewArrivals(limit = 10, enabled = true) {
  return useQuery({
    queryKey: ["new-arrivals", limit],
    queryFn: async () => {
      const response = await http.get(`/products/new-arrivals?limit=${limit}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch new arrivals");
      }

      return response.data as Product[];
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch Single Product by ID
 */
export function useProduct(productId: string, enabled = true) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await http.get(`/products/${productId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch product");
      }

      return response.data as Product;
    },
    enabled: enabled && !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}