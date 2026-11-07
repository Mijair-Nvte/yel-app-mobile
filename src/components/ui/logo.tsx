import React from 'react';
import { View, Text } from 'react-native';

export function Logo() {
  return (
    <View className="items-center mb-8">
      <View className="bg-carbon w-20 h-20 rounded-full items-center justify-center mb-4 shadow-md shadow-carbon/20">
        {/* Aquí puedes reemplazar la 'B' por el icono/svg de Beliv en el futuro */}
        <Text className="text-blanco font-extrabold text-4xl">B</Text>
      </View>
      <Text className="text-carbon font-extrabold text-2xl tracking-tight uppercase">Beliv</Text>
    </View>
  );
}