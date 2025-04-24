// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import { ThemeProvider } from "@/components/theme-provider"
import "./styles/index.css"
import { Toaster } from "@/components/ui/sonner"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import { AuthProvider } from './hooks/useAuth'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     
     <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
    
  </React.StrictMode>
)
