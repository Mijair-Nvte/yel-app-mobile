import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  isPassword?: boolean;
}

export function Input({ isPassword, className, onFocus, onBlur, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const leftIcon = isPassword
    ? 'lock-closed-outline'
    : props.keyboardType === 'email-address'
    ? 'mail-outline'
    : null;

  const iconColor = focused ? '#A6AE93' : 'rgba(166,174,147,0.9)';

  return (
    <View
      className={`flex-row items-center rounded-full mb-4 px-5 h-14 bg-blanco ${className || ''}`}
      style={{
        borderWidth: 1,
        // Salvia sutil en reposo, un poco más presente al enfocar
        borderColor: focused ? 'rgba(166,174,147,0.9)' : 'rgba(166,174,147,0.35)',
      }}
    >
      {leftIcon && (
        <Ionicons name={leftIcon} size={20} color={iconColor} style={{ marginRight: 12 }} />
      )}
      <TextInput
        className="flex-1 text-carbon text-base font-medium"
        placeholderTextColor="rgba(20,23,22,0.4)"
        selectionColor="#A6AE93"
        secureTextEntry={isPassword && !showPassword}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-3">
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