import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVerifyRegistration } from '@/hooks/auth/useVerifyRegistration';
import { useAuthStore } from '@/store/useAuthStore';
export default function VerifyRegisterScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [otpCode, setOtpCode] = useState('');

  // Usamos el nuevo hook para mantener la lógica separada de la vista
  const { verify, isLoading, error, setError } = useVerifyRegistration();
  const setSession = useAuthStore((state) => state.setSession);
  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    const result = await verify({
      user_id: Number(userId),
      otp: otpCode,
    });

    if (result.success) {
      // 💾 Guardado cifrado tras verificar su cuenta nueva
      await setSession(result.data.user, result.data.token);

Alert.alert('¡Cuenta Verificada!', 'Bienvenido a la comunidad.', [
        { text: 'Entrar', onPress: () => router.replace('/(app)/(tabs)') } // 👈 Actualizado al grupo (app)
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F]">
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full items-center justify-center bg-white/10 border border-white/10"
        >
          <Ionicons name="chevron-back" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg flex-1 text-center mr-11">Activa tu Cuenta</Text>
      </View>

      <View className="px-6 mt-10 flex-1">
        <Text className="text-white text-2xl font-bold mb-2">Verifica tu correo</Text>
        <Text className="text-white/60 mb-8">
          Te hemos enviado un código de 6 dígitos para activar tu cuenta.
        </Text>

        {error && <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>}

        <Input
          placeholder="Código de 6 dígitos"
          keyboardType="number-pad"
          maxLength={6}
          value={otpCode}
          onChangeText={setOtpCode}
          className="text-center text-xl tracking-widest"
        />

        <Button
          title={isLoading ? "Verificando..." : "Confirmar Cuenta"}
          variant={isLoading || otpCode.length !== 6 ? 'disabled' : 'primary'}
          onPress={handleVerify}
          disabled={isLoading || otpCode.length !== 6}
          className="mt-6"
        />
      </View>
    </SafeAreaView>
  );
}