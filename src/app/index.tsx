// src/app/index.tsx
import React from 'react';
import { View, Image as RNImage, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const LOGO = require('../../assets/images/logo/Crealo_logo_blanco.png');
const BACKGROUND = require('../../assets/images/bg/bghause1.jpg');

export default function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const isCompact = height < 700;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Foto de fondo */}
      <RNImage
        source={BACKGROUND}
        style={[StyleSheet.absoluteFill, { opacity: 0.45 }]}
        resizeMode="cover"
      />

      {/* Velo negro: oscuro arriba (logo), abre al centro y cierra abajo (texto y botones) */}
      <LinearGradient
        colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.85)', '#000000']}
        locations={[0, 0.3, 0.62, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView className="flex-1 justify-between px-6 pt-6 pb-6">
        {/* Logo: caja fija + contain = nunca se deforma ni se desborda */}
        <View className="items-center pt-6">
          <Image
            source={LOGO}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Créalo by KNN"
          />
        </View>

        <View>
          {/* Eyebrow */}
          <View className="mb-5 flex-row items-center">
            <View className="mr-3 h-px w-8 bg-white/60" />
            <Text className="text-xs font-bold uppercase tracking-[3px] text-white/70">
              Cursos y eventos
            </Text>
          </View>

          {/* Titular */}
          <Text
            className={`font-black tracking-tight text-white ${
              isCompact ? 'text-5xl leading-[52px]' : 'text-6xl leading-[64px]'
            }`}
          >
            Crecer con{'\n'}claridad.
          </Text>

          <Text className="mt-4 mb-10 text-lg font-medium text-white/70">
            Antes de decidir, entiende.
          </Text>

          {/* Acciones */}
          <View className="gap-3">
            <Pressable
              onPress={() => router.push('/register')}
              accessibilityRole="button"
              className="h-14 items-center justify-center rounded-full bg-white active:opacity-80"
            >
              <Text className="text-base font-bold text-black">Crear cuenta</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/login')}
              accessibilityRole="button"
              className="h-14 items-center justify-center rounded-full border border-white/40 active:bg-white/10"
            >
              <Text className="text-base font-bold text-white">Ya tengo cuenta</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
 
  logo: {
    width: 170,
    height: 140,
  },
});