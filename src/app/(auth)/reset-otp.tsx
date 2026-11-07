import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export default function ResetOtpScreen() {
  const router = useRouter();
  const { userId, email } = useLocalSearchParams<{ userId: string, email: string }>();
  const [otp, setOtp] = useState('');
  const { requestOtp, isLoading } = useForgotPassword();

  const handleNext = () => {
    if (otp.length === 6) {
      router.push({
        pathname: '/(auth)/new-password',
        params: { userId, otp, email }
      });
    }
  };

  const handleResend = async () => {
    if (email) await requestOtp(email);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F]">
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full items-center justify-center bg-white/10 border border-white/10">
          <Ionicons name="chevron-back" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View className="px-6 mt-10 flex-1">
        <Text className="text-white text-3xl font-bold mb-2 text-center">Verifica tu código</Text>
        <Text className="text-white/60 text-base text-center mb-10">Ingresa el código de 6 dígitos que enviamos a {email}</Text>

        <Input
          placeholder="Código de 6 dígitos"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity onPress={handleResend} disabled={isLoading} className="mt-4 mb-8">
          <Text className="text-[#E24A85] text-center font-bold text-sm">
            {isLoading ? "Reenviando..." : "¿No lo recibiste? Reenviar código"}
          </Text>
        </TouchableOpacity>

        <Button
          title="Continuar"
          variant={otp.length === 6 ? 'primary' : 'disabled'}
          onPress={handleNext}
          disabled={otp.length !== 6}
        />
      </View>
    </SafeAreaView>
  );
}