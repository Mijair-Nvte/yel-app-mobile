// src/app/(app)/change-password.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
      await api.put('/account/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });

      Alert.alert('¡Listo!', 'Tu contraseña se actualizó correctamente.', [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      const fallback = 'No pudimos actualizar la contraseña. Verifica tu contraseña actual.';
      setError(isAxiosError<{ message?: string }>(err) ? err.response?.data?.message ?? fallback : fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Regresar"
          className="h-11 w-11 items-center justify-center rounded-full bg-humo active:opacity-70"
        >
          <Ionicons name="chevron-back" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Icono */}
          <View className="mb-6 h-14 w-14 items-center justify-center rounded-2xl bg-negro">
            <Ionicons name="lock-closed-outline" size={26} color="#FFFFFF" />
          </View>

          {/* Títulos */}
          <Text className="mb-2 text-3xl font-black tracking-tight text-negro">Cambiar contraseña</Text>
          <Text className="mb-8 text-base font-medium leading-relaxed text-gris">
            Usa al menos 8 caracteres para tu nueva contraseña.
          </Text>

          {/* Error */}
          {error && (
            <View className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
              <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
            </View>
          )}

          {/* Formulario */}
          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Contraseña actual</Text>
          <Input
            placeholder="Tu contraseña actual"
            isPassword
            autoComplete="current-password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text className="mb-1.5 ml-1 mt-2 text-xs font-bold text-negro">Nueva contraseña</Text>
          <Input
            placeholder="Mínimo 8 caracteres"
            isPassword
            autoComplete="new-password"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Confirmar nueva contraseña</Text>
          <Input
            placeholder="Repite la nueva contraseña"
            isPassword
            autoComplete="new-password"
            value={newPasswordConfirmation}
            onChangeText={setNewPasswordConfirmation}
          />

          <View className="mt-4">
            <Button
              title={isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              variant="primary"
              isLoading={isLoading}
              onPress={handleChangePassword}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}