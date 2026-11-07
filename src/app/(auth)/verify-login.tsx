import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/auth/useLogin';
import { useAuthStore } from '@/store/useAuthStore';

export default function VerifyLoginScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [otpCode, setOtpCode] = useState('');
  const [focused, setFocused] = useState(false);
  
  // 1. SOLUCIÓN AL ERROR DE TYPESCRIPT: Usamos <any> para evitar el conflicto 
  // estricto de tipos entre las interfaces de React Native.
  const otpInputRef = useRef<any>(null);

  const { verifyOtp, isLoading, error, setError } = useLogin();
  const setSession = useAuthStore((state) => state.setSession);

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    const result = await verifyOtp({
      user_id: Number(userId),
      otp: otpCode,
    });

    if (result.success) {
      // Retrasamos el guardado un instante. Esto permite que el hook useLogin termine 
      // su renderizado visual (quitando el isLoading) antes de que el Layout nos cambie de pantalla.
      setTimeout(async () => {
        await setSession(result.data.user, result.data.token);
      }, 150); 
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
        <Text className="text-carbon font-bold text-lg flex-1 text-center mr-11">Verificación</Text>
      </View>

      <View className="px-6 mt-8 flex-1">
        <Text className="text-carbon text-3xl font-extrabold mb-3 tracking-tight">Autenticación de 2 Pasos</Text>
        <Text className="text-carbon/70 font-medium text-base mb-8 leading-relaxed">
          Por tu seguridad, hemos enviado un código de acceso a tu correo electrónico.
        </Text>

        <View className="bg-blanco rounded-[32px] p-6 shadow-sm shadow-carbon/10">
          {error && (
            <View className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl mb-4">
              <Text className="text-red-600 text-sm text-center font-medium">{error}</Text>
            </View>
          )}

          {/* Icono decorativo */}
          <View className="items-center mb-6">
            <View className="w-14 h-14 rounded-2xl bg-salvia/30 items-center justify-center">
              <Ionicons name="shield-checkmark-outline" size={26} color="#141716" />
            </View>
          </View>

          {/* Casillas redondas del código (TU DISEÑO ORIGINAL) */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => otpInputRef.current?.focus()}
            className="flex-row gap-2 mb-6"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const isActive = focused && i === Math.min(otpCode.length, 5);
              return (
                <View
                  key={i}
                  className="flex-1 rounded-full bg-blanco items-center justify-center"
                  style={{
                    aspectRatio: 1,
                    borderWidth: 1,
                    borderColor: isActive ? 'rgba(166,174,147,0.9)' : 'rgba(166,174,147,0.35)',
                  }}
                >
                  <Text className="text-carbon text-xl font-bold">{otpCode[i] ?? ''}</Text>
                </View>
              );
            })}
          </TouchableOpacity>

          {/* Input real oculto que captura el código */}
          <TextInput
            ref={otpInputRef}
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            caretHidden
            style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
          />

          {/* 
            2. SOLUCIÓN AL ERROR LINKINGCONTEXT: 
            Se usa `undefined` en lugar de `{}` cuando no está cargando para evitar 
            que NativeWind colapse el renderizado del botón al desmontarse la pantalla.
          */}
                 <Button
            title={isLoading ? "Verificando..." : "Ingresar"}
            variant={otpCode.length !== 6 ? 'disabled' : 'primary'}
            isLoading={isLoading}
            onPress={handleVerify}
            disabled={isLoading || otpCode.length !== 6}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}