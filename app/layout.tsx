"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>TechStore - Premium Electronics</title>
        <meta name="description" content="Your one-stop shop for premium electronics and gadgets" />
        <meta name="generator" content="v0.app" />
        <link rel="icon" href="/icon-light-32x32.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/icon-dark-32x32.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${geistSans.className} bg-background text-foreground`} suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </body>
    </html>
  )
}