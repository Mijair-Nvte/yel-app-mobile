// src/components/ui/button.tsx
import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'disabled';
  isLoading?: boolean;
}

export function Button({ title, variant = 'primary', isLoading, className, style, ...props }: ButtonProps) {
  // Solo "cargando" se pone en salvia
  const getVariantStyles = () => {
    if (isLoading) return 'bg-salvia';
    switch (variant) {
      case 'secondary': return 'bg-blanco';
      case 'disabled':
      case 'primary': default: return 'bg-carbon shadow-lg shadow-carbon/20';
    }
  };

  const getVariantTextStyles = () => {
    if (isLoading) return 'text-carbon font-semibold';
    switch (variant) {
      case 'secondary': return 'text-carbon font-semibold';
      case 'disabled':
      case 'primary': default: return 'text-blanco font-semibold';
    }
  };

  // Borde salvia sutil solo para el botón secundario (blanco)
  const secondaryBorder =
    variant === 'secondary' && !isLoading
      ? { borderWidth: 1, borderColor: 'rgba(166,174,147,0.35)' }
      : undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      className={`h-14 rounded-full items-center justify-center flex-row ${getVariantStyles()} ${className || ''}`}
      style={[secondaryBorder, style]}
      disabled={variant === 'disabled' || isLoading}
      {...props}
    >
      {isLoading && <ActivityIndicator color="#141716" />}
      <Text className={`text-base ${getVariantTextStyles()} ${isLoading ? 'ml-3' : ''}`}>{title}</Text>
    </TouchableOpacity>
  );
}