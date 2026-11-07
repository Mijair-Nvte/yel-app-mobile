import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export default function NewPasswordScreen() {
  const router = useRouter();
  const { userId, otp, email } = useLocalSearchParams<{ userId: string, otp: string, email: string }>();
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
      Alert.alert('¡Listo!', 'Tu contraseña ha sido actualizada.', [
        { text: 'Ir a Login', onPress: () => router.dismissAll() } // Cierra todo y vuelve al login
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F]">
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full items-center justify-center bg-white/10 border border-white/10">
          <Ionicons name="chevron-back" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View className="px-6 mt-10 flex-1">
        <Text className="text-white text-3xl font-bold mb-2 text-center">Nueva contraseña</Text>
        <Text className="text-white/60 text-base text-center mb-10">Crea una nueva contraseña segura para {email}.</Text>

        {error && <Text className="text-red-500 text-sm mb-4 text-center bg-red-500/10 p-3 rounded-xl">{error}</Text>}

        <View className="gap-y-4 mb-8">
          <Input
            placeholder="Nueva Contraseña"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          <Input
            placeholder="Confirmar Contraseña"
            isPassword
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
          />
        </View>

        <Button
          title={isLoading ? "Guardando..." : "Guardar contraseña"}
          variant={isLoading || !password ? 'disabled' : 'primary'}
          onPress={handleSave}
          disabled={isLoading || !password}
        />
      </View>
    </SafeAreaView>
  );
}