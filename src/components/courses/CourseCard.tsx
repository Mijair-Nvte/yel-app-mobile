// src/components/courses/CourseCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CourseCardProps {
  title: string;
  category: string;
  description?: string;
  coverUrl?: string;
  duration?: string;
  progress?: number;
  isFree?: boolean;
  price?: number;
  onPress: () => void;
}

export const CourseCard = ({
  title,
  category,
  description,
  coverUrl,
  duration,
  progress = 0,
  isFree = true,
  price = 0,
  onPress,
}: CourseCardProps) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-5 overflow-hidden rounded-3xl border border-niebla bg-blanco"
    >
      {/* Portada */}
      <View className="h-44 bg-humo">
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Ionicons name="book-outline" size={32} color="#8C8C8C" />
          </View>
        )}

        {/* Precio */}
        <View
          className={`absolute left-3 top-3 rounded-full px-3 py-1 ${isFree ? 'bg-blanco' : 'bg-negro'}`}
        >
          <Text
            className={`text-[11px] font-extrabold uppercase tracking-wider ${
              isFree ? 'text-negro' : 'text-blanco'
            }`}
          >
            {isFree ? 'Gratis' : `$${price}`}
          </Text>
        </View>
      </View>

      {/* Información */}
      <View className="p-5">
        <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-gris">
          {category}
        </Text>

        <Text className="mb-1.5 text-lg font-extrabold leading-tight tracking-tight text-negro" numberOfLines={2}>
          {title}
        </Text>

        {description ? (
          <Text className="mb-3 text-sm leading-relaxed text-gris" numberOfLines={2}>
            {description}
          </Text>
        ) : null}

        {duration ? (
          <View className="flex-row items-center">
            <Ionicons name="layers-outline" size={14} color="#3A3A3A" />
            <Text className="ml-1.5 text-xs font-semibold text-grafito">{duration}</Text>
          </View>
        ) : null}

        {/* Progreso */}
        {safeProgress > 0 && (
          <View className="mt-4 border-t border-niebla pt-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-xs font-semibold text-gris">Tu progreso</Text>
              <Text className="text-xs font-bold text-negro">{Math.round(safeProgress)}%</Text>
            </View>
            <View className="h-1.5 w-full overflow-hidden rounded-full bg-niebla">
              <View
                className="h-full rounded-full bg-negro"
                style={{ width: `${safeProgress}%` as const }}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};