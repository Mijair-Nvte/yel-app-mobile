import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { useVerifyRegistration } from '@/hooks/auth/useVerifyRegistration';
import { useAuthStore } from '@/store/useAuthStore';

const OTP_LENGTH = 6;

export default function VerifyRegisterScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [otpCode, setOtpCode] = useState('');
  const [focused, setFocused] = useState(false);

  const otpInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const { verify, isLoading, error, setError } = useVerifyRegistration();
  const setSession = useAuthStore((state) => state.setSession);

  const handleVerify = async () => {
    if (otpCode.length !== OTP_LENGTH) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    const result = await verify({
      user_id: Number(userId),
      otp: otpCode,
    });

    if (result.success) {
      await setSession(result.data.user, result.data.token);

      Alert.alert('¡Cuenta verificada!', 'Bienvenido a Créalo.', [
        { text: 'Entrar', onPress: () => router.replace('/(app)/(tabs)') },
      ]);
    }
  };

  const isComplete = otpCode.length === OTP_LENGTH;

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

      <View className="mt-4 flex-1 px-6">
        {/* Icono */}
        <View className="mb-6 h-14 w-14 items-center justify-center rounded-2xl bg-negro">
          <Ionicons name="mail-open-outline" size={26} color="#FFFFFF" />
        </View>

        {/* Títulos */}
        <Text className="mb-2 text-3xl font-black tracking-tight text-negro">
          Activa tu cuenta
        </Text>
        <Text className="mb-8 text-base font-medium leading-relaxed text-gris">
          Enviamos un código de 6 dígitos a tu correo para confirmar que es tuyo.
        </Text>

        {/* Error */}
        {error && (
          <View className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
            <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
          </View>
        )}

        {/* Casillas del código */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => otpInputRef.current?.focus()}
          className="mb-8 flex-row gap-2"
        >
          {Array.from({ length: OTP_LENGTH }, (_, i) => {
            const isActive = focused && i === Math.min(otpCode.length, OTP_LENGTH - 1);
            const isFilled = otpCode[i] !== undefined;

            return (
              <View
                key={i}
                className={`flex-1 items-center justify-center rounded-2xl border ${
                  isActive
                    ? 'border-negro bg-blanco'
                    : isFilled
                    ? 'border-niebla bg-humo'
                    : 'border-niebla bg-blanco'
                }`}
                style={{ aspectRatio: 0.85 }}
              >
                <Text className="text-2xl font-bold text-negro">{otpCode[i] ?? ''}</Text>
              </View>
            );
          })}
        </TouchableOpacity>

        {/* Input real oculto que captura el código */}
        <TextInput
          ref={otpInputRef}
          value={otpCode}
          onChangeText={setOtpCode}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={OTP_LENGTH}
          autoFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          caretHidden
          style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        />

        <Button
          title={isLoading ? 'Verificando...' : 'Confirmar cuenta'}
          variant={isComplete ? 'primary' : 'disabled'}
          isLoading={isLoading}
          onPress={handleVerify}
          disabled={isLoading || !isComplete}
        />
      </View>
    </SafeAreaView>
  );
}