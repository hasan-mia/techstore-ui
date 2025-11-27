import { http } from '../config/http';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
 * upsert address Info
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await http.put("/auth/profile", data);
      if (!response) throw new Error("Failed to update profile");
      return response.data;
    },
    // onSuccess: (data) => {
    //   queryClient.setQueryData(["user-info"], data);
    // },
    onError: (error: any) => {
      console.error("update profile error:", error);
      throw new Error(error?.response?.data?.message || error?.message || "Failed to update profile");
    },
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

/**
 * Fetch address Info
 */
export function useGetAddress(enabled = true) {
  return useQuery({
    queryKey: ["user-address"],
    queryFn: async () => {
      const response = await http.get("/address");
      const { data } = response.data;
      if (!data) throw new Error("No address data received");
      return data;
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * upsert address Info
 */
export function useUpsertAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      address,
      city,
      state,
      zip,
    }: { address: string; city: string; state: string; zip: string }) => {
      const response = await http.post("/address", { address, city, state, zip });
      if (!response) throw new Error("Failed to update address");
      return response.data;
    },
    onSuccess: (data) => {
      // Update the cached query instantly
      queryClient.setQueryData(["user-address"], data);
    },
    onError: (error: any) => {
      console.error("address error:", error);
      throw new Error(error?.response?.data?.message || error?.message || "Failed to update address");
    },
  });
}