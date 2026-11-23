import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/auth/useLogin';
import { authService } from '@/services/auth.service';

const LOGO: number = require('../../../assets/images/logo/Crealo_logo_negro.png');


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
          params: { userId: result.data.user_id },
        });
      }
    } else if (result.needsVerification) {
      Alert.alert(
        'Correo no verificado',
        'Te reenviaremos un código de activación a tu correo para que puedas validarlo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Enviar código',
            onPress: async () => {
              try {
                const res = await authService.requestVerification(email);
                router.push({
                  pathname: '/(auth)/verify-login',
                  params: { userId: res.user_id },
                });
              } catch {
                Alert.alert('Error', 'No pudimos reenviar el código.');
              }
            },
          },
        ]
      );
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
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="mb-8 mt-2 items-center">
            <Image
              source={LOGO}
              style={styles.logo}
              contentFit="contain"
              accessibilityLabel="Créalo by KNN"
            />
          </View>

          {/* Títulos */}
          <Text className="mb-2 text-3xl font-black tracking-tight text-negro">
            Inicia sesión
          </Text>
          <Text className="mb-8 text-base font-medium text-gris">
            Accede a tus cursos y eventos.
          </Text>

          {/* Error */}
          {error && (
            <View className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
              <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
            </View>
          )}

          {/* Formulario */}
          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            placeholder="Contraseña"
            isPassword
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            className="mb-8 mt-1 items-end"
          >
            <Text className="text-sm font-semibold text-grafito">¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <Button
            title={isLoading ? 'Ingresando...' : 'Iniciar sesión'}
            variant="primary"
            isLoading={isLoading}
            onPress={handleLogin}
            disabled={isLoading}
          />

          {/* Registro */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-sm font-medium text-gris">¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-sm font-bold text-negro underline">Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Manual: mínimo 140 px de ancho
  logo: {
    width: 150,
    height: 110,
  },
});