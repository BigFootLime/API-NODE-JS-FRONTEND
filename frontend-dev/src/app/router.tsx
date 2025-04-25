import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/login/Login";
import SignUpPage from "@/features/auth/pages/login/SignUp";
import DashboardPage from "@/features/dashboard/pages/page";
import { MasterPasswordProvider } from '../context/MasterPasswordContext'

// Ici, nous allons envelopper toutes les routes qui nécessitent l'accès au contexte de mot de passe maître dans le provider
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/dashboard",
    element: (
      <MasterPasswordProvider>
        <DashboardPage />
      </MasterPasswordProvider>
    ), // Le DashboardPage est maintenant enveloppé dans MasterPasswordProvider
  },
]);
