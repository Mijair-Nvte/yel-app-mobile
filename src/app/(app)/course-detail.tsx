// src/app/(app)/course-detail.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCourseDetail } from '@/hooks/courses/useCourseDetail';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { Button } from '@/components/ui/button';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;

  const { course, isLoading, isEnrolling, error, enroll } = useCourseDetail(companyUid, slug);

  const player = useVideoPlayer(course?.preview_url || null, (player) => {
    player.loop = false;
    player.pause();
  });

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)} min`;

  const totalLessons = course?.modules.reduce((acc, mod) => acc + mod.lessons.length, 0) ?? 0;

  if (isLoading) {
    return (
      <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !course) {
    return (
      <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-humo">
            <Ionicons name="alert-circle-outline" size={26} color="#000000" />
          </View>
          <Text className="mb-6 text-center text-base font-medium text-gris">
            {error || 'No encontramos este curso.'}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 items-center justify-center rounded-full bg-negro px-6"
          >
            <Text className="text-sm font-bold text-blanco">Regresar</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Regresar"
          className="h-11 w-11 items-center justify-center rounded-full bg-humo active:opacity-70"
        >
          <Ionicons name="chevron-back" size={22} color="#000000" />
        </TouchableOpacity>
        <Text className="mr-11 flex-1 text-center text-base font-bold text-negro">Detalle del curso</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Video / portada */}
        {course.preview_url ? (
          <View className="mb-6 h-52 w-full overflow-hidden rounded-3xl bg-negro">
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
            className="mb-6 h-52 w-full rounded-3xl bg-humo"
            resizeMode="cover"
          />
        ) : (
          <View className="mb-6 h-52 w-full items-center justify-center rounded-3xl bg-humo">
            <Ionicons name="image-outline" size={48} color="#8C8C8C" />
          </View>
        )}

        {/* Información */}
        <View className="mb-3 flex-row items-center">
          <View className={`rounded-full px-3 py-1 ${course.is_free ? 'bg-humo' : 'bg-negro'}`}>
            <Text
              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                course.is_free ? 'text-negro' : 'text-blanco'
              }`}
            >
              {course.is_free ? 'Gratis' : `$${course.price}`}
            </Text>
          </View>
          <Text className="ml-3 text-xs font-semibold text-gris">
            {course.modules.length} módulos · {totalLessons} lecciones
          </Text>
        </View>

        <Text className="mb-3 text-2xl font-black leading-tight tracking-tight text-negro">
          {course.title}
        </Text>
        <Text className="mb-6 text-base leading-relaxed text-grafito">{course.description}</Text>

        {/* Acción */}
        {course.is_enrolled ? (
          <View className="mb-8 flex-row items-center justify-center rounded-full bg-humo py-3.5">
            <Ionicons name="checkmark-circle" size={18} color="#000000" />
            <Text className="ml-2 text-sm font-bold text-negro">Ya estás inscrito en este curso</Text>
          </View>
        ) : (
          <View className="mb-8">
            <Button
              title={
                isEnrolling
                  ? 'Procesando...'
                  : course.is_free
                  ? 'Inscribirme gratis'
                  : `Comprar por $${course.price}`
              }
              variant="primary"
              isLoading={isEnrolling}
              onPress={enroll}
              disabled={isEnrolling}
            />
          </View>
        )}

        {/* Contenido */}
        <Text className="mb-4 text-xl font-extrabold tracking-tight text-negro">Contenido del curso</Text>

        {course.modules.map((mod, modIndex) => (
          <View key={mod.uid} className="mb-4 overflow-hidden rounded-3xl border border-niebla bg-blanco">
            <View className="border-b border-niebla bg-humo px-5 py-3.5">
              <Text className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-gris">
                Módulo {modIndex + 1}
              </Text>
              <Text className="text-base font-bold text-negro">{mod.title}</Text>
            </View>

            {mod.lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.uid}
                activeOpacity={lesson.can_watch ? 0.7 : 1}
                className={`flex-row items-center justify-between px-5 py-4 ${
                  index < mod.lessons.length - 1 ? 'border-b border-niebla' : ''
                }`}
                onPress={() => {
                  if (lesson.can_watch) {
                    if (player.playing) player.pause();

                    router.push({
                      pathname: '/lesson-detail',
                      params: {
                        lessonUid: lesson.uid,
                        courseUid: course.uid,
                        videoUrl: lesson.video_url,
                        title: lesson.title,
                        isCompletedParam: lesson.is_completed ? 'true' : 'false',
                        resourcesParam: JSON.stringify(lesson.resources || []),
                      },
                    });
                  } else {
                    Alert.alert('Contenido bloqueado', 'Inscríbete al curso para ver esta lección.');
                  }
                }}
              >
                <View className="mr-3 flex-1 flex-row items-center">
                  <View
                    className={`mr-3 h-9 w-9 items-center justify-center rounded-full ${
                      lesson.can_watch ? 'bg-negro' : 'bg-humo'
                    }`}
                  >
                    <Ionicons
                      name={lesson.can_watch ? 'play' : 'lock-closed'}
                      size={14}
                      color={lesson.can_watch ? '#FFFFFF' : '#8C8C8C'}
                    />
                  </View>
                  <Text
                    className={`flex-1 text-sm font-semibold ${lesson.can_watch ? 'text-negro' : 'text-gris'}`}
                    numberOfLines={2}
                  >
                    {lesson.title}
                  </Text>
                </View>
                <Text className="text-xs font-medium text-gris">{formatDuration(lesson.duration_seconds)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}