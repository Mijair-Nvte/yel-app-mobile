// src/store/useAuthStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones principales
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
  isLoading: true, // Arranca en true para verificar si hay sesión activa al abrir la app

  setSession: async (user, token) => {
    try {
      // Guardado cifrado a nivel de hardware (Keychain / Keystore)
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      console.error('Error al guardar la sesión de forma segura:', error);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      
      set({ user: null, token: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  restoreSession: async () => {
    try {
      set({ isLoading: true });
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      if (token && userStr) {
        set({ 
          token, 
          user: JSON.parse(userStr), 
          isAuthenticated: true 
        });
      }
    } catch (error) {
      console.error('Error al restaurar la sesión:', error);
      // Si hay corrupción de datos, limpiamos por seguridad
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } finally {
      set({ isLoading: false });
    }
  }
}));