import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  isPassword?: boolean;
}

export function Input({ isPassword, className, onFocus, onBlur, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center rounded-2xl mb-4 px-5 h-14 border ${
        focused ? 'border-[#E24A85] bg-[#E24A85]/10' : 'border-white/10 bg-white/[0.06]'
      } ${className || ''}`}
    >
      <TextInput
        className="flex-1 text-white text-base font-medium"
        placeholderTextColor="rgba(255,255,255,0.35)"
        selectionColor="#E24A85"
        secureTextEntry={isPassword && !showPassword}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-3">
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={focused ? '#E24A85' : 'rgba(255,255,255,0.45)'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}