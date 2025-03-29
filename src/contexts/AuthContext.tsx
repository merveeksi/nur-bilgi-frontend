"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService, 
  getCurrentUser, 
  isAuthenticated, 
  User,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService
} from "@/services/authService";

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

// Create provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to get current user", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const loggedInUser = await loginService({ 
        Email: email, 
        Password: password, 
        RememberMe: rememberMe 
      });
      setUser(loggedInUser);
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ad ve soyadı birleştir - API'nin beklediği formatta
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      
      const newUser = await registerService({
        Email: email,
        Password: password,
        FullName: fullName
      });
      setUser(newUser);
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Şifre sıfırlama isteği gönderme fonksiyonu
  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await forgotPasswordService(email);
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Şifre sıfırlama işlemi tamamlama fonksiyonu
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await resetPasswordService(token, newPassword);
    } catch (error) {
      setError((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 