import { create } from "zustand";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  authError: null,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      if (JSON.parse(response.data.success)) {
        set({
          user: response.data.user,
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
      set({
        user: response.data.user,
        isCheckingAuth: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        authError: error.response.data.msg,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },
}));
