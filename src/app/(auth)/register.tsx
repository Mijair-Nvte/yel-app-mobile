import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useRegister } from '@/hooks/auth/useRegister';

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

    // Validamos que result.data y requiresOtp existan de forma segura
    if (result.success && result.data && result.data.requiresOtp) {
      router.push({
        pathname: '/(auth)/verify-register',
        params: { userId: result.data.user_id }
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-tiza">
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-11 h-11 rounded-full items-center justify-center bg-blanco"
        >
          <Ionicons name="chevron-back" size={22} color="#141716" />
        </TouchableOpacity>
        <Text className="text-carbon font-bold text-lg flex-1 text-center mr-11">Sign Up</Text>
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
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

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

          <Input
            placeholder="Confirm Password"
            isPassword
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
          />

          <View className="flex-row items-center mb-6 mt-1 px-1">
            <Switch
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              trackColor={{ false: 'rgba(20,23,22,0.12)', true: '#A6AE93' }}
              thumbColor={'#ffffff'}
            />
            <Text className="text-carbon/60 ml-3 flex-1 text-sm font-medium">
              By proceeding, you agree to receive emails.
            </Text>
          </View>

                 <Button
            title={isLoading ? "Cargando..." : "Sign Up"}
            variant={acceptTerms ? 'primary' : 'disabled'}
            isLoading={isLoading}
            onPress={handleRegister}
            disabled={!acceptTerms || isLoading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-carbon/60 font-medium text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text
                className="text-carbon font-bold text-sm"
                style={{ textDecorationLine: 'underline', textDecorationColor: '#A6AE93' }}
              >
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}