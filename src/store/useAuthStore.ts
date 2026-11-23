// src/store/useAuthStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loginPurchases, logoutPurchases } from '@/services/purchases/purchases';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setSession: (user: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const TOKEN_KEY = 'yel_secure_auth_token';
const USER_KEY = 'yel_secure_user_data';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: async (user, token) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user, token, isAuthenticated: true });

      // RevenueCat va al final y nunca lanza error: no bloquea el login
      if (user?.id) await loginPurchases(user.id);
    } catch (error: unknown) {
      console.error('Error al guardar la sesión de forma segura:', error);
    }
  },

  logout: async () => {
    try {
      await logoutPurchases();
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error: unknown) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Siempre limpiamos el estado, aunque falle algo arriba
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  restoreSession: async () => {
    try {
      set({ isLoading: true });
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      if (token && userStr) {
        const parsedUser = JSON.parse(userStr);
        set({ token, user: parsedUser, isAuthenticated: true });

        if (parsedUser?.id) await loginPurchases(parsedUser.id);
      }
    } catch (error: unknown) {
      console.error('Error al restaurar la sesión:', error);
      // Solo llega aquí si los datos guardados están corruptos, ya no por RevenueCat
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } finally {
      set({ isLoading: false });
    }
  },
}));