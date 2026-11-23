import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { courseService, CourseDetail, Lesson } from '@/services/courses/course.service';

export default function CoursePlayerScreen() {
  const router = useRouter();
  const { courseUid } = useLocalSearchParams<{ courseUid: string }>();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // 1. Cargar el curso
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getMyCourseDetail(companyUid, courseUid);
        setCourse(response.data);

        if (response.data.modules?.[0]?.lessons?.[0]) {
          setActiveLesson(response.data.modules[0].lessons[0]);
        }
      } catch {
        Alert.alert('Error', 'No pudimos cargar el curso.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseUid]);

  // 2. Marcar / desmarcar lección como completada
  const handleToggleCompletion = async () => {
    if (!activeLesson || !course) return;

    try {
      setIsToggling(true);
      const response = await courseService.toggleLessonCompletion(companyUid, courseUid, activeLesson.uid);
      const newStatus = response.data.is_completed;

      setActiveLesson((prev) => (prev ? { ...prev, is_completed: newStatus } : null));

      setCourse((prevCourse) => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          modules: prevCourse.modules.map((mod) => ({
            ...mod,
            lessons: mod.lessons.map((lesson) =>
              lesson.uid === activeLesson.uid ? { ...lesson, is_completed: newStatus } : lesson
            ),
          })),
        };
      });
    } catch {
      Alert.alert('Error', 'No pudimos actualizar el progreso de la lección.');
    } finally {
      setIsToggling(false);
    }
  };

  // 3. Reproductor
  const player = useVideoPlayer(activeLesson?.video_url || null, (player) => {
    player.loop = false;
    player.play();
  });

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)} min`;

  if (isLoading) {
    return (
      <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </ScreenWrapper>
    );
  }

  const isCompleted = Boolean(activeLesson?.is_completed);

  return (
    <ScreenWrapper statusBarStyle="light" backgroundColor="#000000">
      {/* Video */}
      <View className="relative w-full bg-negro" style={{ height: 240 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Regresar"
          className="absolute left-4 top-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-negro/60"
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {activeLesson?.video_url ? (
          <VideoView
            player={player}
            style={{ flex: 1 }}
            allowsPictureInPicture
            contentFit="contain"
            nativeControls
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-carbon">
            <Ionicons name="videocam-off-outline" size={36} color="rgba(255,255,255,0.3)" />
            <Text className="mt-2 text-sm font-medium text-blanco/40">Video no disponible</Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      <View className="flex-1 bg-blanco">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Lección actual */}
          <Text className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gris">
            Reproduciendo ahora
          </Text>
          <Text className="mb-4 text-xl font-extrabold leading-tight tracking-tight text-negro">
            {activeLesson?.title}
          </Text>

          <TouchableOpacity
            onPress={handleToggleCompletion}
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

          {/* Módulos */}
          {course?.modules.map((mod, modIndex) => (
            <View key={mod.uid} className="mb-4 overflow-hidden rounded-3xl border border-niebla bg-blanco">
              <View className="border-b border-niebla bg-humo px-5 py-3.5">
                <Text className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-gris">
                  Módulo {modIndex + 1}
                </Text>
                <Text className="text-sm font-bold text-negro">{mod.title}</Text>
              </View>

              {mod.lessons.map((lesson, index) => {
                const isPlaying = activeLesson?.uid === lesson.uid;
                const isLast = index === mod.lessons.length - 1;

                return (
                  <TouchableOpacity
                    key={lesson.uid}
                    onPress={() => setActiveLesson(lesson)}
                    activeOpacity={0.7}
                    className={`flex-row items-center px-5 py-4 ${!isLast ? 'border-b border-niebla' : ''} ${
                      isPlaying ? 'bg-humo' : 'bg-blanco'
                    }`}
                  >
                    {/* Estado */}
                    <View
                      className={`mr-3 h-9 w-9 items-center justify-center rounded-full ${
                        lesson.is_completed
                          ? 'bg-negro'
                          : isPlaying
                          ? 'border-2 border-negro bg-blanco'
                          : 'bg-humo'
                      }`}
                    >
                      <Ionicons
                        name={lesson.is_completed ? 'checkmark' : isPlaying ? 'play' : 'play-outline'}
                        size={15}
                        color={lesson.is_completed ? '#FFFFFF' : isPlaying ? '#000000' : '#8C8C8C'}
                      />
                    </View>

                    <Text
                      className={`flex-1 pr-2 text-sm ${isPlaying ? 'font-bold text-negro' : 'font-medium text-grafito'}`}
                      numberOfLines={2}
                    >
                      {lesson.title}
                    </Text>

                    <Text className={`text-xs font-medium ${isPlaying ? 'text-negro' : 'text-gris'}`}>
                      {formatDuration(lesson.duration_seconds)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}