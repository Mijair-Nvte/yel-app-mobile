import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useLogin } from '@/hooks/auth/useLogin';
import { authService } from '@/services/auth.service';

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
            onPress: async () => { 
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
    <SafeAreaView className="flex-1 bg-tiza">
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full items-center justify-center bg-blanco"
        >
          <Ionicons name="chevron-back" size={22} color="#141716" />
        </TouchableOpacity>
        <Text className="text-carbon font-bold text-lg flex-1 text-center mr-11">Log In</Text>
      </View>

      <View className="px-6 mt-6 flex-1">
        <Logo />

        <View className="bg-blanco rounded-[32px] p-6 shadow-sm shadow-carbon/10">
          {error && (
            <View className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl mb-4">
              <Text className="text-red-600 text-sm text-center font-medium">{error}</Text>
            </View>
          )}

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

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            className="mb-6 mt-1 items-end"
          >
            <Text className="text-carbon/60 font-medium text-sm">¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

                  <Button
            title={isLoading ? "Cargando..." : "Log In"}
            variant="primary"
            isLoading={isLoading}
            onPress={handleLogin}
            disabled={isLoading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-carbon/60 font-medium text-sm">¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text
                className="text-carbon font-bold text-sm"
                style={{ textDecorationLine: 'underline', textDecorationColor: '#A6AE93' }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}