/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { http } from "../config/http";

export interface AnyObject {
    [key: string]: any;
}

export type MutationParameters = {
    url: string;
    formData?: FormData;
    id?: string;
    data?: any;
};

// GET METHOD CONFIGURATION
export function useGet(url: string, key: string, enabled = false) {
    return useQuery({
        queryKey: [key],
        queryFn: async () => {
            const response = await http.get(url);
            return response.data;
        },
        enabled,
        refetchOnWindowFocus: false, // 🔍 prevents refetch when window is focused
        refetchOnReconnect: false,   // 🔌 prevents refetch when network reconnects
        refetchInterval: false,      // ⏲ disables polling
        staleTime: 5 * 60 * 1000,    // 🕒 optional: keep data fresh for 5 minutes
    });
}

// CREATE METHOD CONFIGURATION
export function createMutationConfig(queryClient: any, key: string) {
    return {
        mutationFn: async ({ url, formData }: MutationParameters) => {
            const response = await http.post(url, formData);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: [key] });
            queryClient.setQueryData([key], (oldData: any) => {
                if (!oldData || !oldData.data) {
                    return oldData;
                }
                const newData = Array.isArray(oldData.data)
                    ? [...oldData.data, data.data]
                    : oldData.data;
                return { ...oldData, data: newData };
            });
        },
    };
}

// UPDATE METHOD CONFIGURATION FORM DATA
export function updateFormMutationConfig(queryClient: any, key: string) {
    return {
        mutationFn: async ({ url, formData }: MutationParameters) => {
            const response = await http.put(url, formData);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: [key] });
            queryClient.setQueryData([key], (oldData: any) => {
                if (!oldData || !oldData.data || !Array.isArray(oldData.data)) {
                    return oldData;
                }
                const filterData = oldData.data.filter(
                    (item: any) => item._id !== data.data._id,
                );
                const newData = [...filterData, data.data];
                return { ...oldData, data: newData };
            });
        },
    };
}

// DELETE METHOD CONFIGURATION
export function deleteMutationConfig(queryClient: any, key: string) {
    return {
        mutationFn: async (url: string) => {
            const id = url.substring(url.lastIndexOf("/") + 1);
            await http.delete(url);
            return id;
        },
        onSuccess: (id: string) => {
            queryClient.invalidateQueries({ queryKey: [key] });
            queryClient.setQueryData([key], (oldData: any) => {
                if (!oldData || !oldData.data || !Array.isArray(oldData.data)) {
                    return oldData;
                }
                const filterData = oldData.data.filter((item: any) => item._id !== id);
                return { ...oldData, data: filterData };
            });
        },
    };
}

// CREATE JSON METHOD CONFIGURATION
export function createJsonMutationConfig(queryClient: any, key: string) {
    return {
        mutationFn: async ({ url, data }: MutationParameters) => {
            const response = await http.post(url, data);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: [key] });
            queryClient.setQueryData([key], (oldData: any) => {
                if (!oldData || !oldData.data || !Array.isArray(oldData.data)) {
                    return oldData;
                }
                const newData = [...oldData.data, data.data];
                return { ...oldData, data: newData };
            });
        },
    };
}

// UPDATE METHOD CONFIGURATION JSON DATA
export function updateJsonMutationConfig(queryClient: any, key: string) {
    return {
        mutationFn: async ({ url, data }: MutationParameters) => {
            const response = await http.put(url, data);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: [key] });
            queryClient.setQueryData([key], (oldData: any) => {
                if (!oldData || !oldData.data || !Array.isArray(oldData.data)) {
                    return oldData;
                }
                const filterData = oldData.data.filter(
                    (item: any) => item._id !== data.data._id,
                );
                const newData = [...filterData, data.data];
                return { ...oldData, data: newData };
            });
        },
    };
}