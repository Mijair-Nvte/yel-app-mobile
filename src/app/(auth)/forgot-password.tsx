import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { requestOtp, isLoading, error, setError } = useForgotPassword();
    const [email, setEmail] = useState('');

    const handleNext = async () => {
        if (!email) {
            setError('Ingresa tu correo electrónico.');
            return;
        }

        const result = await requestOtp(email);

        if (result.success && result.data?.user_id) {
            // Pasamos el userId y el email a la siguiente pantalla
            router.push({
                pathname: '/(auth)/reset-otp',
                params: { userId: result.data.user_id, email }
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0B0B0F]">
            <View className="flex-row items-center px-5 py-3">
                <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-full items-center justify-center bg-white/10 border border-white/10">
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg flex-1 text-center mr-11">Recuperar</Text>
            </View>

            <View className="px-6 mt-10 flex-1">
                <Text className="text-white text-3xl font-bold mb-2 text-center">¿Olvidaste tu contraseña?</Text>
                <Text className="text-white/60 text-base text-center mb-10">Ingresa tu correo electrónico y te enviaremos un código de seguridad para restablecerla.</Text>

                {error && <Text className="text-red-500 text-sm mb-4 text-center bg-red-500/10 p-3 rounded-xl">{error}</Text>}

                <Input
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <View className="mt-6">
                    <Button
                        title={isLoading ? "Enviando..." : "Enviar Código"}
                        variant={isLoading ? 'disabled' : 'primary'}
                        onPress={handleNext}
                        disabled={isLoading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}