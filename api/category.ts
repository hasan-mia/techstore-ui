import { CategoryResponse } from '@/lib/types';
import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

export function useCategories(enabled = true) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await http.get(`/categories`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch categories");
      }

      return response.data as CategoryResponse;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
