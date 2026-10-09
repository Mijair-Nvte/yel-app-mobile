import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function Logo() {
  return (
    <View className="items-center mb-10">
      <View
        className="bg-[#E24A85] w-20 h-20 rounded-3xl items-center justify-center mb-4"
        style={{
          shadowColor: '#E24A85',
          shadowOpacity: 0.5,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
        }}
      >
        <Ionicons name="checkmark-outline" size={46} color="white" />
      </View>
      <Text className="text-white font-extrabold text-2xl tracking-tight">Ya Estoy Listo</Text>
    </View>
  );
}