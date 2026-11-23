import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  isPassword?: boolean;
}

export function Input({ isPassword, className, onFocus, onBlur, style, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const leftIcon = isPassword
    ? 'lock-closed-outline'
    : props.keyboardType === 'email-address'
    ? 'mail-outline'
    : null;

  const iconColor = focused ? '#000000' : '#8C8C8C';

  return (
    <View
      className={`mb-4 h-14 flex-row items-center rounded-full border bg-blanco px-5 ${
        focused ? 'border-negro' : 'border-niebla'
      } ${className || ''}`}
    >
      {leftIcon && (
        <Ionicons name={leftIcon} size={20} color={iconColor} style={{ marginRight: 12 }} />
      )}
      <TextInput
        // Sin "text-base": esa clase agrega lineHeight y en iOS corta la p, j, g, y al escribir
        className="h-full flex-1 font-medium text-negro"
        style={[
          {
            fontSize: 16,
            paddingVertical: 0,
            textAlignVertical: 'center', // Android
            includeFontPadding: false,   // Android
          },
          style,
        ]}
        placeholderTextColor="#8C8C8C"
        selectionColor="#000000"
        cursorColor="#000000"
        secureTextEntry={isPassword && !showPassword}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="pl-3"
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={iconColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}