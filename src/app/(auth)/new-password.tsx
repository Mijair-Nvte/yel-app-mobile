import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export default function NewPasswordScreen() {
  const router = useRouter();
  const { userId, otp, email } = useLocalSearchParams<{ userId: string; otp: string; email: string }>();
  const { resetPassword, isLoading, error, setError } = useForgotPassword();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSave = async () => {
    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const result = await resetPassword(Number(userId), otp, password, passwordConfirmation);

    if (result.success) {
      Alert.alert('¡Listo!', 'Tu contraseña se actualizó correctamente.', [
        { text: 'Iniciar sesión', onPress: () => router.dismissAll() },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blanco">
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
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Icono */}
          <View className="mb-6 h-14 w-14 items-center justify-center rounded-2xl bg-negro">
            <Ionicons name="lock-closed-outline" size={26} color="#FFFFFF" />
          </View>

          {/* Títulos */}
          <Text className="mb-2 text-3xl font-black tracking-tight text-negro">
            Nueva contraseña
          </Text>
          <Text className="mb-8 text-base font-medium leading-relaxed text-gris">
            Crea una contraseña segura para{' '}
            <Text className="font-bold text-negro">{email}</Text>
          </Text>

          {/* Error */}
          {error && (
            <View className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
              <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
            </View>
          )}

          <Input
            placeholder="Nueva contraseña"
            isPassword
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />
          <Input
            placeholder="Confirmar contraseña"
            isPassword
            autoComplete="new-password"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
          />

          <View className="mt-4">
            <Button
              title={isLoading ? 'Guardando...' : 'Guardar contraseña'}
              variant={password ? 'primary' : 'disabled'}
              isLoading={isLoading}
              onPress={handleSave}
              disabled={isLoading || !password}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}