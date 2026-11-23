import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestOtp, isLoading, error, setError } = useForgotPassword();
  const [email, setEmail] = useState('');

  const handleNext = async () => {
    if (!email) {
      setError('Ingresa tu correo electrónico.');
      return;
    }

    const result = await requestOtp(email);

    if (result.success && result.data?.user_id) {
      router.push({
        pathname: '/(auth)/reset-otp',
        params: { userId: result.data.user_id, email },
      });
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
            <Ionicons name="key-outline" size={26} color="#FFFFFF" />
          </View>

          {/* Títulos */}
          <Text className="mb-2 text-3xl font-black tracking-tight text-negro">
            ¿Olvidaste tu contraseña?
          </Text>
          <Text className="mb-8 text-base font-medium leading-relaxed text-gris">
            Escribe tu correo y te enviaremos un código para restablecerla.
          </Text>

          {/* Error */}
          {error && (
            <View className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
              <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
            </View>
          )}

          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <View className="mt-4">
            <Button
              title={isLoading ? 'Enviando...' : 'Enviar código'}
              variant="primary"
              isLoading={isLoading}
              onPress={handleNext}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}