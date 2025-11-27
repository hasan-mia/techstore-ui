import { mapCartItemsForBackend } from '@/lib/utils';
import { http } from '../config/http';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface OrderItem {
  product_id: string
  quantity: number
}

interface CreateOrderPayload {
  items: OrderItem[]
  payment_method: "CASH_ON_DELIVERY" | "CARD"
  address_id: string
  notes?: string
}

/**
 * Create order by user
 */
export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data: CreateOrderPayload) => {
      console.log("Creating order with payload:", data)

      const response = await http.post("/orders", data)

      if (!response?.data) {
        throw new Error("Failed to create order")
      }

      console.log("Order created successfully:", response.data)
      return response.data
    },
    onError: (error: any) => {
      console.error("Order creation error:", error)
      throw new Error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create order"
      )
    },
  })
}

/**
 * Fetch User order
 */
export function useMyOrder(enabled = true) {
  return useQuery({
    queryKey: ["user-order"],
    queryFn: async () => {
      const response = await http.get("/orders/my-orders");
      const { data } = response;
      if (!data) throw new Error("No order data found");
      return data;
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}