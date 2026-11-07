// src/app/(app)/lesson-detail.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Linking from 'expo-linking';
import { api } from '@/services/api';

export default function LessonDetailScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;

  // Recibimos los nuevos parámetros, incluyendo el curso y el estado de progreso
  const { videoUrl, title, lessonUid, courseUid, isCompletedParam, resourcesParam } = useLocalSearchParams<{
    videoUrl: string;
    title: string;
    lessonUid: string;
    courseUid: string;
    isCompletedParam: string;
    resourcesParam: string;
  }>();

  // Parseamos los recursos y el estado inicial
  const initialIsCompleted = isCompletedParam === 'true';
  const resources = resourcesParam ? JSON.parse(resourcesParam) : [];

  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isToggling, setIsToggling] = useState(false);

  // Reproductor: se limpia solo al desmontar la pantalla
  const player = useVideoPlayer(videoUrl || null, (player) => {
    player.loop = false;
    player.play(); // Auto-play al entrar
  });

  // Consumir API para marcar/desmarcar lección
  const toggleCompletion = async () => {
    if (!courseUid || !lessonUid) return;
    try {
      setIsToggling(true);
      const response = await api.post(
        `/academy/companies/${companyUid}/my-courses/${courseUid}/lessons/${lessonUid}/toggle-completion`
      );
      // El backend devuelve 'is_completed' dentro de data.data
      setIsCompleted(response.data.data.is_completed);
    } catch (error) {
      alert('Error al actualizar el progreso de la lección.');
    } finally {
      setIsToggling(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Enlace externo';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F]" edges={['top']}>
      {/* 🎬 Header & Reproductor Principal */}
      <View className="w-full bg-black">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/50 items-center justify-center border border-white/20"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        {videoUrl ? (
          <VideoView
            player={player}
            style={{ width: '100%', height: 250 }}
            nativeControls
            contentFit="contain"
            fullscreenOptions={{ enable: true }}
          />
        ) : (
          <View style={{ width: '100%', height: 250 }} className="items-center justify-center bg-[#161622]">
            <Ionicons name="videocam-off-outline" size={40} color="rgba(255,255,255,0.2)" />
            <Text className="text-white/40 mt-2">Video not available</Text>
          </View>
        )}
      </View>

      {/* 📚 Área de Contenido */}
      <View className="flex-1 bg-[#0B0B0F]">
        {/* Título y Botón de Completar */}
        <View className="p-5 border-b border-white/10 flex-row items-center justify-between">
          <Text className="text-white text-lg font-bold flex-1 mr-4">{title}</Text>
          
          <TouchableOpacity
            onPress={toggleCompletion}
            disabled={isToggling}
            className={`px-4 py-2 rounded-full flex-row items-center ${
              isCompleted ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/10 border border-white/10'
            }`}
          >
            {isToggling ? (
              <ActivityIndicator size="small" color={isCompleted ? '#22c55e' : 'white'} />
            ) : (
              <>
                <Ionicons 
                  name={isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                  size={18} 
                  color={isCompleted ? "#22c55e" : "white"} 
                />
                <Text className={`ml-2 font-bold text-sm ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                  {isCompleted ? 'Completada' : 'Marcar'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Lista de Recursos (Única vista) */}
        <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
          <Text className="text-white/50 font-bold uppercase tracking-widest text-xs mb-4">
            Recursos de la lección
          </Text>

          {resources.length > 0 ? (
            resources.map((res: any) => (
              <TouchableOpacity
                key={res.uid}
                onPress={() => res.public_url && Linking.openURL(res.public_url)}
                className="flex-row items-center bg-[#161622] p-4 rounded-2xl mb-3 border border-white/10"
              >
                <View className="w-12 h-12 bg-[#E24A85]/10 rounded-full items-center justify-center mr-4">
                  <Ionicons name="document-text" size={24} color="#E24A85" />
                </View>
                <View className="flex-1 mr-2">
                  <Text className="text-white font-semibold text-base" numberOfLines={1}>
                    {res.title || res.file_name}
                  </Text>
                  <Text className="text-white/40 text-xs mt-1">
                    {formatFileSize(res.file_size)}
                  </Text>
                </View>
                <Ionicons name="download-outline" size={22} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Ionicons name="folder-open-outline" size={48} color="rgba(255,255,255,0.1)" />
              <Text className="text-white/40 mt-4 text-center">No hay recursos adjuntos para esta lección.</Text>
            </View>
          )}
          <View className="h-10" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}