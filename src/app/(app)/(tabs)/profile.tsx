// src/app/(app)/(tabs)/profile.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/profile/useProfile';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { isPurchasesAvailable, restorePurchases } from '@/services/purchases/purchases';

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user, isLoading, deleteAccount } = useProfile();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es permanente. Se borrarán tu cuenta, tu progreso y tus inscripciones.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteAccount();
            if (success) {
              await logout();
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  // Requisito de Apple para compras únicas (non-consumables)
  const handleRestorePurchases = async () => {
    if (!isPurchasesAvailable()) {
      Alert.alert('No disponible', 'Restaurar compras solo funciona en la app instalada desde la tienda.');
      return;
    }

    try {
      setIsRestoring(true);
      const restored = await restorePurchases();

      if (restored.length === 0) {
        Alert.alert('Sin compras', 'No encontramos compras asociadas a tu cuenta de Apple.');
      } else {
        Alert.alert(
          'Compras restauradas',
          `Recuperamos ${restored.length} ${restored.length === 1 ? 'compra' : 'compras'}. Tus cursos estarán disponibles en "Mis cursos".`
        );
      }
    } catch {
      Alert.alert('Error', 'No pudimos restaurar tus compras. Intenta de nuevo.');
    } finally {
      setIsRestoring(false);
    }
  };

  if (isLoading && !user) {
    return (
      <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </ScreenWrapper>
    );
  }

  const fullName =
    [user?.profile?.first_name, user?.profile?.last_name].filter(Boolean).join(' ') || 'Mi cuenta';

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-6 text-3xl font-black tracking-tight text-negro">Perfil</Text>

        {/* Tarjeta de usuario */}
        <View className="mb-8 flex-row items-center rounded-3xl bg-negro p-5">
          {user?.profile?.avatar_url ? (
            <Image
              source={{ uri: user.profile.avatar_url }}
              className="h-16 w-16 rounded-full bg-carbon"
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full bg-carbon">
              <Ionicons name="person" size={28} color="#FFFFFF" />
            </View>
          )}
          <View className="ml-4 flex-1">
            <Text className="text-lg font-extrabold tracking-tight text-blanco" numberOfLines={1}>
              {fullName}
            </Text>
            <Text className="mt-0.5 text-sm text-blanco/60" numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Cuenta */}
        <Text className="mb-3 ml-1 text-[11px] font-bold uppercase tracking-widest text-gris">Cuenta</Text>
        <View className="mb-6 overflow-hidden rounded-3xl border border-niebla bg-blanco">
          <TouchableOpacity
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.7}
            className="flex-row items-center justify-between border-b border-niebla px-5 py-4"
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-humo">
                <Ionicons name="person-outline" size={18} color="#000000" />
              </View>
              <Text className="text-base font-semibold text-negro">Editar perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/change-password')}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-5 py-4"
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-humo">
                <Ionicons name="lock-closed-outline" size={18} color="#000000" />
              </View>
              <Text className="text-base font-semibold text-negro">Cambiar contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
          </TouchableOpacity>
        </View>

        {/* Compras */}
        <Text className="mb-3 ml-1 text-[11px] font-bold uppercase tracking-widest text-gris">Compras</Text>
        <View className="mb-8 overflow-hidden rounded-3xl border border-niebla bg-blanco">
          <TouchableOpacity
            onPress={handleRestorePurchases}
            disabled={isRestoring}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-5 py-4"
          >
            <View className="flex-1 flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-humo">
                <Ionicons name="refresh-outline" size={18} color="#000000" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-negro">Restaurar compras</Text>
                <Text className="mt-0.5 text-xs text-gris">Recupera los cursos que ya compraste</Text>
              </View>
            </View>
            {isRestoring ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
            )}
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.85}
          className="mb-4 h-14 flex-row items-center justify-center rounded-full border border-niebla bg-blanco"
        >
          <Ionicons name="log-out-outline" size={20} color="#000000" style={{ marginRight: 8 }} />
          <Text className="text-base font-bold text-negro">Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Eliminar cuenta (requisito de Apple) */}
        <TouchableOpacity onPress={handleDeleteAccount} className="items-center py-3">
          <Text className="text-sm font-semibold text-red-600">Eliminar mi cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}