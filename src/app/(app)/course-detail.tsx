// src/app/(app)/course-detail.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video'; // 👈 Nuevo import
import { useCourseDetail } from '@/hooks/courses/useCourseDetail';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;


  const { course, isLoading, isEnrolling, error, enroll } = useCourseDetail(companyUid, slug);

  const player = useVideoPlayer(course?.preview_url || null, (player) => {
    player.loop = false;
    player.pause(); // Opcional: define el estado inicial
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  if (isLoading) {
    return (
      <ScreenWrapper statusBarStyle="dark">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E24A85" />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !course) {
    return (
      <ScreenWrapper statusBarStyle="dark">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-center mb-4">{error || 'Course not found'}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white border border-black/5 px-6 py-2 rounded-full"
          >
            <Text className="text-[#1A0811]">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper statusBarStyle="dark">
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 border-b border-black/5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-white border border-black/5"
        >
          <Ionicons name="chevron-back" size={20} color="#1A0811" />
        </TouchableOpacity>
        <Text className="text-[#1A0811] font-bold text-base flex-1 text-center mr-10">
          Course Details
        </Text>
      </View>

      <ScrollView
        className="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🎬 Reproductor de Preview (Tráiler) o Imagen de respaldo */}
        {course.preview_url ? (
          <View className="w-full h-48 rounded-3xl overflow-hidden border border-black/5 mb-6 bg-black">
            <VideoView
              player={player}
              style={{ flex: 1 }}
              fullscreenOptions={{ enable: true }}
              allowsPictureInPicture
              contentFit="cover"
            />
          </View>
        ) : course.cover_url ? (
          <Image
            source={{ uri: course.cover_url }}
            className="w-full h-48 rounded-3xl border border-black/5 mb-6 bg-white"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-white rounded-3xl border border-black/5 items-center justify-center mb-6 overflow-hidden">
            <Ionicons name="image-outline" size={60} color="rgba(26,8,17,0.2)" />
          </View>
        )}

        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-[#E24A85]/15 px-3 py-1 rounded-full">
              <Text className="text-[#E24A85] text-xs font-bold uppercase">
                {course.is_free ? 'Free Course' : `$${course.price}`}
              </Text>
            </View>
          </View>
          <Text className="text-[#1A0811] text-2xl font-bold mb-2">{course.title}</Text>
          <Text className="text-[#1A0811]/60 text-sm leading-relaxed">{course.description}</Text>
        </View>

        {!course.is_enrolled && (
          <TouchableOpacity
            className={`py-4 rounded-2xl items-center shadow-lg mb-8 ${isEnrolling ? 'bg-[#E24A85]/50' : 'bg-[#E24A85]'}`}
            onPress={enroll}
            disabled={isEnrolling || !course.is_free}
          >
            {isEnrolling ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                {course.is_free ? 'Enroll Now for Free' : `Buy for $${course.price}`}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {course.is_enrolled && (
          <View className="bg-green-500/10 border border-green-500/40 py-3 rounded-2xl items-center mb-8">
            <Text className="text-green-600 font-bold text-sm">✓ You are enrolled in this course</Text>
          </View>
        )}

        <Text className="text-[#1A0811] text-lg font-bold mb-4">Course Content</Text>

        {course.modules.map((mod) => (
          <View key={mod.uid} className="bg-white border border-black/5 rounded-2xl p-4 mb-4">
            <Text className="text-[#1A0811] font-bold text-base mb-3">{mod.title}</Text>

            {mod.lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.uid}
                className="flex-row items-center justify-between py-3 border-t border-black/5"
                onPress={() => {
                  if (lesson.can_watch) {
                    // 🚀 Pausamos el preview usando la API directa de expo-video
                    if (player.playing) {
                      player.pause();
                    }

                    router.push({
                      pathname: '/lesson-detail',
                      params: {
                        lessonUid: lesson.uid,
                        courseUid: course.uid,
                        videoUrl: lesson.video_url,
                        title: lesson.title,
                        isCompletedParam: lesson.is_completed ? 'true' : 'false',
                        // 👇 Convertimos los recursos a string para poder pasarlos por parámetros de navegación
                        resourcesParam: JSON.stringify(lesson.resources || []),
                      },
                    });
                  } else {
                    alert('You must enroll to watch this lesson.');
                  }
                }}
                activeOpacity={lesson.can_watch ? 0.7 : 1}
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${lesson.can_watch ? 'bg-[#E24A85]/15' : 'bg-black/5'}`}
                  >
                    <Ionicons
                      name={lesson.can_watch ? 'play' : 'lock-closed'}
                      size={14}
                      color={lesson.can_watch ? '#E24A85' : 'rgba(26,8,17,0.35)'}
                    />
                  </View>
                  <Text
                    className={`text-sm font-medium flex-1 ${lesson.can_watch ? 'text-[#1A0811]' : 'text-[#1A0811]/40'}`}
                    numberOfLines={1}
                  >
                    {lesson.title}
                  </Text>
                </View>
                <Text className="text-[#1A0811]/40 text-xs">
                  {formatDuration(lesson.duration_seconds)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}