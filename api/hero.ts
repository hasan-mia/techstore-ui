import { CategoryResponse, HeroResponse } from '@/lib/types';
import { http } from '../config/http';
import { useQuery } from "@tanstack/react-query";

export function useActiveHeroes(enabled = true) {
  return useQuery({
    queryKey: ["active-heroes"],
    queryFn: async () => {
      const response = await http.get(`/heroes/active`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch heroes");
      }

      return response.data as HeroResponse;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
