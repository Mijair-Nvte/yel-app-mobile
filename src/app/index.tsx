import React from 'react';
import { View, Image, StatusBar, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#1A0811]">
      <StatusBar barStyle="light-content" />

      {/* Imagen de Fondo */}
      <Image 
        source={require('../../assets/images/bg/BgYEL.png')} 
        style={StyleSheet.absoluteFill} 
        resizeMode="cover" 
      />


      {/* ================= CONTENIDO FRONT (UI) ================= */}
      <SafeAreaView className="flex-1 justify-between pb-10 pt-4">

        {/* Header / Logo */}
        <View className="items-center mt-8">
          <Image
            source={require('../../assets/images/logo/yellogo.png')}
            className="w-48 h-16"
            resizeMode="contain"
          />
        </View>

        {/* Tarjeta Glassmorphism */}
        <View className="px-6 w-full">
          <View className="mb-8">
            <Text className="text-white text-5xl font-extrabold mb-3 tracking-tight leading-tight">
              ¡Bienvenido a{'\n'}la comunidad!
            </Text>
            <Text className="text-gray-200 text-lg font-medium opacity-90">
              ¿Ya Estás Listoo?
            </Text>
          </View>

          <View className="gap-4">
            <Button
              title="Sign Up"
              variant="secondary"
              onPress={() => router.push('/register')}
              className="rounded-full shadow-lg"
            />

            <Button
              title="Log In"
              variant="primary"
              onPress={() => router.push('/login')}
              className="rounded-full shadow-lg bg-[#e43075]"
            />
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}