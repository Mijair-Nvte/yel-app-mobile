// src/app/_layout.tsx
import '../global.css'; 
import { Stack, ThemeProvider, DarkTheme, DefaultTheme, useRouter, useSegments } from 'expo-router';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAppGroup) {
      // Si no hay sesión y entra a la zona privada, al login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Si ya hay sesión y está en auth, lo mandamos al dashboard
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0B0B0F] items-center justify-center">
        <ActivityIndicator size="large" color="#E24A85" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
     
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </ThemeProvider>
  );
}