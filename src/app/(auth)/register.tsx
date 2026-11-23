import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
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
import { useRegister } from '@/hooks/auth/useRegister';

const LOGO: number = require('../../../assets/images/logo/Crealo_logo_negro.png');

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, setError } = useRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const result = await register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    if (result.success && result.data && result.data.requiresOtp) {
      router.push({
        pathname: '/(auth)/verify-register',
        params: { userId: result.data.user_id },
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
            Crea tu cuenta
          </Text>
          <Text className="mb-8 text-base font-medium text-gris">
            Empieza a aprender con cursos y eventos.
          </Text>

          {/* Error */}
          {error && (
            <View className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3">
              <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
            </View>
          )}

          {/* Formulario */}
          <Input
            placeholder="Nombre completo"
            autoCapitalize="words"
            autoComplete="name"
            value={name}
            onChangeText={setName}
          />

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

          {/* Aceptación */}
          <View className="mb-8 mt-1 flex-row items-center px-1">
            <Switch
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              trackColor={{ false: '#E5E5E5', true: '#000000' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
            <Text className="ml-3 flex-1 text-sm font-medium text-grafito">
              Acepto recibir correos de Créalo.
            </Text>
          </View>

          <Button
            title={isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            variant={acceptTerms ? 'primary' : 'disabled'}
            isLoading={isLoading}
            onPress={handleRegister}
            disabled={!acceptTerms || isLoading}
          />

          {/* Login */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-sm font-medium text-gris">¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-sm font-bold text-negro underline">Inicia sesión</Text>
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