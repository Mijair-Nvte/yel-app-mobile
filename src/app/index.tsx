import React from 'react';
import { View, Image, StatusBar, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    // 👇 Fondo con degradado de la marca: Tiza → tono intermedio → Salvia
    <LinearGradient
      colors={['#EEF0ED', '#CACFC0', '#A6AE93']}
      locations={[0, 0.55, 1]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* 👇 Barra de estado con iconos oscuros para que resalten en el fondo claro */}
      <StatusBar barStyle="dark-content" />

      {/* 👇 Imagen de fondo con opacidad sobre el degradado */}
      <Image
        source={require('../../assets/images/bg/bghause1.jpg')}
        style={[StyleSheet.absoluteFill, { opacity: 0.22 }]}
        resizeMode="cover"
      />

      {/* 👇 Velo del color tiza arriba para que el logo y el título se lean bien */}
      <LinearGradient
        colors={['rgba(238,240,237,0.85)', 'rgba(238,240,237,0)']}
        locations={[0, 0.6]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView className="flex-1 justify-between pb-10 pt-4">

        {/* Header / Logo */}
        <View className="items-center mt-8">
          {/* OJO: Aquí deberás colocar tu nuevo logo de Beliv/Kenneth */}
          <Image
            source={require('../../assets/images/logo/yellogo.png')}
            className="w-48 h-16"
            resizeMode="contain"
            style={{ tintColor: '#141716' }} // 👈 Tint temporal para que el logo blanco se vea oscuro (Color Carbón)
          />
        </View>

        {/* Textos y Botones */}
        <View className="px-6 w-full">
          <View className="mb-10">
            {/* 👇 Copy de la marca en Carbón */}
            <Text className="text-carbon text-5xl font-extrabold mb-3 tracking-tight leading-tight">
              Crecer con{'\n'}claridad.
            </Text>
            {/* 👇 Texto secundario suavizado */}
            <Text className="text-carbon/70 text-lg font-medium">
              Antes de decidir, entiende.
            </Text>
          </View>

          <View className="gap-4">
            {/* Botón Secundario (Blanco con borde salvia sutil) */}
            <Button
              title="Sign Up"
              variant="secondary"
              onPress={() => router.push('/register')}
            />

            {/* Botón Primario (Carbón) */}
            <Button
              title="Log In"
              variant="primary"
              onPress={() => router.push('/login')}
            />
          </View>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}