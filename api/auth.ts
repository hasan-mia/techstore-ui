import { http } from '../config/http';
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Login user
 */
export function useLogin() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      const response = await http.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;

      if (!accessToken) throw new Error("No token received from server");
      return { token: accessToken, user };
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      throw new Error(error?.response?.data?.message || error?.message || "Failed to login");
    },
  });
}

/**
 * Register user
 */
export function useRegister() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const response = await http.post("/auth/register", {
        email,
        password,
        name,
      });

      const { accessToken, user } = response.data.data;
      if (!accessToken) throw new Error("No token received from server");
      return { token: accessToken, user };
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      throw new Error(error?.response?.data?.message || error?.message || "Failed to register");
    },
  });
}

/**
 * Fetch User Info
 */
export function useUserInfo(enabled = true) {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: async () => {
      const response = await http.get("/auth/me");
      const { data } = response.data;
      if (!data) throw new Error("No user data received");
      return data;
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Logout user (optional - if you have a logout endpoint)
 */
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await http.post("/auth/logout");
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
    },
  });
}