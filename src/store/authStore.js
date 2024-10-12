import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

// axios.defaults.baseURL = "http://localhost:3000";
if (import.meta.env.VITE_isLOCAL === "true") {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL_LOCAL;
} else {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
}
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  authError: null,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  token: null,
  setCookies: (token) => {
    Cookies.set("token", token, {
      expires: 7,
    });
  },
  getCookies: () => {
    return Cookies.get("token");
  },
  clearCookies: () => {
    Cookies.remove("token");
  },
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      console.log(response.data);
      if (JSON.parse(response.data.success)) {
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.msg || "Error in Signup",
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      if (JSON.parse(response.data.success)) {
        set({
          token: response.data.token,
          isAuthenticated: true,
          user: response.data.user,
          error: null,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.msg || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/auth/logout");
      if (JSON.parse(response.data.success)) {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/auth/verify-email", {
        code,
      });
      if (JSON.parse(response.data.success)) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.msg || "Error in Verification",
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get("/api/auth/check-auth");
      if (JSON.parse(response.data.success)) {
        set({
          user: response.data.user,
          isCheckingAuth: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      set({
        authError: error.response.data.msg,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email,
      });
      if (JSON.parse(response.data.success)) {
        set({ isLoading: false, error: null, message: response.data.msg });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.msg || "Error sending password reset link",
      });
      throw error;
    }
  },
  resetPassword: async (password, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/auth/reset-password/" + token, {
        password,
      });
      if (JSON.parse(response.data.success)) {
        set({ isLoading: false, error: null });
      }
    } catch (error) {
      set({
        isLoading: false,
        message: error.response.data.msg || "Error resetting password",
      });
      throw error;
    }
  },
}));
