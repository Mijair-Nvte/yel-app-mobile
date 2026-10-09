import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'disabled';
  isLoading?: boolean;
}

export function Button({ title, variant = 'primary', isLoading, className, style, ...props }: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary': return 'bg-white';
      case 'disabled': return 'bg-white/10';
      case 'primary': default: return 'bg-[#E24A85]';
    }
  };

  const getVariantTextStyles = () => {
    switch (variant) {
      case 'secondary': return 'text-[#E24A85]';
      case 'disabled': return 'text-white/40';
      case 'primary': default: return 'text-white';
    }
  };

  // Brillo rosa solo en el botón principal activo
  const glow =
    variant === 'primary'
      ? {
          shadowColor: '#E24A85',
          shadowOpacity: 0.45,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }
      : undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className={`h-14 rounded-2xl items-center justify-center flex-row ${getVariantStyles()} ${className || ''}`}
      style={[glow, style]}
      disabled={variant === 'disabled' || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#E24A85' : '#ffffff'} />
      ) : (
        <Text className={`font-bold text-base tracking-wide ${getVariantTextStyles()}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}