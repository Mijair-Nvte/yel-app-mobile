// src/app/_layout.tsx
import '../global.css'; 
import { Stack, ThemeProvider, DarkTheme, DefaultTheme, useRouter, useSegments, usePathname } from 'expo-router'; // 👈 Importamos usePathname
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname(); 
  
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    const isRoot = pathname === '/'; // 👈 Esto es 100% amigable con TypeScript

    if (!isAuthenticated && inAppGroup) {
      // Si no hay sesión y entra a la zona privada, al login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuthGroup || isRoot)) {
      // Si ya hay sesión y está en auth O en la pantalla de bienvenida (raíz), 
      // lo mandamos directo al dashboard privado.
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, pathname]); // 👈 agregamos pathname a las dependencias

  if (isLoading) {
    return (
<View className="flex-1 bg-tiza items-center justify-center">
        <ActivityIndicator size="large" color="#E24A85" />
      </View>
    );
  }

  return (
   <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </ThemeProvider>
  );
}