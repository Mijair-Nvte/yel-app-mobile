// src/app/_layout.tsx
import '../global.css';
import { Stack, ThemeProvider, DefaultTheme, useRouter, useSegments, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { initPurchases } from '@/services/purchases/purchases';

// Fuera del componente: se configura una vez y ANTES de restoreSession (que hace logIn)
initPurchases();

export default function RootLayout() {
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
    const isRoot = pathname === '/';

    if (!isAuthenticated && inAppGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuthGroup || isRoot)) {
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, pathname]);

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