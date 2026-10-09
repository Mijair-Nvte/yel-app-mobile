// src/app/(app)/(tabs)/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/profile/useProfile';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user, isLoading, refetch } = useProfile();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (isLoading && !user) {
    return (
      <SafeAreaView className="flex-1 bg-[#0B0B0F] justify-center items-center">
        <ActivityIndicator size="large" color="#E24A85" />
      </SafeAreaView>
    );
  }

  const fullName = [user?.profile?.first_name, user?.profile?.last_name].filter(Boolean).join(' ') || 'Mi Cuenta';

  return (
  <ScreenWrapper statusBarStyle="dark" >
      <ScrollView className="px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>

        <Text className="text-white text-2xl font-bold mb-6 text-center">My Profile</Text>

        {/* Avatar y Datos Dinámicos */}
        <View className="items-center mb-8">
          {user?.profile?.avatar_url ? (
            <Image
              source={{ uri: user.profile.avatar_url }}
              className="w-24 h-24 rounded-full mb-3 border-2 border-[#E24A85] bg-white/5"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-[#E24A85]/20 items-center justify-center mb-3 border-2 border-[#E24A85]">
              <Ionicons name="person" size={45} color="#E24A85" />
            </View>
          )}
          <Text className="text-white text-xl font-bold">{fullName}</Text>
          <Text className="text-white/50 text-sm mt-1">{user?.email}</Text>
        </View>

        {/* Opciones de Menú */}
        <View className="bg-[#161622] border border-white/10 rounded-2xl overflow-hidden mb-6">
          <TouchableOpacity
            onPress={() => router.push('/edit-profile')}
            className="flex-row items-center justify-between p-4 border-b border-white/5"
          >
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={20} color="#E24A85" style={{ marginRight: 12 }} />
              <Text className="text-white font-medium text-base">Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>

          
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500/10 border border-red-500/30 py-4 rounded-2xl items-center flex-row justify-center"
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
          <Text className="text-red-500 font-bold text-base">Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}