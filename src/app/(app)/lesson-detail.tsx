// src/app/(app)/lesson-detail.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Linking from 'expo-linking';
import { api } from '@/services/api';
import { Resource } from '@/services/courses/course.service';

export default function LessonDetailScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;

  const { videoUrl, title, lessonUid, courseUid, isCompletedParam, resourcesParam } = useLocalSearchParams<{
    videoUrl: string;
    title: string;
    lessonUid: string;
    courseUid: string;
    isCompletedParam: string;
    resourcesParam: string;
  }>();

  const initialIsCompleted = isCompletedParam === 'true';
  const resources: Resource[] = resourcesParam ? JSON.parse(resourcesParam) : [];

  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isToggling, setIsToggling] = useState(false);

  const player = useVideoPlayer(videoUrl || null, (player) => {
    player.loop = false;
    player.play();
  });

  const toggleCompletion = async () => {
    if (!courseUid || !lessonUid) return;
    try {
      setIsToggling(true);
      const response = await api.post(
        `/academy/companies/${companyUid}/my-courses/${courseUid}/lessons/${lessonUid}/toggle-completion`
      );
      setIsCompleted(response.data.data.is_completed);
    } catch {
      Alert.alert('Error', 'No pudimos actualizar el progreso de la lección.');
    } finally {
      setIsToggling(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Enlace externo';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <SafeAreaView className="flex-1 bg-negro" edges={['top']}>
      <StatusBar style="light" />

      {/* Video */}
      <View className="w-full bg-negro">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Cerrar"
          className="absolute left-4 top-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-negro/60"
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {videoUrl ? (
          <VideoView
            player={player}
            style={{ width: '100%', height: 240 }}
            nativeControls
            contentFit="contain"
            fullscreenOptions={{ enable: true }}
          />
        ) : (
          <View style={{ width: '100%', height: 240 }} className="items-center justify-center bg-carbon">
            <Ionicons name="videocam-off-outline" size={36} color="rgba(255,255,255,0.3)" />
            <Text className="mt-2 text-sm font-medium text-blanco/40">Video no disponible</Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      <View className="flex-1 bg-blanco">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Título y completado */}
          <Text className="mb-4 text-xl font-extrabold leading-tight tracking-tight text-negro">{title}</Text>

          <TouchableOpacity
            onPress={toggleCompletion}
            disabled={isToggling}
            activeOpacity={0.85}
            className={`mb-8 h-11 flex-row items-center justify-center self-start rounded-full px-5 ${
              isCompleted ? 'bg-negro' : 'border border-niebla bg-blanco'
            }`}
          >
            {isToggling ? (
              <ActivityIndicator size="small" color={isCompleted ? '#FFFFFF' : '#000000'} />
            ) : (
              <>
                <Ionicons
                  name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={isCompleted ? '#FFFFFF' : '#000000'}
                />
                <Text className={`ml-2 text-sm font-bold ${isCompleted ? 'text-blanco' : 'text-negro'}`}>
                  {isCompleted ? 'Completada' : 'Marcar como vista'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Recursos */}
          <Text className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gris">
            Recursos de la lección
          </Text>

          {resources.length > 0 ? (
            resources.map((res) => (
              <TouchableOpacity
                key={res.uid}
                onPress={() => res.public_url && Linking.openURL(res.public_url)}
                activeOpacity={0.8}
                className="mb-3 flex-row items-center rounded-2xl border border-niebla bg-blanco p-4"
              >
                <View className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-humo">
                  <Ionicons name="document-text-outline" size={22} color="#000000" />
                </View>
                <View className="mr-2 flex-1">
                  <Text className="text-sm font-bold text-negro" numberOfLines={1}>
                    {res.title || res.file_name}
                  </Text>
                  <Text className="mt-0.5 text-xs text-gris">{formatFileSize(res.file_size)}</Text>
                </View>
                <Ionicons name="download-outline" size={20} color="#3A3A3A" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center rounded-3xl bg-humo py-10">
              <Ionicons name="folder-open-outline" size={36} color="#8C8C8C" />
              <Text className="mt-3 text-center text-sm font-medium text-gris">
                No hay recursos para esta lección.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}