// src/app/(app)/change-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { api } from '@/services/api';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setError(null);

    if (!currentPassword || !newPassword || !newPasswordConfirmation) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      setIsLoading(true);
      // Endpoint estándar para cambio de contraseña con sesión activa
      await api.put('/account/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });

      Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada correctamente.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña. Verifica tu contraseña actual.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper statusBarStyle="dark" >
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 ">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 border border-black/5"
        >
          <Ionicons name="chevron-back" size={20} color="#1A0811" />
        </TouchableOpacity>
        <Text className="text-[#1A0811] font-bold text-lg flex-1 text-center mr-10">Cambiar Contraseña</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {error && (
          <View className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-6">
            <Text className="text-red-600 text-sm text-center font-medium">{error}</Text>
          </View>
        )}

        {/* Formulario */}
        <View className="mb-8">
          <View>
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">Contraseña Actual</Text>
            <TextInput 
              value={currentPassword} 
              onChangeText={setCurrentPassword} 
              placeholder="••••••••" 
              placeholderTextColor="#9CA3AF" 
              secureTextEntry
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>

          <View className="mt-5">
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">Nueva Contraseña</Text>
            <TextInput 
              value={newPassword} 
              onChangeText={setNewPassword} 
              placeholder="••••••••" 
              placeholderTextColor="#9CA3AF" 
              secureTextEntry
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>

          <View className="mt-5">
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">Confirmar Nueva Contraseña</Text>
            <TextInput 
              value={newPasswordConfirmation} 
              onChangeText={setNewPasswordConfirmation} 
              placeholder="••••••••" 
              placeholderTextColor="#9CA3AF" 
              secureTextEntry
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={isLoading}
          className={`py-4 rounded-2xl items-center shadow-md bg-[#E24A85] ${isLoading ? 'opacity-70' : 'active:scale-[0.98]'}`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Actualizar Contraseña</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}