// src/app/(app)/(tabs)/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/profile/useProfile';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user, isLoading, deleteAccount } = useProfile();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      await logout();
      router.replace('/login');
    }
  };

  if (isLoading && !user) {
    return (
      <ScreenWrapper statusBarStyle="dark" backgroundColor="#F3F4F6">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E24A85" />
        </View>
      </ScreenWrapper>
    );
  }

  const fullName =
    [user?.profile?.first_name, user?.profile?.last_name].filter(Boolean).join(' ') || 'Mi Cuenta';

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#F3F4F6">
      <ScrollView
        className="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#1A0811] text-2xl font-bold mb-6 text-center">My Profile</Text>

        {/* Avatar y Datos Dinámicos */}
        <View className="items-center mb-8">
          {user?.profile?.avatar_url ? (
            <Image
              source={{ uri: user.profile.avatar_url }}
              className="w-24 h-24 rounded-full mb-3 border-2 border-[#E24A85] bg-white"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-[#E24A85]/15 items-center justify-center mb-3 border-2 border-[#E24A85]">
              <Ionicons name="person" size={45} color="#E24A85" />
            </View>
          )}
          <Text className="text-[#1A0811] text-xl font-bold">{fullName}</Text>
          <Text className="text-[#1A0811]/60 text-sm mt-1">{user?.email}</Text>
        </View>

        {/* Opciones de Menú */}
        <View className="bg-white border border-black/5 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <TouchableOpacity
            onPress={() => router.push('/edit-profile')}
            className="flex-row items-center justify-between p-4 border-b border-black/5"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="person-outline"
                size={20}
                color="#E24A85"
                style={{ marginRight: 12 }}
              />
              <Text className="text-[#1A0811] font-medium text-base">Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(26,8,17,0.35)" />
          </TouchableOpacity>

          {/* 👇 NUEVA OPCIÓN: CAMBIAR CONTRASEÑA */}
          <TouchableOpacity
            onPress={() => router.push('/change-password')}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#E24A85"
                style={{ marginRight: 12 }}
              />
              <Text className="text-[#1A0811] font-medium text-base">Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(26,8,17,0.35)" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500/10 border border-red-500/30 py-4 rounded-2xl items-center flex-row justify-center mb-3"
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
          <Text className="text-red-500 font-bold text-base">Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="bg-red-500/10 border border-red-500/30 py-4 rounded-2xl items-center flex-row justify-center"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
          <Text className="text-red-500 font-bold text-base">Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}