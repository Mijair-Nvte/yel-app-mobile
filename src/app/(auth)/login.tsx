
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useLogin } from '@/hooks/auth/useLogin';
import { authService } from '@/services/auth.service'; // Para reenviar código si es necesario

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, setError } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    const result = await login({ email, password });

    if (result.success && result.data) {
      if (result.data.require_otp) {
        router.push({
          pathname: '/(auth)/verify-login',
          params: { userId: result.data.user_id }
        });
      }
    } else if (result.needsVerification) {
      Alert.alert(
        'Correo no verificado',
        'Te reenviaremos un código de activación a tu correo para que puedas validarlo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Enviar Código',
            onPress: async () => { // 👈 Corregido aquí (onPress en lugar de press)
              try {
                const res = await authService.requestVerification(email);
                router.push({
                  pathname: '/(auth)/verify-login',
                  params: { userId: res.user_id }
                });
              } catch (e) {
                Alert.alert('Error', 'No pudimos reenviar el código.');
              }
            }
          }
        ]
      );
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
        <Text className="text-white font-bold text-lg flex-1 text-center mr-11">Log In</Text>
      </View>

      <View className="px-6 mt-6 flex-1">
        <Logo />

        {error && <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>}

        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity className="mb-8 mt-2 items-end">
          <Text className="text-white/60 text-sm">¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button
          title={isLoading ? "Cargando..." : "Log In"}
          variant={isLoading ? 'disabled' : 'primary'}
          onPress={handleLogin}
          disabled={isLoading}
        />

        <View className="flex-row justify-center mt-auto mb-8">
          <Text className="text-white/50 text-base">¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-[#E24A85] font-bold text-base">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}