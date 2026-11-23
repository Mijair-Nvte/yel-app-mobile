import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

const OTP_LENGTH = 6;

export default function ResetOtpScreen() {
  const router = useRouter();
  const { userId, email } = useLocalSearchParams<{ userId: string; email: string }>();
  const [otp, setOtp] = useState('');
  const [focused, setFocused] = useState(false);
  const { requestOtp, isLoading } = useForgotPassword();

  const otpInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const isComplete = otp.length === OTP_LENGTH;

  const handleNext = () => {
    if (isComplete) {
      router.push({
        pathname: '/(auth)/new-password',
        params: { userId, otp, email },
      });
    }
  };

  const handleResend = async () => {
    if (email) await requestOtp(email);
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

      <View className="mt-4 flex-1 px-6">
        {/* Icono */}
        <View className="mb-6 h-14 w-14 items-center justify-center rounded-2xl bg-negro">
          <Ionicons name="mail-unread-outline" size={26} color="#FFFFFF" />
        </View>

        {/* Títulos */}
        <Text className="mb-2 text-3xl font-black tracking-tight text-negro">
          Revisa tu correo
        </Text>
        <Text className="mb-8 text-base font-medium leading-relaxed text-gris">
          Escribe el código de 6 dígitos que enviamos a{' '}
          <Text className="font-bold text-negro">{email}</Text>
        </Text>

        {/* Casillas del código */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => otpInputRef.current?.focus()}
          className="mb-6 flex-row gap-2"
        >
          {Array.from({ length: OTP_LENGTH }, (_, i) => {
            const isActive = focused && i === Math.min(otp.length, OTP_LENGTH - 1);
            const isFilled = otp[i] !== undefined;

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
                <Text className="text-2xl font-bold text-negro">{otp[i] ?? ''}</Text>
              </View>
            );
          })}
        </TouchableOpacity>

        {/* Input real oculto que captura el código */}
        <TextInput
          ref={otpInputRef}
          value={otp}
          onChangeText={setOtp}
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

        {/* Reenviar */}
        <View className="mb-8 flex-row items-center justify-center">
          <Text className="text-sm font-medium text-gris">¿No lo recibiste? </Text>
          <TouchableOpacity onPress={handleResend} disabled={isLoading}>
            <Text className={`text-sm font-bold underline ${isLoading ? 'text-gris' : 'text-negro'}`}>
              {isLoading ? 'Reenviando...' : 'Reenviar código'}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Continuar"
          variant={isComplete ? 'primary' : 'disabled'}
          onPress={handleNext}
          disabled={!isComplete}
        />
      </View>
    </SafeAreaView>
  );
}