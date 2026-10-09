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
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#161622] border border-white/10 rounded-3xl overflow-hidden mb-5 shadow-lg"
      activeOpacity={0.85}
    >
      {/* Portada del curso */}
      {coverUrl && (
        <Image 
          source={{ uri: coverUrl }} 
          className="w-full h-40 bg-white/5" 
          resizeMode="cover"
        />
      )}

      {/* Reemplazado div por View */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="bg-white/10 px-3 py-1 rounded-full">
            <Text className="text-[#E24A85] text-xs font-bold uppercase tracking-wider">{category}</Text>
          </View>
          <View className="bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            <Text className="text-white/80 text-xs font-semibold">
              {isFree ? 'Free' : `$${price}`}
            </Text>
          </View>
        </View>

        <Text className="text-white text-lg font-bold mb-1">{title}</Text>
        
        {description && (
          <Text className="text-white/60 text-xs mb-3" numberOfLines={2}>
            {description}
          </Text>
        )}
        
        {duration && (
          <Text className="text-white/40 text-xs mb-3">⏱️ {duration}</Text>
        )}

        {/* Barra de Progreso (Si ya está inscrito / tiene avance) */}
        {progress > 0 && (
          <View className="mt-2 pt-3 border-t border-white/5">
            <View className="flex-row justify-between mb-1">
              <Text className="text-white/60 text-xs">Progress</Text>
              <Text className="text-[#E24A85] text-xs font-bold">{progress}%</Text>
            </View>
            <View className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <View className="bg-[#E24A85] h-full rounded-full" style={{ width: `${progress}%` }} />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};