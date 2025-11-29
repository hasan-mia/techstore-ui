"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    createJsonMutationConfig,
    deleteMutationConfig,
    type MutationParameters,
    updateJsonMutationConfig,
    useGet,
} from "@/api/api"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useUploadFiles } from "@/api/file"
import useCustomToast from "@/hooks/use-custom-toast"

export default function useProducts(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingImages, setUploadingImages] = useState(false)

    // File upload mutation
    const uploadMutation = useUploadFiles()

    // Initial form state
    const initialFormState = {
        name: "",
        description: "",
        price: "",
        images: [] as string[],
        category_id: "",
        stock: "",
        rating: "",
        reviews: "",
        status: "active" as "active" | "out_of_stock",
    }

    const [formState, setFormState] = useState(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // --- LIST PRODUCTS ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/products/?page=${page}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search || "")}`,
        "products_list",
        pageName === "products",
    )

    // --- GET SINGLE PRODUCT ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/products/${id}` : "",
        `product_detail_${id}`,
        pageName === "update" && !!id,
    )

    // --- GET CATEGORIES (for dropdown) ---
    const {
        data: categoriesData,
        isPending: categoriesLoading,
    } = useGet(
        `/categories?page=1&limit=100`,
        "categories_all",
        true, // Always fetch categories
    )

    // Reset form state when ID changes or mode changes
    useEffect(() => {
        if (pageName === "update" && id) {
            setFormState(initialFormState)
        } else if (pageName !== "update") {
            setFormState(initialFormState)
        }
    }, [id, pageName])

    // Populate form state with details data
    useEffect(() => {
        if (details?.data && pageName === "update") {
            setFormState({
                name: details.data.name || "",
                description: details.data.description || "",
                price: details.data.price || "",
                images: details.data.images || [],
                category_id: details.data.category_id || "",
                stock: details.data.stock?.toString() || "",
                rating: details.data.rating || "",
                reviews: details.data.reviews?.toString() || "",
                status: details.data.status || "active",
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "products_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "products_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "products_list"))

    // --- UPLOAD IMAGES ---
    const onUploadImages = async (files: File[]) => {
        if (!files || files.length < 2) {
            toast.error("Minimum 2 image should upload")
            return
        }

        setUploadingImages(true)
        try {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append("file", file)
            })

            const response = await uploadMutation.mutateAsync(formData)

            if (response?.success && response?.data) {
                // Append new images to existing ones
                setFormState((prev) => ({
                    ...prev,
                    images: [...prev.images, ...response.data],
                }))
                toast.success(`${files.length} image(s) uploaded successfully`)
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Upload failed")
            } else {
                toast.error("Upload failed")
            }
        } finally {
            setUploadingImages(false)
        }
    }

    // Remove image from array
    const removeImage = (index: number) => {
        setFormState((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    // --- CREATE PRODUCT ---
    const createProduct = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
                description: formState.description,
                price: formState.price,
                images: formState.images,
                category_id: formState.category_id,
                stock: formState.stock ? Number.parseInt(formState.stock) : 0,
                rating: formState.rating || "0.0",
                reviews: formState.reviews ? Number.parseInt(formState.reviews) : 0,
                status: formState.status,
            }

            const response = await createMutation.mutateAsync({
                url: '/products',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message)
                router.push("/admin/products")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to create product")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE PRODUCT ---
    const updateProduct = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
                description: formState.description,
                price: formState.price,
                images: formState.images,
                category_id: formState.category_id,
                stock: formState.stock ? Number.parseInt(formState.stock) : 0,
                rating: formState.rating || "0.0",
                reviews: formState.reviews ? Number.parseInt(formState.reviews) : 0,
                status: formState.status,
            }

            const response = await updateMutation.mutateAsync({
                url: `/products/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message)
                queryClient.invalidateQueries({ queryKey: [`product_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["products_list"] })
                router.push("/admin/products")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to update product")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE PRODUCT ---
    const onDeleteProduct = async (id: string) => {
        try {
            const response = await deleteMutation.mutateAsync(`/products/${id}`)
            if (response) {
                toast.success("Product deleted successfully")
                queryClient.invalidateQueries({ queryKey: [`product_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["products_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to delete product")
            } else {
                console.error("An error occurred:", error)
            }
        }
    }

    // Status change
    const handleStatusChange = async (id: string, value: "active" | "out_of_stock") => {
        try {
            const response = await updateMutation.mutateAsync({
                url: `/products/${id}`,
                data: { status: value },
            })

            if (response) {
                toast.success("Status changed successfully")
                queryClient.invalidateQueries({ queryKey: ["products_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {

                toast.error(error?.response?.data?.message || "Failed to change status")
            } else {
                console.error("An error occurred:", error)
            }
        }
    }

    // Handle Pagination
    const handlePageChange = (page: number) => {
        setPage(page)
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "products") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, page, limit, search, pageName])

    // Clear form state when component unmounts
    useEffect(() => {
        return () => {
            if (pageName === "update") {
                setFormState(initialFormState)
            }
        }
    }, [])

    return {
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        handlePageChange,
        handleStatusChange,
        // List
        listData,
        listLoading,
        refetchList,
        listError,
        // Single detail
        details,
        detailLoading,
        refetchDetail,
        // Categories
        categories: categoriesData?.categories || [],
        categoriesLoading,
        // Form
        formState,
        handleInputChange,
        setFormState,
        // Actions
        createProduct,
        updateProduct,
        isLoading,
        // Delete
        onDeleteProduct,
        // Image upload
        uploadingImages,
        onUploadImages,
        removeImage,
    }
}