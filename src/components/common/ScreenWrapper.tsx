// src/components/common/ScreenWrapper.tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';

interface ScreenWrapperProps {
  children: React.ReactNode;
  statusBarStyle?: StatusBarStyle; // 'light' | 'dark' | 'auto'
  backgroundColor?: string;
  style?: ViewStyle;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  statusBarStyle = 'dark', 
  backgroundColor = '#f1f0f7',
  style,
}) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor }, style]}>
      {/* 🚀 Eliminamos el backgroundColor y translucent que daban error de TS en expo-status-bar */}
      <StatusBar style={statusBarStyle} />
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </SafeAreaView>
  );
};